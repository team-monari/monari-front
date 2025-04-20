import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { regions, getRegionText } from '../../utils/region';
import { locationApi, Location } from '../../services/location';
import Swal from 'sweetalert2';
import LoginModal from '@/components/LoginModal';

interface FormData {
  title: string;
  description: string;
  subject: string;
  schoolLevel: string;
  location: string;
  locationId: number | null;
  region: string;
}

interface FormErrors {
  locationId?: string;
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
    description: '',
    region: ''
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

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

  useEffect(() => {
    if (accessToken) {
      fetchLocations();
    }
  }, [accessToken]);

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

  const handleSelectLocation = async (location: Location) => {
    try {
      setLoading(true);
      setError(null);
      const detailedLocation = await locationApi.getLocation(location.id);
      setSelectedLocation(detailedLocation);
      setFormData(prev => ({
        ...prev,
        location: `${location.locationName}`,
        locationId: location.id
      }));
      setShowLocationList(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('장소 상세 정보를 불러오는데 실패했습니다.');
      }
      console.error('Failed to fetch location details:', err);
    } finally {
      setLoading(false);
    }
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
          region: formData.region
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>스터디 등록 - 모나리</title>
        <meta name="description" content="모나리 스터디 모집 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">스터디 등록</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            {/* 스터디 제목 */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="스터디 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                required
              />
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
                  <option value="영어">영어</option>
                  <option value="국어">국어</option>
                  <option value="SCIENCE">과학</option>
                  <option value="사회">사회</option>
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
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                  required
                >
                  <option value="">지역을 선택해주세요</option>
                  {Object.values(regions).map((region) => (
                    <option key={region} value={region}>
                      {getRegionText(region)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  스터디 장소
                </label>
                <div className="relative">
                  <button
                    id="locationId"
                    type="button"
                    onClick={() => setShowLocationList(!showLocationList)}
                    className={`w-full px-4 py-3 text-left border ${formErrors.locationId ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white`}
                  >
                    {formData.location || '장소를 선택하세요'}
                  </button>
                  {formErrors.locationId && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.locationId}</p>
                  )}
                  {showLocationList && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
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
                      ) : locations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">장소 목록이 없습니다</div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {locations.map((location) => (
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
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#1B9AF5] text-white px-6 py-3 rounded-lg font-medium 
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1B9AF5]/90'} 
                  transition-colors`}
              >
                {loading ? '생성 중...' : '등록'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 