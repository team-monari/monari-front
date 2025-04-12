import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

// Location 인터페이스를 API 응답 구조에 맞게 수정
interface Location {
  id: number;
  serviceSubcategory: string;
  serviceStatus: string;
  paymentMethod: string;
  locationName: string;
  serviceUrl: string;
  registrationStartDateTime: string;
  registrationEndDateTime: string;
  cancellationStartDateTime: string;
  cancellationEndDateTime: string;
  cancellationPolicyInfo: string;
  cancellationDeadline: number;
}

interface FormData {
  title: string;
  description: string;
  subject: string;
  schoolLevel: string;
  location: string;
}

export default function CreateStudy() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    schoolLevel: '',
    subject: '',
    location: '',
    description: ''
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // API 호출 함수
  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/locations`);
      if (!response.ok) {
        throw new Error('장소 정보를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      console.log('API Response:', data); 
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '장소 정보를 불러오는데 실패했습니다.');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 장소 데이터 로드
  useEffect(() => {
    fetchLocations();
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = Number(e.target.value);
    const location = locations.find(loc => loc.id === locationId) || null;
    setSelectedLocation(location);
    setFormData(prev => ({
      ...prev,
      location: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
          locationId: Number(formData.location),
        })
      });

      if (!response.ok) {
        throw new Error('스터디 생성에 실패했습니다.');
      }

      // const data = await response.json();
      console.log('스터디 생성 성공:');
      router.push('/studies');
      
    } catch (error) {
      console.error('Error:', error);
      alert('스터디 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="schoolLevel" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  장소 선택
                </label>
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B9AF5]"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-sm mb-2">{error}</div>
                ) : (
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleLocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                    required
                  >
                    <option value="">장소를 선택하세요</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.locationName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

            </div>

            {/* 스터디 상세 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
                disabled={isLoading}
                className={`bg-[#1B9AF5] text-white px-6 py-3 rounded-lg font-medium 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1B9AF5]/90'} 
                  transition-colors`}
              >
                {isLoading ? '생성 중...' : '등록'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 