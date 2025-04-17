import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Lesson, fetchLessonById } from '../../services/lesson';
import { createEnrollment } from '../../services/enrollment';
import Header from '../../components/Header';
import { Location, fetchLocationById, getLocationUrl } from '../../services/location';
import Swal from 'sweetalert2';
import { getRegionText, Region } from '../../utils/region';
import Image from 'next/image';

interface TeacherProfile {
  name: string;
  university: string;
  major: string;
  career: string;
  profileImageUrl?: string;
}

const LessonDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const currentPage = router.query.page ? Number(router.query.page) : 1;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>({
    name: '이름 미입력',
    university: '미입력',
    major: '미입력',
    career: '미입력'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSchoolLevelText = (level: string) => {
    switch (level) {
      case 'ELEMENTARY':
        return '초등학교';
      case 'MIDDLE':
        return '중학교';
      case 'HIGH':
        return '고등학교';
      default:
        return level;
    }
  };

  const getSubjectText = (subject: string) => {
    switch (subject) {
      case 'MATH':
        return '수학';
      case 'SCIENCE':
        return '과학';
      case 'ENGLISH':
        return '영어';
      case 'KOREAN':
        return '국어';
      default:
        return subject;
    }
  };

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${id}`);
        if (!response.ok) {
          throw new Error('수업 정보를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setLesson(data);
        
        // 선생님 프로필 정보 설정
        setTeacherProfile({
          name: data.name || '이름 미입력',
          university: data.university || '미입력',
          major: data.major || '미입력',
          career: data.career || '미입력',
          profileImageUrl: data.profileImageUrl
        });
      } catch (err) {
        setError('수업 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        await Swal.fire({
          title: '로그인 필요',
          text: '수업 신청을 위해 로그인이 필요합니다.',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: '확인',
          confirmButtonColor: '#1B9AF5',
        });
        router.push('/');
        return;
      }

      // 유의사항 표시
      await Swal.fire({
        title: '수업 신청 유의사항',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold text-blue-800 mb-2">📌 기본 규정</h3>
              <ul class="list-disc pl-4 space-y-1 text-gray-700">
                <li>수업 신청 후 취소는 7일 전까지 가능합니다.</li>
                <li>수업 시작 후 환불은 불가능합니다.</li>
                <li>수업 인원이 최소 인원에 미달할 경우 수업이 취소될 수 있습니다.</li>
              </ul>
            </div>

            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold text-green-800 mb-2">💰 결제 프로세스</h3>
              <ol class="list-decimal pl-4 space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="font-medium">수업 시작전까지 결제를 완료해야 합니다.</span>
                </li>
                <li class="flex items-start">
                  <span class="font-medium">수업 시작 7일전에 자동으로 결제 이메일이 발송됩니다.</span>
                </li>
                <li class="flex items-start">
                  <span class="font-medium">이메일을 통해 선생님의 계좌 정보를 확인하고 직접 송금합니다.</span>
                </li>
                <li class="flex items-start">
                  <span class="font-medium">선생님이 수업료를 확인하면 결제 완료 상태로 변경됩니다.</span>
                </li>
              </ol>
            </div>

            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h3>
              <ul class="list-disc pl-4 space-y-1 text-gray-700">
                <li>수업 시작 후에는 환불이 불가능하니 신중하게 신청해주세요.</li>
                <li>수업 인원이 최소 인원에 미달할 경우 수업이 취소될 수 있습니다.</li>
              </ul>
            </div>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '동의하고 신청하기',
        cancelButtonText: '취소',
        confirmButtonColor: '#1B9AF5',
        cancelButtonColor: '#6B7280',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 신청 확인
          const confirmResult = await Swal.fire({
            title: '수업 신청',
            text: '해당 수업을 신청하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '신청하기',
            cancelButtonText: '취소',
            confirmButtonColor: '#1B9AF5',
            cancelButtonColor: '#6B7280',
          });

          if (confirmResult.isConfirmed) {
            await createEnrollment(Number(id));
            await Swal.fire({
              title: '신청 완료',
              text: '수업 신청이 완료되었습니다.',
              icon: 'success',
              confirmButtonColor: '#1B9AF5',
            });
            router.push(`/lessons/${id}`);
          }
        }
      });
    } catch (error) {
      console.error('수업 신청 중 오류 발생:', error);
      await Swal.fire({
        title: '오류 발생',
        text: '수업 신청 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonColor: '#1B9AF5',
      });
    }
  };

  const handleBackClick = () => {
    router.push({
      pathname: '/lessons',
      query: { page: currentPage }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-[1280px]">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-[1280px]">
          <div className="text-center py-12 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-[1280px]">
          <div className="text-center py-12">수업을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const isFull = lesson.currentStudent >= lesson.maxStudent;
  
  // 할인된 금액 계산 - N빵 계산
  const calculatedAmount = lesson.currentStudent > lesson.minStudent
    ? Math.round(lesson.amount / lesson.currentStudent)
    : lesson.amount;
  
  // 할인율 계산
  const discountRate = lesson.currentStudent > lesson.minStudent
    ? Math.round(((lesson.amount - calculatedAmount) / lesson.amount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-[1280px]">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isFull 
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {isFull ? '모집 완료' : '모집중'}
            </span>
          </div>

          {/* 선생님 정보 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">선생님 정보</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-6">
                  {teacherProfile?.profileImageUrl ? (
                    <Image
                      src={teacherProfile.profileImageUrl}
                      alt="선생님 프로필"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{teacherProfile?.name || '이름 미입력'}</h3>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">대학교</p>
                      <p className="text-gray-900">{teacherProfile?.university || '미입력'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">전공</p>
                      <p className="text-gray-900">{teacherProfile?.major || '미입력'}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-500 text-sm mb-1">경력사항</p>
                    <p className="text-gray-900 whitespace-pre-line">{teacherProfile?.career || '미입력'}</p>
                  </div>
                </div>
              </div>

              <div className="flex mt-6 gap-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {getSchoolLevelText(lesson.schoolLevel)}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {getSubjectText(lesson.subject)}
                </span>
              </div>
            </div>
          </div>

          {/* 수업 설명 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">수업 설명</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 whitespace-pre-wrap break-words">
                {lesson.description}
              </p>
            </div>
          </div>

          {/* 수업 및 모집 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 수업 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">수업 정보</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">과목</span>
                  <span className="text-gray-900 font-medium">{getSubjectText(lesson.subject)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">교육 수준</span>
                  <span className="text-gray-900 font-medium">{getSchoolLevelText(lesson.schoolLevel)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">지역</span>
                  <span className="text-gray-900 font-medium">{getRegionText(lesson.region as Region)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">수업 기간</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(lesson.startDate).toLocaleDateString()} ~ {new Date(lesson.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">모집 마감일</span>
                  <span className="text-gray-900 font-medium">{new Date(lesson.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* 모집 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">모집 정보</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">모집 인원</span>
                  <span className="text-gray-900 font-medium">{lesson.currentStudent}/{lesson.maxStudent}명</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">최소 인원</span>
                  <span className="text-gray-900 font-medium">{lesson.minStudent}명</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">수강료</span>
                  {lesson.currentStudent > lesson.minStudent ? (
                    <div className="text-right">
                      <span className="text-gray-900 font-medium">
                        <span className="line-through text-gray-400 mr-2">₩{lesson.amount.toLocaleString()}</span>
                        ₩{calculatedAmount.toLocaleString()}
                      </span>
                      <p className="text-[#1B9AF5] text-sm mt-1">{discountRate}% 할인</p>
                    </div>
                  ) : (
                    <span className="text-gray-900 font-medium">₩{lesson.amount.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 수업 장소 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">수업 장소</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {location ? (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <a
                      href={getLocationUrl(location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 font-medium hover:text-[#1B9AF5] transition-colors"
                    >
                      {location.locationName}
                    </a>
                    <p className="text-gray-500 text-sm">{location.address}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-900">장소 미정</span>
                </div>
              )}
            </div>
          </div>

          {/* 모집 현황 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">모집 현황</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">현재 인원</span>
                <span className={`font-medium ${isFull ? 'text-red-500' : 'text-[#1B9AF5]'}`}>
                  {lesson.currentStudent}/{lesson.maxStudent}명
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFull ? 'bg-red-500' : 'bg-[#1B9AF5]'
                  }`}
                  style={{ width: `${(lesson.currentStudent / lesson.maxStudent) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 수업 금액 및 신청 버튼 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">수업 금액</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 mb-1">총 수강료</p>
                  {lesson.currentStudent > lesson.minStudent ? (
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        <span className="line-through text-gray-400 mr-2">₩{lesson.amount.toLocaleString()}</span>
                        ₩{calculatedAmount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-[#1B9AF5]/10 text-[#1B9AF5] rounded-full text-sm font-medium">
                          {discountRate}% 할인
                        </span>
                        <div className="flex items-center gap-1 text-sm text-[#1B9AF5]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>최소 {lesson.minStudent}명 이상 모집 시 할인 적용</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₩{lesson.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>최소 {lesson.minStudent}명 모집 시 할인 적용</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isFull 
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-[#1B9AF5] text-white hover:bg-[#1B9AF5]/90'
                  }`}
                  disabled={isFull}
                  onClick={handleEnroll}
                >
                  {isFull ? '모집 완료' : '수업 신청하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetail; 