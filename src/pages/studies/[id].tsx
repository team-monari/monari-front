import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { Region, regionToKorean } from '../../utils/region';
import Image from 'next/image';
import { naverToKakao } from '../../utils/coordinate';
import Swal from 'sweetalert2';
import { generalLocationApi, GeneralLocation } from '../../services/generalLocation';
import { locationApi, Location } from '../../services/location';

// 스터디 상태 타입
type StudyStatus = 'ACTIVE' | 'CLOSED';

// 과목 타입
type Subject = 'MATH' | 'ENGLISH' | 'KOREAN' | 'SCIENCE' | 'SOCIETY';

// 학교 레벨 타입
type SchoolLevel = 'MIDDLE' | 'HIGH';

// 스터디 상세 정보 인터페이스
interface StudyDetail {
  id: number;
  title: string;
  description: string;
  subject: 'MATH' | 'ENGLISH' | 'KOREAN' | 'SCIENCE' | 'SOCIETY';
  schoolLevel: 'MIDDLE' | 'HIGH';
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
  studyType: 'ONLINE' | 'OFFLINE';
  locationId: number | null;
  generalLocationId: number | null;
  studentPublicId: string;
  studentName: string;
  region: Region;
}

const getSubjectLabel = (subject: Subject) => {
  switch (subject) {
    case 'MATH': return '수학';
    case 'ENGLISH': return '영어';
    case 'KOREAN': return '국어';
    case 'SCIENCE': return '과학';
    case 'SOCIETY': return '사회';
    default: return subject;
  }
};

const getStatusLabel = (status: StudyStatus) => {
  switch (status) {
    case 'ACTIVE': return '모집중';
    case 'CLOSED': return '모집완료';
    default: return status;
  }
};

