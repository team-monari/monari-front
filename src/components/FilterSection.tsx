import React, { useState } from 'react';
import { regions, getRegionText } from '../utils/region';

interface FilterSectionProps {
  filters: {
    subject: string;
    schoolLevel: string;
    region: string;
    searchType: string;
    lessonType: string;
    keyword?: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange }) => {
  const [searchKeyword, setSearchKeyword] = useState(filters.keyword || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('Change event:', { name, value });
    
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    
    if (name === 'keyword') {
      setSearchKeyword(value);
    }
    
    console.log('Updated filters:', updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-6">
      {/* 검색 영역 */}
      <div className="flex items-center gap-4">
        <select
          name="searchType"
          value={filters.searchType}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
        >
          <option value="title">제목</option>
          <option value="description">설명</option>
          <option value="subject">과목</option>
        </select>
        <input
          type="text"
          name="keyword"
          value={searchKeyword}
          onChange={handleChange}
          placeholder="검색어를 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => onFilterChange(filters)}
          className="px-6 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
        >
          검색
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">교육 대상</label>
          <select
            name="schoolLevel"
            value={filters.schoolLevel}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
          >
            <option value="">전체</option>
            <option value="MIDDLE">중학교</option>
            <option value="HIGH">고등학교</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
          <select
            name="subject"
            value={filters.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
          >
            <option value="">전체</option>
            <option value="MATH">수학</option>
            <option value="SCIENCE">과학</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
          <select
            name="region"
            value={filters.region}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
          >
            <option value="">전체</option>
            {Object.values(regions).map((region) => (
              <option key={region} value={region}>
                {getRegionText(region)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">수업 유형</label>
          <select
            name="lessonType"
            value={filters.lessonType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
          >
            <option value="">전체</option>
            <option value="ONLINE">온라인</option>
            <option value="OFFLINE">오프라인</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection; 