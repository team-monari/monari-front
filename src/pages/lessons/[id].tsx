import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Lesson, fetchLessonById } from '../../services/lesson';
import { createEnrollment } from '../../services/enrollment';
import Header from '../../components/Header';
import { Location, fetchLocationById, getLocationUrl } from '../../services/location';
import Swal from 'sweetalert2';
import { getRegionText, Region } from '../../utils/region';
import Image from 'next/image';
import Link from 'next/link';
import { naverToKakao } from '../../utils/coordinate';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getSubjectText, Subject } from '../../types/lesson';
import { useAuth } from '../../contexts/AuthContext';
import Head from 'next/head';

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
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { user } = useAuth();
  const [myTeacherProfile, setMyTeacherProfile] = useState<any>(null);

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

  const getLessonTypeInfo = (type: string) => {
    if (!type) {
      return {
        text: '알 수 없음',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-600',
        icon: null
      };
    }

    switch (type.toUpperCase()) {
      case 'ONLINE':
        return {
          text: '온라인',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        };
      case 'OFFLINE':
        return {
          text: '오프라인',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        };
      default:
        return {
          text: '알 수 없음',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          icon: null
        };
    }
  };

  const getStatusInfo = (status: string, currentStudent: number, maxStudent: number) => {
    if (!status) {
      return {
        text: '알 수 없음',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800'
      };
    }

    // 수업 인원이 꽉 찼을 경우 모집 완료로 표시
    if (currentStudent >= maxStudent) {
      return {
        text: '모집 완료',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800'
      };
    }

    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return {
          text: '모집중',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'CLOSED':
        return {
          text: '종료',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
      case 'CANCELED':
        return {
          text: '취소',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      default:
        return {
          text: '알 수 없음',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  const fetchLessonData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${id}`);
      if (!response.ok) {
        throw new Error('수업 정보를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setLesson(data);

      // 장소 정보 설정
      if (data.locationId) {
        let latitude = 0, longitude = 0;
        if (data.x && data.y) {
          const kakaoCoords = naverToKakao(parseFloat(data.x), parseFloat(data.y));
          latitude = kakaoCoords.lat;
          longitude = kakaoCoords.lng;
        }
        setLocation({
          id: Number(data.locationId),
          locationName: data.locationName,
          address: data.locationName, // 주소 정보가 없어서 locationName으로 대체
          latitude,
          longitude,
          serviceUrl: data.serviceUrl || '',
          serviceStatus: '예약가능',
          serviceSubcategory: '학원',
          paymentMethod: '현장결제',
          cancellationDeadline: 24, // 24시간 전
          region: data.region || '서울'
        });
      }

      // 선생님 프로필 정보 설정
      setTeacherProfile({
        name: data.name || '이름 미입력',
        university: data.university || '미입력',
        major: data.major || '미입력',
        career: data.career || '미입력'
      });
    } catch (err) {
      setError('수업 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, [id, router.query.refresh]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_ID}&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
        console.log('Kakao Maps loaded successfully');
      });
    };

    script.onerror = (error) => {
      console.error('Failed to load Kakao Maps:', error);
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded && location && window.kakao) {
      const container = document.getElementById('map');
      if (!container) return;

      try {
        // 서울시청 좌표 (기본값)
        const defaultCoords = {
          lat: 37.5665,
          lng: 126.9780
        };

        let coords;
        if (location.longitude && location.latitude) {
          coords = new window.kakao.maps.LatLng(location.latitude, location.longitude);
        } else {
          coords = new window.kakao.maps.LatLng(defaultCoords.lat, defaultCoords.lng);
          console.warn('Location coordinates not found, using default coordinates (Seoul City Hall)');
        }

        const options = {
          center: coords,
          level: 3
        };

        const newMap = new window.kakao.maps.Map(container, options);
        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: coords,
          map: newMap
        });

        // 인포윈도우로 장소에 대한 설명을 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">
            ${location.locationName}
            ${!location.longitude || !location.latitude ? '<br><small style="color: #ff6b6b;">(좌표 정보 없음)</small>' : ''}
          </div>`
        });
        infowindow.open(newMap, marker);

        setMap(newMap);
        setMarker(marker);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }
  }, [isMapLoaded, location]);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(data => setMyTeacherProfile(data));
    }
  }, []);

  const handleEnroll = async () => {
    if (lesson && lesson.status !== 'ACTIVE') {
      await Swal.fire({
        title: '신청 불가',
        text: '이 수업은 더 이상 신청할 수 없습니다.',
        icon: 'warning',
        confirmButtonColor: '#1B9AF5',
      });
      return;
    }

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
                <li><b>수업 신청 전, 반드시 선생님이 명시한 환불 규정을 확인하세요.</b></li>
                <li>환불 정책은 선생님이 직접 명시합니다.</li>
                <li>수업 취소는 모집 마감일(데드라인) 이전까지만 가능하며, 100% 환불됩니다.</li>
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
            await new Promise(res => setTimeout(res, 700));
            router.push(`/lessons/${id}?refresh=${Date.now()}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>{lesson ? `${lesson.title} - 모나리` : '과외 상세 - 모나리'}</title>
          <meta name="description" content="모나리 과외 상세 페이지" />
        </Head>
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
        <Head>
          <title>{lesson ? `${lesson.title} - 모나리` : '과외 상세 - 모나리'}</title>
          <meta name="description" content="모나리 과외 상세 페이지" />
        </Head>
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

  // getStatusInfo 호출 부분 수정
  const statusInfo = getStatusInfo(lesson.status, lesson.currentStudent, lesson.maxStudent);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{lesson ? `${lesson.title} - 모나리` : '과외 상세 - 모나리'}</title>
        <meta name="description" content="모나리 과외 상세 페이지" />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-[1280px]">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <div className="flex gap-2">
              <div className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 ${getLessonTypeInfo(lesson.lessonType).bgColor} ${getLessonTypeInfo(lesson.lessonType).textColor}`}>
                {getLessonTypeInfo(lesson.lessonType).icon}
                {getLessonTypeInfo(lesson.lessonType).text}
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                {statusInfo.text}
              </div>
            </div>
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
                  {getSubjectText(lesson.subject as Subject)}
                </span>
              </div>
            </div>
          </div>

          {/* 수업 설명 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">수업 설명</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.description}
                </ReactMarkdown>
              </div>
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
                  <span className="text-gray-900 font-medium">{getSubjectText(lesson.subject as Subject)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">교육 수준</span>
                  <span className="text-gray-900 font-medium">{getSchoolLevelText(lesson.schoolLevel)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">지역</span>
                  <span className="text-gray-900 font-medium">
                    {lesson.region === 'ONLINE'
                      ? '온라인'
                      : getRegionText(lesson.region as Region)}
                  </span>
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
              {lesson.lessonType === 'ONLINE' ? (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-blue-700 font-semibold">온라인</span>
                </div>
              ) : location ? (
                <div className="space-y-4">
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
                  <div id="map" className="w-full h-[300px] rounded-lg shadow-md" style={{ background: '#f8f9fa' }}></div>
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
              <div className="flex flex-col gap-4">
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
                  <div className="flex flex-col gap-2">
                    <button
                      className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors w-full ${
                        isFull || lesson.status !== 'ACTIVE'
                          ? 'bg-gray-500 text-white cursor-not-allowed'
                          : 'bg-[#1B9AF5] text-white hover:bg-[#1B9AF5]/90'
                      }`}
                      disabled={isFull || lesson.status !== 'ACTIVE'}
                      onClick={handleEnroll}
                    >
                      {isFull ? '모집 완료' : lesson.status !== 'ACTIVE' ? '신청 불가' : '수업 신청하기'}
                    </button>
                    {/* 개설자에게만 노출되는 수정 버튼 */}
                    {myTeacherProfile && lesson.publicTeacherId && myTeacherProfile.publicId && String(myTeacherProfile.publicId) === String(lesson.publicTeacherId) && (
                      <button
                        className="px-6 py-3 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors w-full"
                        onClick={() => router.push(`/lessons/${lesson.lessonId}/edit`)}
                      >
                        수정하기
                      </button>
                    )}
                  </div>
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