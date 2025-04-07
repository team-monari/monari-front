import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { locationApi, Location } from '../../services/location';

interface FormData {
  title: string;
  description: string;
  price: number;
  minStudents: number;
  maxStudents: number;
  location: string;
  locationId: number | null;
  period: string;
  educationLevel: string;
  subject: string;
}

const CreateLessonPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    minStudents: 4,
    maxStudents: 7,
    location: '',
    locationId: null,
    period: '',
    educationLevel: '',
    subject: ''
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

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

  const handleChange = (field: keyof FormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
    // TODO: API 호출 로직 구현
    router.push('/lessons');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">수업 개설하기</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                placeholder="수업 제목을 입력하세요"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                rows={4}
                placeholder="수업 설명을 입력하세요"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 가격
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                  placeholder="수업 가격을 입력하세요"
                />
                <span className="absolute right-3 top-2 text-gray-500">원</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                모집 인원
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">최소 인원</label>
                  <input
                    type="number"
                    value={formData.minStudents}
                    onChange={(e) => handleChange('minStudents', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                    placeholder="최소 인원"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">최대 인원</label>
                  <input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleChange('maxStudents', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                    placeholder="최대 인원"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 기간
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => handleChange('period', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                placeholder="예: 2024년 3월 ~ 6월"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                교육 대상
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleChange('educationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
              >
                <option value="">선택하세요</option>
                <option value="초등">초등학생</option>
                <option value="중등">중학생</option>
                <option value="고등">고등학생</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                과목
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
              >
                <option value="">선택하세요</option>
                <option value="국어">국어</option>
                <option value="영어">영어</option>
                <option value="수학">수학</option>
                <option value="과학">과학</option>
                <option value="사회">사회</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 장소
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLocationList(!showLocationList)}
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5] bg-white"
                >
                  {formData.location || '장소를 선택하세요'}
                </button>
                {showLocationList && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                      <ul>
                        {locations.map((location) => (
                          <li
                            key={location.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
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
              {selectedLocation && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-medium mb-2">선택된 장소 정보</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">장소명:</span> {selectedLocation.locationName}
                    </div>
                    <div>
                      <span className="font-medium">서비스 소분류:</span> {selectedLocation.serviceSubcategory}
                    </div>
                    <div>
                      <span className="font-medium">서비스 상태:</span> {selectedLocation.serviceStatus}
                    </div>
                    <div>
                      <span className="font-medium">결제 방법:</span> {selectedLocation.paymentMethod}
                    </div>
                    <div>
                      <span className="font-medium">등록 가능 기간:</span> {selectedLocation.registrationStartDateTime} ~ {selectedLocation.registrationEndDateTime}
                    </div>
                    <div>
                      <span className="font-medium">취소 가능 기간:</span> {selectedLocation.cancellationStartDateTime} ~ {selectedLocation.cancellationEndDateTime}
                    </div>
                    <div>
                      <span className="font-medium">취소 정책:</span> {selectedLocation.cancellationPolicyInfo}
                    </div>
                    <div>
                      <span className="font-medium">취소 마감일:</span> {selectedLocation.cancellationDeadline}일 전
                    </div>
                    {selectedLocation.serviceUrl && (
                      <div>
                        <span className="font-medium">서비스 URL:</span>{' '}
                        <a
                          href={selectedLocation.serviceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1B9AF5] hover:underline"
                        >
                          바로가기
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#1B9AF5] text-white rounded-md hover:bg-[#1B9AF5]/90"
              >
                수업 개설하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLessonPage; 