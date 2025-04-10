import React, { useState, useEffect } from 'react';
import { PublicServiceLocation, Lesson } from '../types/lesson';
import { publicServiceApi } from '../services/publicService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface LessonRegistrationProps {
  onSubmit: (lessonData: any) => void;
}

const LessonRegistration: React.FC<LessonRegistrationProps> = ({ onSubmit }) => {
  const [locations, setLocations] = useState<PublicServiceLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<PublicServiceLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [lessonData, setLessonData] = useState({
    educationLevel: '중등',
    subject: '수학',
    title: '',
    description: '',
    minStudents: '3',
    maxStudents: '4',
    monthlyFee: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    location: '장소 선택하기',
    fundingDeadline: null as Date | null,
    locationId: 1,
    status: 'ACTIVE',
    schoolLevel: 'HIGH'
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string | Date | null } }) => {
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
          if (name === 'startDate' && value instanceof Date) {
            const deadline = new Date(value);
            deadline.setDate(deadline.getDate() - parseInt(selectedLocation.REVSTDDAY));
            newData.fundingDeadline = deadline;
          }
        }
        
        return newData;
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = searchQuery.toLowerCase();
    const filtered = lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchTerm) ||
      lesson.description.toLowerCase().includes(searchTerm)
    );
    setFilteredLessons(filtered);
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    setLessonData(prev => ({
      ...prev,
      startDate: dates[0],
      endDate: dates[1]
    }));
  };

  useEffect(() => {
    // 초기 데이터 로드
    setFilteredLessons(lessons);
  }, [lessons]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-[#1B9AF5]">수업 개설</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">수업 제목</label>
              <input
                type="text"
                name="title"
                value={lessonData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">수업 설명</label>
              <textarea
                name="description"
                value={lessonData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">수업 기간</label>
              <DatePicker
                selectsRange={true}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={handleDateRangeChange}
                minDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                dateFormat="yyyy-MM-dd"
                placeholderText="수업 기간을 선택하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">모집 마감일</label>
              <DatePicker
                selected={lessonData.fundingDeadline}
                onChange={(date) => handleChange({ target: { name: 'fundingDeadline', value: date } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                maxDate={lessonData.startDate || undefined}
                placeholderText="모집 마감일을 선택하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">수강료</label>
              <input
                type="number"
                name="monthlyFee"
                value={lessonData.monthlyFee}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">최소 인원</label>
              <input
                type="number"
                name="minStudents"
                value={lessonData.minStudents}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">최대 인원</label>
              <input
                type="number"
                name="maxStudents"
                value={lessonData.maxStudents}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min={lessonData.minStudents}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">학교급</label>
              <select
                name="schoolLevel"
                value={lessonData.educationLevel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="중등">중등</option>
                <option value="고등">고등</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">과목</label>
              <select
                name="subject"
                value={lessonData.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="수학">수학</option>
                <option value="영어">영어</option>
                <option value="국어">국어</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">수업 장소</label>
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
                        onClick={() => handleChange({ target: { name: 'location', value: location.SVCID } })}
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
          </div>
          <div className="flex justify-end space-x-4 mt-6">
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
  );
};

export default LessonRegistration; 