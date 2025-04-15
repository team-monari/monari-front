import React, { useState } from 'react';
import { regions, getRegionText } from '../utils/region';

interface FilterSectionProps {
  filters: {
    subject: string;
    schoolLevel: string;
    region: string;
    searchType: string;
    keyword?: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange }) => {
  const [searchKeyword, setSearchKeyword] = useState(filters.keyword || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'keyword') {
      setSearchKeyword(value);
    } else {
      onFilterChange({
        ...filters,
        [name]: value
      });
    }
  };

  const handleSearch = async () => {
    try {
      const searchParams = new URLSearchParams();
      if (filters.keyword) searchParams.append('keyword', filters.keyword);
      if (filters.subject) searchParams.append('subject', filters.subject);
      if (filters.schoolLevel) searchParams.append('schoolLevel', filters.schoolLevel);
      if (filters.region) searchParams.append('region', filters.region);
      searchParams.append('pageNumber', '1');
      searchParams.append('pageSize', '6');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/search?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('검색 요청에 실패했습니다.');
      }
      const data = await response.json();
      
      onFilterChange({
        ...filters,
        keyword: searchKeyword,
        pageNumber: data.page?.number || 0,
        pageSize: data.page?.size || 6,
        totalElements: data.page?.totalElements || 0,
        totalPages: data.page?.totalPages || 0,
        content: data.content || [],
        schoolLevel: filters.schoolLevel,
        subject: filters.subject,
        region: filters.region,
        results: data
      });
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      onFilterChange({
        ...filters,
        keyword: searchKeyword,
        pageNumber: 0,
        pageSize: 6,
        totalElements: 0,
        totalPages: 0,
        content: [],
        schoolLevel: filters.schoolLevel,
        subject: filters.subject,
        region: filters.region,
        results: { content: [], page: { size: 6, number: 0, totalElements: 0, totalPages: 0 } }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          onKeyDown={handleKeyDown}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default FilterSection; 