const getStatusColor = (status: StudyStatus) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800';
    case 'CLOSED': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function StudyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { accessToken, user } = useAuth();
  const [study, setStudy] = useState<StudyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [locationDetails, setLocationDetails] = useState<Record<number, GeneralLocation>>({});
  const [studyLocations, setStudyLocations] = useState<Record<number, Location>>({});

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = `${baseUrl}/api/v1/students/me`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        setStudentProfile(data);
      } catch (err) {
        console.error("학생 프로필 조회 실패:", err);
      }
    };

    if (accessToken) {
      fetchStudentProfile();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchStudyDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {};
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies/${id}`,
          {
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('스터디 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setStudy(data);

        // Fetch location details if it's an offline study
        if (data.studyType === 'OFFLINE') {
          if (data.generalLocationId) {
            try {
              const location = await generalLocationApi.getLocation(data.generalLocationId);
              setLocationDetails(prev => ({
                ...prev,
                [data.generalLocationId]: location
              }));
            } catch (err) {
              console.error('Failed to fetch general location details:', err);
            }
          } else if (data.locationId) {
            try {
              const location = await locationApi.getLocation(data.locationId);
              setStudyLocations(prev => ({
                ...prev,
                [data.locationId]: location
              }));
            } catch (err) {
              console.error('Failed to fetch location details:', err);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '스터디 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyDetail();
  }, [id, accessToken]);

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

  const getLocationName = (study: StudyDetail): string | null => {
    if (study.generalLocationId && locationDetails[study.generalLocationId]) {
      return locationDetails[study.generalLocationId].locationName;
    }
    if (study.locationId && studyLocations[study.locationId]) {
      return studyLocations[study.locationId].locationName;
    }
    return null;
  };

  const getLocationUrl = (study: StudyDetail): string | null => {
    if (study.generalLocationId && locationDetails[study.generalLocationId]) {
      return locationDetails[study.generalLocationId].serviceUrl;
    }
    if (study.locationId && studyLocations[study.locationId]) {
      return studyLocations[study.locationId].serviceUrl;
    }
    return null;
  };

  const handleLocationClick = (study: StudyDetail) => {
    const url = getLocationUrl(study);
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (isMapLoaded && study && window.kakao) {
      const container = document.getElementById('map');
      if (!container) return;

      try {
        // 서울시청 좌표 (기본값)
        const defaultCoords = {
          lat: 37.5665,
          lng: 126.9780
        };

        let coords;
        let locationName;
        
        if (study.studyType === 'OFFLINE') {
          if (study.locationId && studyLocations[study.locationId]) {
            // location API 데이터 사용
            const location = studyLocations[study.locationId];
            if (location.x && location.y) {
              coords = new window.kakao.maps.LatLng(
                parseFloat(location.y),
                parseFloat(location.x)
              );
              locationName = location.locationName;
            } else {
              coords = new window.kakao.maps.LatLng(defaultCoords.lat, defaultCoords.lng);
              locationName = '위치 정보 없음';
            }
          } else if (study.generalLocationId && locationDetails[study.generalLocationId]) {
            // generalLocation API 데이터 사용
            const location = locationDetails[study.generalLocationId];
            if (location.x && location.y) {
              const kakaoCoords = naverToKakao(
                parseFloat(location.x),
                parseFloat(location.y)
              );
              coords = new window.kakao.maps.LatLng(
                kakaoCoords.lat,
                kakaoCoords.lng
              );
              locationName = location.locationName;
            } else {
              coords = new window.kakao.maps.LatLng(defaultCoords.lat, defaultCoords.lng);
              locationName = '위치 정보 없음';
            }
          } else {
            // 좌표가 없는 경우 기본 좌표 사용
            coords = new window.kakao.maps.LatLng(defaultCoords.lat, defaultCoords.lng);
            locationName = '위치 정보 없음';
          }
        } else {
          // 온라인 스터디인 경우 기본 좌표 사용
          coords = new window.kakao.maps.LatLng(defaultCoords.lat, defaultCoords.lng);
          locationName = '온라인 스터디';
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
            ${locationName}
            ${(!study.locationId && !study.generalLocationId) ? '<br><small style="color: #ff6b6b;">(좌표 정보 없음)</small>' : ''}
          </div>`
        });
        infowindow.open(newMap, marker);

        setMap(newMap);
        setMarker(marker);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }
  }, [isMapLoaded, study, locationDetails, studyLocations]);

  const handleStatusToggle = async () => {
    if (!study || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      const newStatus = study.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies/${study.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('스터디 상태 변경에 실패했습니다.');
      }

      // Update local state
      setStudy(prev => prev ? { ...prev, status: newStatus } : null);

      // Show success modal
      await Swal.fire({
        title: '상태 변경 완료',
        text: `스터디가 ${getStatusLabel(newStatus)} 상태로 변경되었습니다.`,
        icon: 'success',
        confirmButtonColor: '#1B9AF5',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      // Show error modal
      await Swal.fire({
        title: '오류 발생',
        text: err instanceof Error ? err.message : '스터디 상태 변경 중 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonColor: '#1B9AF5',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-8 max-w-[1280px]">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AF5]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-8 max-w-[1280px]">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error || '스터디 정보를 찾을 수 없습니다.'}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{study.title} - 모나리</title>
        <meta name="description" content="모나리 스터디 상세 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="max-w-3xl mx-auto">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span></span>
          </button>

          <div className="bg-white rounded-lg p-8 shadow-sm">
            {/* 제목 및 상태 */}
            <div className="mb-6 relative">
              <div className="absolute top-0 right-0">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(study.status)}`}>
                  <span>{getStatusLabel(study.status)}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">{study.title}</h1>
              <div className="flex items-center text-gray-500 text-sm">
                <span>{study.studentName}</span>
                <span className="mx-2">·</span>
                <span>{new Date(study.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* 태그 영역 */}
            <div className="flex gap-2 mb-8">
              <span className={`px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100`}>
                {study.schoolLevel === 'MIDDLE' ? '중학교' : '고등학교'}
              </span>
              <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                {getSubjectLabel(study.subject)}
              </span>
            </div>

            {/* 스터디 설명 */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="whitespace-pre-line text-gray-700">
                  {study.description.split('\n').map((line, index) => (
                    line.trim() && (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* 스터디 장소 */}
            <div>
              <h2 className="text-lg font-bold mb-4">스터디 장소</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      {study.studyType === 'ONLINE' ? (
                        <p className="font-medium text-gray-900">온라인 스터디</p>
                      ) : (
                        <>
                          <p 
                            className="font-medium text-gray-900 cursor-pointer hover:text-[#1B9AF5] transition-colors"
                            onClick={() => handleLocationClick(study)}
                          >
                            {getLocationName(study)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{regionToKorean[study.region]}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {study.studyType === 'OFFLINE' && (
                    <div id="map" className="w-full h-[300px] rounded-lg shadow-md" style={{ background: '#f8f9fa' }}></div>
                  )}
                </div>
              </div>
            </div>

            {/* 스터디 상태 변경 버튼 (작성자만 보임) */}
            {study && studentProfile && studentProfile.publicId === study.studentPublicId && (
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => router.push(`/studies/${study.id}/edit`)}
                  className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  수정하기
                </button>
                <button
                  onClick={handleStatusToggle}
                  disabled={isUpdatingStatus}
                  className="px-6 py-3 bg-[#1B9AF5] text-white rounded-lg font-medium hover:bg-[#1688D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>변경중...</span>
                    </div>
                  ) : (
                    <span>모집 상태 변경</span>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
} 