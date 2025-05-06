import React, { useState, useRef, useEffect } from 'react';
import { regions, getRegionText, Region } from '../utils/region';
import { SearchType, Subject, getSubjectText } from '../types/lesson';

interface FilterSectionProps {
  filters: {
    subject: string;
    schoolLevel: string;
    region: string;
    searchType: SearchType;
    lessonType: string;
    keyword?: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchKeyword, setSearchKeyword] = useState(filters.keyword || '');
  const [showSchoolLevelDropdown, setShowSchoolLevelDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLessonTypeDropdown, setShowLessonTypeDropdown] = useState(false);
  const schoolLevelRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const lessonTypeRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기 (모든 필터)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (schoolLevelRef.current && !schoolLevelRef.current.contains(event.target as Node)) {
        setShowSchoolLevelDropdown(false);
      }
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setShowSubjectDropdown(false);
      }
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        setShowRegionDropdown(false);
      }
      if (lessonTypeRef.current && !lessonTypeRef.current.contains(event.target as Node)) {
        setShowLessonTypeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'keyword') {
      setSearchKeyword(value);
    } else {
      setLocalFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    const updatedFilters = {
      ...localFilters,
      keyword: searchKeyword
    };
    onFilterChange(updatedFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* 검색 영역 */}
      <div className="flex items-center gap-4">
        <select
          name="searchType"
          value={localFilters.searchType}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
        >
          <option value={SearchType.TITLE}>제목</option>
          <option value={SearchType.DESCRIPTION}>내용</option>
          <option value={SearchType.ALL}>제목 + 내용</option>
        </select>
        <input
          type="text"
          name="keyword"
          value={searchKeyword}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="검색어를 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-6 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
        >
          검색
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 교육 대상 드롭다운 */}
        <div className="relative" ref={schoolLevelRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">교육 대상</label>
          <button
            type="button"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
            onClick={() => setShowSchoolLevelDropdown((prev) => !prev)}
          >
            <span>
              {localFilters.schoolLevel === '' ? '전체' : localFilters.schoolLevel === 'MIDDLE' ? '중학교' : '고등학교'}
            </span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${showSchoolLevelDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showSchoolLevelDropdown && (
            <div
              className="absolute left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-10 animate-dropdown"
              style={{
                animation: 'dropdown 0.4s ease',
                overflow: 'hidden',
              }}
            >
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.schoolLevel === '' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, schoolLevel: '' }));
                  setShowSchoolLevelDropdown(false);
                }}
              >
                전체
              </div>
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.schoolLevel === 'MIDDLE' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, schoolLevel: 'MIDDLE' }));
                  setShowSchoolLevelDropdown(false);
                }}
              >
                중학교
              </div>
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.schoolLevel === 'HIGH' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, schoolLevel: 'HIGH' }));
                  setShowSchoolLevelDropdown(false);
                }}
              >
                고등학교
              </div>
            </div>
          )}
          <style jsx>{`
            @keyframes dropdown {
              0% { transform: translateY(-100%); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
        {/* 과목 드롭다운 */}
        <div className="relative" ref={subjectRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
          <button
            type="button"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
            onClick={() => setShowSubjectDropdown((prev) => !prev)}
          >
            <span>
              {localFilters.subject === '' ? '전체' : getSubjectText(localFilters.subject as Subject)}
            </span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showSubjectDropdown && (
            <div
              className="absolute left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-10 animate-dropdown"
              style={{ animation: 'dropdown 0.4s ease', overflow: 'hidden' }}
            >
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.subject === '' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, subject: '' }));
                  setShowSubjectDropdown(false);
                }}
              >전체</div>
              {Object.values(Subject).map((subj) => (
                <div
                  key={subj}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.subject === subj ? 'font-semibold text-[#1B9AF5]' : ''}`}
                  onClick={() => {
                    setLocalFilters((prev) => ({ ...prev, subject: subj }));
                    setShowSubjectDropdown(false);
                  }}
                >{getSubjectText(subj)}</div>
              ))}
            </div>
          )}
          <style jsx>{`
            @keyframes dropdown {
              0% { transform: translateY(-100%); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
        {/* 지역 드롭다운 */}
        <div className="relative" ref={regionRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
          <button
            type="button"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
            onClick={() => setShowRegionDropdown((prev) => !prev)}
          >
            <span>
              {localFilters.region === '' ? '전체' : getRegionText(localFilters.region as Region)}
            </span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showRegionDropdown && (
            <div
              className={`absolute left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-10 animate-dropdown ${regions.length > 8 ? 'max-h-64 overflow-y-auto' : ''}`}
              style={{ animation: 'dropdown 0.4s ease' }}
            >
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.region === '' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, region: '' }));
                  setShowRegionDropdown(false);
                }}
              >전체</div>
              {Object.values(regions).map((region) => (
                <div
                  key={region}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.region === region ? 'font-semibold text-[#1B9AF5]' : ''}`}
                  onClick={() => {
                    setLocalFilters((prev) => ({ ...prev, region: region as Region }));
                    setShowRegionDropdown(false);
                  }}
                >{getRegionText(region as Region)}</div>
              ))}
            </div>
          )}
          <style jsx>{`
            @keyframes dropdown {
              0% { transform: translateY(-100%); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
        {/* 수업 유형 드롭다운 */}
        <div className="relative" ref={lessonTypeRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">수업 유형</label>
          <button
            type="button"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
            onClick={() => setShowLessonTypeDropdown((prev) => !prev)}
          >
            <span>
              {localFilters.lessonType === '' ? '전체' : localFilters.lessonType === 'ONLINE' ? '온라인' : '오프라인'}
            </span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${showLessonTypeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showLessonTypeDropdown && (
            <div
              className="absolute left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-10 animate-dropdown"
              style={{ animation: 'dropdown 0.4s ease', overflow: 'hidden' }}
            >
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.lessonType === '' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, lessonType: '' }));
                  setShowLessonTypeDropdown(false);
                }}
              >전체</div>
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.lessonType === 'ONLINE' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, lessonType: 'ONLINE' }));
                  setShowLessonTypeDropdown(false);
                }}
              >온라인</div>
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-[#1B9AF5]/10 ${localFilters.lessonType === 'OFFLINE' ? 'font-semibold text-[#1B9AF5]' : ''}`}
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, lessonType: 'OFFLINE' }));
                  setShowLessonTypeDropdown(false);
                }}
              >오프라인</div>
            </div>
          )}
          <style jsx>{`
            @keyframes dropdown {
              0% { transform: translateY(-100%); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default FilterSection; 