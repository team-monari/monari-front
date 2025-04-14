import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Lesson, fetchLessonById } from '../../services/lesson';
import { createEnrollment } from '../../services/enrollment';
import Header from '../../components/Header';
import { Location, fetchLocationById, getLocationUrl } from '../../services/location';
import Swal from 'sweetalert2';
import { getRegionText } from '../../utils/region';

const LessonDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const currentPage = router.query.page ? Number(router.query.page) : 1;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
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
    if (id) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const data = await fetchLessonById(Number(id));
      setLesson(data);
      
      if (data.locationId) {
        const locationData = await fetchLocationById(data.locationId);
        setLocation(locationData);
      }
    } catch (err) {
      setError('수업 정보를 불러오는데 실패했습니다.');
      console.error('Error loading lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!lesson) return;
    
    try {
      const result = await Swal.fire({
        title: '수업 신청 전 유의사항',
        html: `
          <div class="text-left space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900">1. 수업 취소 정책</h3>
              <p class="text-gray-600 text-sm mt-1">
                - 수업 시작 7일 전까지 취소 가능합니다.<br>
                - 취소 시 수강료는 전액 환불됩니다.
              </p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">2. 수업 인원</h3>
              <p class="text-gray-600 text-sm mt-1">
                - 최소 인원(${lesson.minStudent}명) 미달 시 수업이 취소될 수 있습니다.<br>
                - 최대 인원(${lesson.maxStudent}명) 초과 시 신청이 불가능합니다.
              </p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">3. 수강료 안내</h3>
              <p class="text-gray-600 text-sm mt-1">
                - 현재 인원: ${lesson.currentStudent}명<br>
                - 1인당 수강료: ₩${calculatedAmount.toLocaleString()}<br>
                - 할인율: ${discountRate}%
              </p>
            </div>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '신청하기',
        cancelButtonText: '취소',
        confirmButtonColor: '#1B9AF5',
        cancelButtonColor: '#6B7280',
        width: '500px',
        padding: '2rem',
      });

      if (result.isConfirmed) {
        await createEnrollment(lesson.lessonId);
        await Swal.fire({
          title: '신청 완료',
          text: '수업 신청이 완료되었습니다.',
          icon: 'success',
          confirmButtonColor: '#1B9AF5',
        });
        router.push('/lessons');
      }
    } catch (error) {
      await Swal.fire({
        title: '신청 실패',
        text: '수업 신청에 실패했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonColor: '#1B9AF5',
      });
      console.error(error);
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
  const calculatedAmount = lesson.currentStudent >= lesson.minStudent
    ? Math.round(lesson.amount / lesson.currentStudent)
    : lesson.amount;
  
  // 할인율 계산
  const discountRate = lesson.currentStudent >= lesson.minStudent
    ? Math.round(((lesson.amount - calculatedAmount) / lesson.amount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-[1280px]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              뒤로가기
            </button>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                isFull 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {isFull ? '모집 완료' : '모집중'}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {getSchoolLevelText(lesson.schoolLevel)}
                </span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {getSubjectText(lesson.subject)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">수업 설명</h3>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap break-words">{lesson.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">수업 정보</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">과목</span>
                        <span className="text-gray-900 font-medium">{getSubjectText(lesson.subject)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">교육 수준</span>
                        <span className="text-gray-900 font-medium">{getSchoolLevelText(lesson.schoolLevel)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">지역</span>
                        <span className="text-gray-900 font-medium">{getRegionText(lesson.region)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">수업 기간</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(lesson.startDate).toLocaleDateString()} ~ {new Date(lesson.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">모집 마감일</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(lesson.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">모집 정보</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">모집 인원</span>
                        <span className="text-gray-900 font-medium">{lesson.currentStudent}/{lesson.maxStudent}명</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">최소 인원</span>
                        <span className="text-gray-900 font-medium">{lesson.minStudent}명</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">수강료</span>
                        <span className="text-gray-900 font-medium">{lesson.amount.toLocaleString()}원</span>
                      </div>
                      {lesson.currentStudent >= lesson.minStudent && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">할인된 수강료</span>
                          <span className="text-[#1B9AF5] font-medium">
                            {Math.floor(lesson.amount * (1 - lesson.discountRate / 100)).toLocaleString()}원
                            <span className="ml-2 text-sm text-gray-500">({lesson.discountRate}% 할인)</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">수업 장소</h2>
                {location ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <a
                          href={getLocationUrl(location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 font-medium hover:text-[#1B9AF5] transition-colors"
                        >
                          {location.locationName}
                        </a>
                        <p className="text-gray-500 text-sm">{location.address}</p>
                        <p className="text-gray-500 text-sm">{location.detailAddress}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600">장소 미정</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold">모집 현황</h2>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">현재 인원</span>
                  <span className={`font-medium ${isFull ? 'text-red-500' : 'text-[#1B9AF5]'}`}>
                    {lesson.currentStudent}/{lesson.maxStudent}명
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${isFull ? 'bg-red-500' : 'bg-[#1B9AF5]'} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${(lesson.currentStudent / lesson.maxStudent) * 100}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">수업 금액</h2>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-gray-600">총 수강료</span>
                        <span className="text-2xl font-bold text-gray-900">₩{lesson.amount.toLocaleString()}</span>
                      </div>
                      
                      {lesson.currentStudent >= lesson.minStudent && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">현재 인원</span>
                            <span className="text-gray-900">{lesson.currentStudent}명</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#1B9AF5] font-medium">1인당 수강료</span>
                            <span className="text-xl font-bold text-[#1B9AF5]">₩{calculatedAmount.toLocaleString()}</span>
                            <span className="text-sm font-medium text-[#1B9AF5]">
                              ({discountRate}% 할인)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
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
        </div>
      </main>
    </div>
  );
};

export default LessonDetail; 