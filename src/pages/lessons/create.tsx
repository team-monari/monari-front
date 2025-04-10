import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { locationApi, Location } from '../../services/location';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormData {
  title: string;
  description: string;
  price: number;
  minStudents: number;
  maxStudents: number;
  location: string;
  locationId: number | null;
  startDate: Date | null;
  endDate: Date | null;
  educationLevel: 'MIDDLE' | 'HIGH';
  subject: 'MATH' | 'SCIENCE';
  grade: 'FIRST' | 'SECOND' | 'THIRD';
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
    startDate: null,
    endDate: null,
    educationLevel: 'MIDDLE',
    subject: 'MATH',
    grade: 'FIRST'
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [formattedPrice, setFormattedPrice] = useState<string>('');

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

  const handleChange = (field: keyof FormData, value: string | number | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    setFormData(prev => ({
      ...prev,
      startDate: dates[0],
      endDate: dates[1]
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      const numericValue = value === '' ? 0 : parseInt(value);
      setFormData(prev => ({ ...prev, price: numericValue }));
      setFormattedPrice(value === '' ? '' : numericValue.toLocaleString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Calculate deadline (startDate - 7 days if no date range is selected)
      const deadline = formData.startDate 
        ? new Date(formData.startDate)
        : new Date();
      deadline.setDate(deadline.getDate() - 7);

      const lessonData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        schoolLevel: formData.educationLevel,
        minStudent: formData.minStudents,
        maxStudent: formData.maxStudents,
        amount: formData.price,
        startDate: formData.startDate?.toISOString().split('T')[0],
        endDate: formData.endDate?.toISOString().split('T')[0],
        locationId: formData.locationId,
        grade: formData.grade,
        status: 'ACTIVE',
        deadline: deadline.toISOString().split('T')[0]
      };

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch('http://localhost:8080/api/v1/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        throw new Error('수업 개설에 실패했습니다.');
      }

      router.push('/lessons');
    } catch (error) {
      console.error('Failed to create lesson:', error);
      setError(error instanceof Error ? error.message : '수업 개설에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container {
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          background-color: white;
          transition: all 0.2s;
        }
        .react-datepicker__input-container input:focus {
          outline: none;
          border-color: #1B9AF5;
          box-shadow: 0 0 0 3px rgba(27, 154, 245, 0.1);
        }
        .react-datepicker {
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        .react-datepicker__day--selected {
          background-color: #1B9AF5;
          color: white;
        }
        .react-datepicker__day--selected:hover {
          background-color: #1B9AF5;
        }
      `}</style>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">새로운 수업 개설하기</h1>
          <p className="mt-2 text-gray-600">수업 정보를 입력하고 개설하세요</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  수업 제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all"
                  placeholder="수업 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  수업 설명
                </label>
                <div className="space-y-4">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all min-h-[400px]"
                    placeholder={`1. 수업 목표
- 중2 수학 내신 1등급 달성
- 기초 개념부터 심화 문제까지 체계적 학습
- 개인별 맞춤형 학습 관리

2. 수업 방식
- 매주 수요일 오후 3시~5시 수업 진행
- 실시간 문제 풀이 및 개념 설명
- 주간 테스트로 성취도 확인

3. 커리큘럼
- 1개월차: 기초 개념 정리
- 2개월차: 심화 문제 풀이
- 3개월차: 실전 문제 및 기출 분석`}
                  />
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-medium text-blue-800 mb-2">수업 설명 작성 가이드</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 수업의 목표와 기대효과를 구체적으로 작성해주세요.</li>
                      <li>• 수업 진행 방식과 시간을 명확하게 안내해주세요.</li>
                      <li>• 월별 또는 주차별 커리큘럼을 상세히 설명해주세요.</li>
                      <li>• 학생들의 참여와 피드백 방식을 포함해주세요.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    수업 가격
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formattedPrice}
                      onChange={handlePriceChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all"
                      placeholder="수업 가격을 입력하세요"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">원</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    모집 인원
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        value={formData.minStudents}
                        onChange={(e) => handleChange('minStudents', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all"
                        placeholder="최소 인원"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => handleChange('maxStudents', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all"
                        placeholder="최대 인원"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  수업 기간
                </label>
                <DatePicker
                  selectsRange={true}
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={handleDateRangeChange}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="수업 기간을 선택하세요"
                  className="w-full"
                  required
                />
                {formData.startDate && (
                  <div className="mt-2 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700">
                      모집 마감일: {new Date(formData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-blue-600">
                        ※ 모집 마감일은 수업 시작일 7일 전으로 자동 설정됩니다.
                      </p>
                      <p className="text-xs text-blue-600">
                        ※ 수업 시작일 전까지는 수정이 가능하며, 시작일 이후에는 수정이 불가능합니다.
                      </p>
                      <p className="text-xs text-blue-600">
                        ※ 모집 마감일 전까지는 수업 취소가 가능합니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    교육 대상
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => handleChange('educationLevel', e.target.value as 'MIDDLE' | 'HIGH')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                  >
                    <option value="MIDDLE">중학교</option>
                    <option value="HIGH">고등학교</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    학년
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => handleChange('grade', e.target.value as 'FIRST' | 'SECOND' | 'THIRD')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                  >
                    {formData.educationLevel === 'MIDDLE' ? (
                      <>
                        <option value="FIRST">1학년</option>
                        <option value="SECOND">2학년</option>
                        <option value="THIRD">3학년</option>
                      </>
                    ) : (
                      <>
                        <option value="FIRST">1학년</option>
                        <option value="SECOND">2학년</option>
                        <option value="THIRD">3학년</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  과목
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value as 'MATH' | 'SCIENCE')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                >
                  <option value="MATH">수학</option>
                  <option value="SCIENCE">과학</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  수업 장소
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLocationList(!showLocationList)}
                    className="w-full px-4 py-3 text-left border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                  >
                    {formData.location || '장소를 선택하세요'}
                  </button>
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
                            {selectedLocation.registrationStartDateTime.split('T')[0]} ~ {selectedLocation.registrationEndDateTime.split('T')[0]}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">취소 가능 기간</div>
                          <div className="font-medium text-gray-800">
                            {selectedLocation.cancellationStartDateTime.split('T')[0]} ~ {selectedLocation.cancellationEndDateTime.split('T')[0]}
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
            </div>

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
                className="px-6 py-3 text-sm font-medium text-white bg-[#1B9AF5] rounded-xl hover:bg-[#1B9AF5]/90 transition-colors"
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