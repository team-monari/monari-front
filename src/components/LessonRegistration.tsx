import React, { useState, useEffect } from 'react';
import { PublicServiceLocation } from '../types/lesson';
import { publicServiceApi } from '../services/publicService';

interface LessonRegistrationProps {
  onSubmit: (lessonData: any) => void;
}

const LessonRegistration: React.FC<LessonRegistrationProps> = ({ onSubmit }) => {
  const [locations, setLocations] = useState<PublicServiceLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<PublicServiceLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lessonData, setLessonData] = useState({
    educationLevel: '중등',
    subject: '수학',
    title: '',
    description: '',
    minStudents: '3',
    maxStudents: '4',
    monthlyFee: '',
    startDate: '',
    endDate: '',
    location: '장소 선택하기',
    fundingDeadline: ''
  });

  const fetchAllLocations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // 충분히 큰 숫자를 사용하여 모든 데이터를 가져옴
      const data = await publicServiceApi.getLocations(1, 1000);
      setLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      setError('장소 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownClick = () => {
    if (!isDropdownOpen && locations.length === 0) {
      fetchAllLocations();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(lessonData);
  };

  const calculateFundingDeadline = (startDate: string, revStdDay: string) => {
    if (!startDate || !revStdDay) return '';
    
    const start = new Date(startDate);
    // 숫자만 추출하고 음수로 변환하여 시작일에서 빼기
    const daysToSubtract = -parseInt(revStdDay.replace(/[^0-9]/g, '')) || 0;
    const deadline = new Date(start);
    deadline.setDate(deadline.getDate() + daysToSubtract);
    
    return deadline.toISOString().split('T')[0];
  };

  const calculateReservationDeadline = (startDate: string, revStdDay: string) => {
    if (!startDate || !revStdDay) return '';
    
    const start = new Date(startDate);
    // 숫자만 추출
    const daysToSubtract = parseInt(revStdDay.replace(/[^0-9]/g, '')) || 0;
    
    // 시작일에서 일수를 빼기
    const deadline = new Date(start.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    
    // YYYY-MM-DD 형식으로 변환
    const year = deadline.getFullYear();
    const month = String(deadline.getMonth() + 1).padStart(2, '0');
    const day = String(deadline.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    
    if (name === 'location') {
      try {
        setError(null);
        const selectedLocationData = locations.find(loc => loc.SVCID === value);
        if (selectedLocationData) {
          setSelectedLocation(selectedLocationData);
          setLessonData(prev => ({
            ...prev,
            [name]: selectedLocationData.SVCNM
          }));
          setIsDropdownOpen(false);
        } else {
          throw new Error('선택한 장소를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch location details:', error);
        setError(error instanceof Error ? error.message : '장소 정보를 불러오는데 실패했습니다.');
        setSelectedLocation(null);
        setLessonData(prev => ({
          ...prev,
          [name]: '장소 선택하기'
        }));
      }
    } else {
      setLessonData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        
        if ((name === 'startDate' || name === 'location') && selectedLocation) {
          newData.fundingDeadline = calculateFundingDeadline(
            name === 'startDate' ? value : prev.startDate,
            selectedLocation.REVSTDDAY
          );
        }
        
        return newData;
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-[#1B9AF5]">수업 개설</h1>
      <p className="text-gray-600 mb-8">현재 진행중인 인기 팀딩 프로젝트를 확인해보세요</p>
      
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">교육 대상</label>
              <select
                name="educationLevel"
                value={lessonData.educationLevel}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                <option value="중등">중등</option>
                <option value="고등">고등</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">과목</label>
              <select
                name="subject"
                value={lessonData.subject}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                <option value="수학">수학</option>
                <option value="영어">영어</option>
                <option value="국어">국어</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">수업 제목</label>
            <input
              type="text"
              name="title"
              placeholder="예: 중2 내신 수학 1등급 만들기"
              value={lessonData.title}
              onChange={handleChange}
              className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">수업 설명</label>
            <textarea
              name="description"
              placeholder="수업 명식, 대상, 커리큘럼, 수업 시간 등을 자세히 설명해주세요 (예: 매주 수요일 오후 3시~5시 수업 진행)"
              value={lessonData.description}
              onChange={handleChange}
              className="w-full h-32 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">최소 정원</label>
              <select
                name="minStudents"
                value={lessonData.minStudents}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}명</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">최대 정원</label>
              <select
                name="maxStudents"
                value={lessonData.maxStudents}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}명</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">월 수업 총액</label>
            <div className="relative flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="monthlyFee"
                  placeholder="900,000"
                  value={lessonData.monthlyFee}
                  onChange={handleChange}
                  className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">원</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">수업 시작일</label>
              <input
                type="date"
                name="startDate"
                value={lessonData.startDate}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">수업 종료일</label>
              <input
                type="date"
                name="endDate"
                value={lessonData.endDate}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">수업 장소</label>
            <div className="relative">
              <div
                onClick={handleDropdownClick}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none cursor-pointer flex items-center justify-between"
              >
                <span className={selectedLocation ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedLocation ? `${selectedLocation.SVCNM} (${selectedLocation.AREANM})` : '장소 선택하기'}
                </span>
                <div className="flex items-center">
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1B9AF5] mr-2"></div>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {locations.map(location => (
                    <div
                      key={location.SVCID}
                      onClick={() => handleChange({ target: { name: 'location', value: location.SVCID } } as any)}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      {location.SVCNM} ({location.AREANM})
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          {selectedLocation && lessonData.startDate && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">예약 취소 정책</h3>
              <p className="text-sm text-blue-700">
                {selectedLocation.REVSTDDAYNM}: {selectedLocation.REVSTDDAY}일 전까지 취소 가능
              </p>
              {selectedLocation.TELNO && (
                <p className="text-sm text-blue-700 mt-1">
                  문의: {selectedLocation.TELNO}
                </p>
              )}
              <p className="text-sm text-blue-700 mt-1">
                예약 마감일: {calculateReservationDeadline(lessonData.startDate, selectedLocation.REVSTDDAY)}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                펀딩 마감일: {lessonData.fundingDeadline}
              </p>
              {selectedLocation.SVCURL && (
                <a
                  href={selectedLocation.SVCURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 block"
                >
                  예약 페이지 바로가기 →
                </a>
              )}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-[#1B9AF5] text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-[#1B9AF5]/90 transition-colors"
            >
              수업 개설
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonRegistration; 