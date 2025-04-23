import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { Region, regionToKorean } from '../../utils/region';
import Image from 'next/image';

// 스터디 상태 타입
type StudyStatus = 'ACTIVE' | 'CLOSED';

// 과목 타입
type Subject = 'MATH' | 'ENGLISH' | 'KOREAN' | 'SCIENCE' | 'SOCIAL';

// 학교 레벨 타입
type SchoolLevel = 'MIDDLE' | 'HIGH';

// 스터디 상세 정보 인터페이스
interface StudyDetail {
  id: number;
  title: string;
  description: string;
  subject: Subject;
  schoolLevel: SchoolLevel;
  status: StudyStatus;
  createdAt: string;
  locationName: string;
  locationServiceUrl: string;
  studentPublicId: string;
  studentName: string;
  region: Region;
  locationX?: string;
  locationY?: string;
}

const getSubjectLabel = (subject: Subject) => {
  switch (subject) {
    case 'MATH': return '수학';
    case 'ENGLISH': return '영어';
    case 'KOREAN': return '국어';
    case 'SCIENCE': return '과학';
    case 'SOCIAL': return '사회';
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
  const { accessToken } = useAuth();
  const [study, setStudy] = useState<StudyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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
        if (study.locationX && study.locationY) {
          // x, y 좌표가 있는 경우
          coords = new window.kakao.maps.LatLng(
            parseFloat(study.locationY),
            parseFloat(study.locationX)
          );
        } else {
          // x, y 좌표가 없는 경우 서울시청 좌표 사용
          coords = new window.kakao.maps.LatLng(
            defaultCoords.lat,
            defaultCoords.lng
          );
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
            ${study.locationName}
            ${!study.locationX || !study.locationY ? '<br><small style="color: #ff6b6b;">(좌표 정보 없음)</small>' : ''}
          </div>`
        });
        infowindow.open(newMap, marker);

        setMap(newMap);
        setMarker(marker);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }
  }, [isMapLoaded, study]);

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
                      {study.locationServiceUrl ? (
                        <a 
                          href={study.locationServiceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-gray-900 hover:text-[#1B9AF5] hover:underline"
                        >
                          {study.locationName}
                        </a>
                      ) : (
                        <p className="font-medium text-gray-900">{study.locationName}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">({regionToKorean[study.region]})</p>
                    </div>
                  </div>
                  <div id="map" className="w-full h-[300px] rounded-lg shadow-md" style={{ background: '#f8f9fa' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 