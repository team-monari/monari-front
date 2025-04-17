import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { locationApi, Location } from '../../services/location';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { regions, getRegionText } from '../../utils/region';
import { inputStyles } from '../../utils/styles';

interface FormData {
  title: string;
  description: string;
  price: string;
  minStudents: string;
  maxStudents: string;
  location: string;
  locationId: number | null;
  startDate: Date | null;
  endDate: Date | null;
  educationLevel: 'MIDDLE' | 'HIGH';
  subject: 'MATH' | 'SCIENCE';
  grade: 'FIRST' | 'SECOND' | 'THIRD';
  region: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  minStudent?: string;
  maxStudent?: string;
  locationId?: string;
  amount?: string;
  dateRange?: string;
  region?: string;
}

const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
  '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
];

const CreateLessonPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    minStudents: '',
    maxStudents: '',
    location: '',
    locationId: null,
    startDate: null,
    endDate: null,
    educationLevel: 'MIDDLE',
    subject: 'MATH',
    grade: 'FIRST',
    region: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

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

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setFormData(prev => ({
      ...prev,
      startDate: dates[0],
      endDate: dates[1]
    }));
  };

  const handleChange = (field: keyof FormData, value: string | number | Date | null) => {
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      const numericValue = value === '' ? 0 : parseInt(value);
      setFormData(prev => ({ ...prev, price: numericValue.toString() }));
      setFormattedPrice(value === '' ? '' : numericValue.toLocaleString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 검증
    const errors: FormErrors = {};
    let firstErrorField: string | null = null;

    if (!formData.title.trim()) {
      errors.title = '수업 제목을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'title';
    }

    if (!formData.description.trim()) {
      errors.description = '수업 설명을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'description';
    }

    if (!formData.price || formData.price === '0') {
      errors.amount = '수업 가격을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'amount';
    }

    if (!formData.minStudents || parseInt(formData.minStudents) < 1) {
      errors.minStudent = '최소 인원을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'minStudent';
    }

    if (!formData.maxStudents || parseInt(formData.maxStudents) < parseInt(formData.minStudents)) {
      errors.maxStudent = '최대 인원은 최소 인원보다 크거나 같아야 합니다.';
      if (!firstErrorField) firstErrorField = 'maxStudent';
    }

    if (!formData.locationId) {
      errors.locationId = '수업 장소를 선택해주세요.';
      if (!firstErrorField) firstErrorField = 'locationId';
    }

    if (!formData.startDate || !formData.endDate) {
      errors.dateRange = '수업 기간을 선택해주세요.';
      if (!firstErrorField) firstErrorField = 'dateRange';
    }

    if (!formData.region) {
      errors.region = '지역을 선택해주세요.';
      if (!firstErrorField) firstErrorField = 'region';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      // 첫 번째 에러 필드로 스크롤
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
      return;
    }

    try {
      const result = await Swal.fire({
        title: '수업 개설',
        html: `
          <div class="text-left">
            <p class="mb-4">수업을 개설하시겠습니까?</p>
            <div class="bg-yellow-50 p-4 rounded-lg mb-4">
              <p class="text-yellow-800 font-semibold mb-2">⚠️ 환불 정책 안내</p>
              <ul class="text-yellow-700 text-sm list-disc pl-4">
                <li>수업 시작 7일 전까지는 전액 환불이 가능합니다.</li>
                <li>수업 시작 이후에는 환불이 불가능합니다.</li>
              </ul>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800 font-semibold mb-2">📅 수업 기간 안내</p>
              <ul class="text-blue-700 text-sm list-disc pl-4">
                <li>수업 시작일: ${formData.startDate ? formData.startDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '미정'}</li>
                <li>수업 종료일: ${formData.endDate ? formData.endDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '미정'}</li>
                <li>모집 마감일: ${formData.startDate ? new Date(formData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '미정'}</li>
              </ul>
            </div>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '개설하기',
        cancelButtonText: '취소',
        confirmButtonColor: '#1B9AF5',
        cancelButtonColor: '#6B7280',
      });

      if (result.isConfirmed) {
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
          deadline: deadline.toISOString().split('T')[0],
          region: formData.region
        };

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(lessonData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.data) {
            setFormErrors(errorData.data);
            return;
          }
          throw new Error('수업 개설에 실패했습니다.');
        }

        await Swal.fire({
          title: '수업 개설 완료',
          text: '수업이 성공적으로 개설되었습니다.',
          icon: 'success',
          confirmButtonColor: '#1B9AF5',
        });

        router.push('/lessons');
      }
    } catch (error) {
      console.error('수업 개설 중 오류 발생:', error);
      await Swal.fire({
        title: '오류 발생',
        text: '수업 개설 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonColor: '#1B9AF5',
      });
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
      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">수업 생성</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  수업 제목
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border ${formErrors.title ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                  placeholder="수업 제목을 입력하세요"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  수업 설명
                </label>
                <div className="space-y-4">
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className={`w-full px-4 py-3 border ${formErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all min-h-[400px] break-words whitespace-pre-wrap`}
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
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    수업 가격
                  </label>
                  <div className="relative">
                    <input
                      id="amount"
                      type="text"
                      value={formattedPrice}
                      onChange={handlePriceChange}
                      className={`w-full px-4 py-3 border ${formErrors.amount ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                      placeholder="수업 가격을 입력하세요"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">원</span>
                    {formErrors.amount && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    모집 인원
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        id="minStudent"
                        type="number"
                        value={formData.minStudents}
                        onChange={(e) => handleChange('minStudents', Number(e.target.value))}
                        className={`w-full px-4 py-3 border ${formErrors.minStudent ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                        placeholder="최소 인원"
                      />
                      {formErrors.minStudent && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.minStudent}</p>
                      )}
                    </div>
                    <div>
                      <input
                        id="maxStudent"
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => handleChange('maxStudents', Number(e.target.value))}
                        className={`w-full px-4 py-3 border ${formErrors.maxStudent ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                        placeholder="최대 인원"
                      />
                      {formErrors.maxStudent && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.maxStudent}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  수업 기간
                </label>
                <div id="dateRange">
                  <DatePicker
                    selectsRange={true}
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    onChange={handleDateRangeChange}
                    minDate={new Date()}
                    maxDate={formData.startDate ? new Date(formData.startDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="수업 기간을 선택하세요"
                    className="w-full"
                    required
                  />
                  {formData.startDate && (
                    <div className="mt-2 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-700">
                        모집 마감일: {new Date(formData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                        <p className="text-xs text-blue-600">
                          ※ 수업 기간은 최대 30일까지만 설정 가능합니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {formErrors.dateRange && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.dateRange}</p>
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
                  지역
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className={inputStyles.base}
                  required
                >
                  <option value="">지역을 선택해주세요</option>
                  {Object.values(regions).map((region) => (
                    <option key={region} value={region}>
                      {getRegionText(region)}
                    </option>
                  ))}
                </select>
                {formErrors.region && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.region}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  수업 장소
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
      </main>
    </div>
  );
};

export default CreateLessonPage; 