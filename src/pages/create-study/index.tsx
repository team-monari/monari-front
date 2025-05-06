import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { regions, Region, getRegionText } from '../../utils/region';
import { locationApi, Location } from '../../services/location';
import { generalLocationApi, GeneralLocation } from '../../services/generalLocation';
import { naverToKakao } from '../../utils/coordinate';
import Swal from 'sweetalert2';
import LoginModal from '@/components/LoginModal';

interface FormData {
  title: string;
  description: string;
  subject: string;
  schoolLevel: string;
  location: string;
  locationId: number | null;
  generalLocationId: number | null;
  region: Region | null;
  isOnline: boolean;
  latitude: number | null;
  longitude: number | null;
}

interface FormErrors {
  locationId?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function CreateStudy() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    schoolLevel: '',
    subject: '',
    location: '',
    locationId: null,
    generalLocationId: null,
    description: '',
    region: null,
    isOnline: false,
    latitude: null,
    longitude: null
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [generalLocations, setGeneralLocations] = useState<GeneralLocation[]>([]);
  const [selectedGeneralLocation, setSelectedGeneralLocation] = useState<GeneralLocation | null>(null);
  const [showGeneralLocationList, setShowGeneralLocationList] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [filteredGeneralLocations, setFilteredGeneralLocations] = useState<GeneralLocation[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        const result = await Swal.fire({
          title: '로그인 필요',
          text: '스터디 개설은 회원 기능입니다. 로그인하시겠습니까?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
          confirmButtonColor: '#1B9AF5',
          cancelButtonColor: '#6B7280',
          allowOutsideClick: false,
          allowEscapeKey: false
        });

        if (result.isConfirmed) {
          setShowLoginModal(true);
        } else {
          router.push('/');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [accessToken, router]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await locationApi.getLocations();
      setLocations(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('장소 목록을 불러오는데 실패했습니다.');
      }
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneralLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generalLocationApi.getLocations();
      setGeneralLocations(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('장소 목록을 불러오는데 실패했습니다.');
      }
      console.error('Failed to fetch general locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchLocations();
      fetchGeneralLocations();
    }
  }, [accessToken]);

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
    if (isMapLoaded && (selectedLocation || selectedGeneralLocation) && window.kakao) {
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
        
        if (selectedLocation?.x && selectedLocation?.y) {
          // location의 x, y 좌표가 있는 경우
          coords = new window.kakao.maps.LatLng(
            parseFloat(selectedLocation.y),
            parseFloat(selectedLocation.x)
          );
          locationName = selectedLocation.locationName;
        } else if (selectedGeneralLocation?.x && selectedGeneralLocation?.y) {
          // generalLocation의 x, y 좌표가 있는 경우
          const kakaoCoords = naverToKakao(parseFloat(selectedGeneralLocation.x), parseFloat(selectedGeneralLocation.y));
          coords = new window.kakao.maps.LatLng(kakaoCoords.lat, kakaoCoords.lng);
          locationName = selectedGeneralLocation.locationName;
        } else {
          // 좌표가 없는 경우 서울시청 좌표 사용
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
            ${locationName || '위치 정보 없음'}
            ${(!selectedLocation?.x || !selectedLocation?.y) && (!selectedGeneralLocation?.x || !selectedGeneralLocation?.y) ? '<br><small style="color: #ff6b6b;">(좌표 정보 없음)</small>' : ''}
          </div>`
        });
        infowindow.open(newMap, marker);

        setMap(newMap);
        setMarker(marker);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }
  }, [isMapLoaded, selectedLocation, selectedGeneralLocation]);

  // 지역 선택에 따른 장소 필터링
  useEffect(() => {
    const filterLocationsByRegion = async () => {
      try {
        // 공공시설 장소 필터링
        const locations = await locationApi.getLocations();
        const filtered = formData.region
          ? locations.filter(location => {
              const locationRegion = location.region?.toUpperCase() as Region;
              return locationRegion === formData.region;
            })
          : locations;
        setFilteredLocations(filtered);

        // 일반 장소 필터링
        const generalLocations = await generalLocationApi.getLocations();
        const filteredGeneral = formData.region
          ? generalLocations.filter(location => {
              const locationRegion = location.region?.toUpperCase() as Region;
              return locationRegion === formData.region;
            })
          : generalLocations;
        setFilteredGeneralLocations(filteredGeneral);
      } catch (err) {
        console.error('Failed to filter locations by region:', err);
      }
    };

    filterLocationsByRegion();
  }, [formData.region]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B9AF5]"></div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-[1280px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">스터디 개설은 회원만 이용할 수 있는 기능입니다.</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-[#1B9AF5] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1B9AF5]/90 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </main>
        {showLoginModal && <LoginModal isOpen={true} onClose={() => setShowLoginModal(false)} initialRole="student" />}
      </div>
    );
  }

  const handleSelectLocation = (location: Location) => {
    if (!location.x || !location.y) {
      console.warn('Location coordinates are missing');
      return;
    }
    setSelectedLocation(location);
    setSelectedGeneralLocation(null);
    setFormData(prev => ({
      ...prev,
      locationId: location.id,
      generalLocationId: null,
      location: location.locationName,
      latitude: location.y ? parseFloat(location.y) : null,
      longitude: location.x ? parseFloat(location.x) : null
    }));
    setShowLocationList(false);
    setShowGeneralLocationList(false);
  };

  const handleSelectGeneralLocation = (location: GeneralLocation) => {
    if (!location.x || !location.y) {
      console.warn('Location coordinates are missing');
      return;
    }
    setSelectedGeneralLocation(location);
    setSelectedLocation(null);
    setFormData(prev => ({
      ...prev,
      generalLocationId: location.id,
      locationId: null,
      location: location.locationName,
      latitude: location.y ? parseFloat(location.y) : null,
      longitude: location.x ? parseFloat(location.x) : null
    }));
    setShowGeneralLocationList(false);
    setShowLocationList(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          schoolLevel: formData.schoolLevel,
          locationId: formData.locationId,
          generalLocationId: formData.generalLocationId,
          region: formData.region,
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      });

      if (!response.ok) {
        throw new Error('스터디 생성에 실패했습니다.');
      }

      await Swal.fire({
        title: '스터디 개설 완료',
        text: '스터디가 성공적으로 개설되었습니다.',
        icon: 'success',
        confirmButtonColor: '#1B9AF5',
      });

      router.push('/studies');
      
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        title: '오류 발생',
        text: '스터디 개설 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonColor: '#1B9AF5',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOnlineToggle = () => {
    setFormData(prev => ({
      ...prev,
      isOnline: !prev.isOnline,
      location: !prev.isOnline ? '온라인' : '',
      locationId: null,
      generalLocationId: null,
      region: null,
      latitude: null,
      longitude: null
    }));
    setSelectedLocation(null);
    setSelectedGeneralLocation(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'region' ? (value ? value as Region : null) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>스터디 개설 - 모나리</title>
        <meta name="description" content="모나리 스터디 모집 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">스터디 개설</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            {/* 스터디 유형 선택 */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                스터디 유형
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleOnlineToggle()}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    !formData.isOnline
                      ? 'border-[#1B9AF5] bg-[#1B9AF5]/5'
                      : 'border-gray-200 hover:border-[#1B9AF5]/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">오프라인 스터디</span>
                    <span className="text-sm text-gray-500 text-center">직접 만나서 진행하는 스터디</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleOnlineToggle()}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.isOnline
                      ? 'border-[#1B9AF5] bg-[#1B9AF5]/5'
                      : 'border-gray-200 hover:border-[#1B9AF5]/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">온라인 스터디</span>
                    <span className="text-sm text-gray-500 text-center">화상회의로 진행하는 스터디</span>
                  </div>
                </button>
              </div>
              {formData.isOnline === undefined && (
                <p className="mt-2 text-sm text-red-500">스터디 유형을 선택해주세요.</p>
              )}
            </div>

            {/* 스터디 제목 */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                제목
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="스터디 제목을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent pr-12"
                  maxLength={100}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                  {formData.title.length}/100
                </div>
              </div>
            </div>

            {/* 대상과 과목 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  대상
                </label>
                <select
                  id="schoolLevel"
                  name="schoolLevel"
                  value={formData.schoolLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                  required
                >
                  <option value="">대상을 선택하세요</option>
                  <option value="MIDDLE">중학교</option>
                  <option value="HIGH">고등학교</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  과목
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                  required
                >
                  <option value="">과목을 선택하세요</option>
                  <option value="MATH">수학</option>
                  <option value="ENGLISH">영어</option>
                  <option value="KOREAN">국어</option>
                  <option value="SCIENCE">과학</option>
                  <option value="SOCIETY">사회</option>
                </select>
              </div>
            </div>

            {/* 장소 선택 */}
            <div className="space-y-4">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  지역
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent ${
                    formData.isOnline ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={formData.isOnline}
                  required={!formData.isOnline}
                >
                  <option value="">지역을 선택해주세요</option>
                  {formData.isOnline ? (
                    <option value="ONLINE">온라인</option>
                  ) : (
                    Object.values(regions).map((region) => (
                      <option key={region} value={region}>
                        {getRegionText(region)}
                      </option>
                    ))
                  )}
                </select>
                {formData.region && !formData.isOnline && (
                  <div className="mt-2 text-sm text-gray-500">
                    {getRegionText(formData.region)} 지역의 장소만 표시됩니다.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  스터디 장소
                </label>
                <div className="relative">
                  <button
                    id="locationId"
                    type="button"
                    onClick={() => {
                      setShowLocationList(!showLocationList);
                      setShowGeneralLocationList(false);
                    }}
                    disabled={formData.isOnline}
                    className={`w-full px-4 py-3 text-left border ${formErrors.locationId ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white ${
                      formData.isOnline ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {formData.isOnline ? '온라인' : formData.location || '장소를 선택하세요'}
                  </button>
                  {formErrors.locationId && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.locationId}</p>
                  )}
                  {showLocationList && !formData.isOnline && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-800 mb-2">서울시 공공시설</h3>
                        {loading ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B9AF5] mx-auto mb-2"></div>
                            로딩 중...
                          </div>
                        ) : error ? (
                          <div className="p-4 text-center">
                            <div className="text-red-500 mb-2">{error}</div>
                            <button
                              onClick={fetchLocations}
                              className="text-sm text-[#1B9AF5] hover:text-[#1B9AF5]/80"
                            >
                              다시 시도
                            </button>
                          </div>
                        ) : filteredLocations.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            {formData.region ? '해당 지역의 장소가 없습니다.' : '장소 목록이 없습니다'}
                          </div>
                        ) : (
                          <ul className="divide-y divide-gray-200">
                            {filteredLocations.map((location) => (
                              <li
                                key={location.id}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectLocation(location)}
                              >
                                <div className="font-medium">{location.locationName}</div>
                                <div className="text-sm text-gray-500">{location.serviceSubcategory}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2">일반 장소</h3>
                        {loading ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B9AF5] mx-auto mb-2"></div>
                            로딩 중...
                          </div>
                        ) : error ? (
                          <div className="p-4 text-center">
                            <div className="text-red-500 mb-2">{error}</div>
                            <button
                              onClick={fetchGeneralLocations}
                              className="text-sm text-[#1B9AF5] hover:text-[#1B9AF5]/80"
                            >
                              다시 시도
                            </button>
                          </div>
                        ) : filteredGeneralLocations.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            {formData.region ? '해당 지역의 장소가 없습니다.' : '장소 목록이 없습니다'}
                          </div>
                        ) : (
                          <ul className="divide-y divide-gray-200">
                            {filteredGeneralLocations.map((location) => (
                              <li
                                key={location.id}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectGeneralLocation(location)}
                              >
                                <div className="font-medium">{location.locationName}</div>
                                <div className="text-sm text-gray-500">{location.region}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {selectedLocation && (
                <div className="mt-4 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">선택된 장소 정보</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedLocation.serviceStatus === '예약마감' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {selectedLocation.serviceStatus}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div id="map" className="w-full h-[300px] rounded-lg shadow-md" style={{ background: '#f8f9fa' }}></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">장소명</div>
                        <div className="font-medium text-gray-800">{selectedLocation.locationName}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">서비스 소분류</div>
                        <div className="font-medium text-gray-800">{selectedLocation.serviceSubcategory}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">결제 방법</div>
                      <div className="font-medium text-gray-800">{selectedLocation.paymentMethod}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">등록 가능 기간</div>
                        <div className="font-medium text-gray-800">
                          {selectedLocation.registrationStartDateTime?.split('T')[0] ?? '미정'} ~ {selectedLocation.registrationEndDateTime?.split('T')[0] ?? '미정'}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">취소 가능 기간</div>
                        <div className="font-medium text-gray-800">
                          {selectedLocation.cancellationStartDateTime?.split('T')[0] ?? '미정'} ~ {selectedLocation.cancellationEndDateTime?.split('T')[0] ?? '미정'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">취소 정책</div>
                        <div className="font-medium text-gray-800">{selectedLocation.cancellationPolicyInfo}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">취소 마감일</div>
                        <div className="font-medium text-gray-800">{selectedLocation.cancellationDeadline}일 전</div>
                      </div>
                    </div>

                    {selectedLocation.serviceUrl && (
                      <div className="mt-4">
                        <a
                          href={selectedLocation.serviceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          서비스 바로가기
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedGeneralLocation && (
                <div className="mt-4 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">선택된 장소 정보</h3>
                  </div>
                  <div className="space-y-4">
                    <div id="map" className="w-full h-[300px] rounded-lg shadow-md" style={{ background: '#f8f9fa' }}></div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">장소명</div>
                      <div className="font-medium text-gray-800">{selectedGeneralLocation.locationName}</div>
                    </div>
                    
                    {selectedGeneralLocation.serviceUrl && (
                      <div className="mt-4">
                        <a
                          href={selectedGeneralLocation.serviceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          서비스 바로가기
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 스터디 상세 설명 */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                상세 설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={15}
                placeholder={`[스터디 모집 내용 예시]

- 스터디 주제:

- 스터디 목표:

- 예상 스터디 일정(횟수):

- 예상 커리큘럼 간략히:

- 예상 모집인원:

- 연락 방법(채팅앱, 이메일 등):

`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent resize-none"
                required
              />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-white bg-[#1B9AF5] rounded-xl hover:bg-[#1B9AF5]/90 transition-colors"
              >
                {loading ? '생성 중...' : '개설하기'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 