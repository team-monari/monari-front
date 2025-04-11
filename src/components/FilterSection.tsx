import React, { useState } from 'react';

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

  const handleSearch = () => {
    onFilterChange({
      ...filters,
      keyword: searchKeyword,
      pageNumber: 1,
      pageSize: 6,
      schoolLevel: filters.schoolLevel,
      subject: filters.subject
    });
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
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="부산">부산</option>
            <option value="대구">대구</option>
            <option value="광주">광주</option>
            <option value="대전">대전</option>
            <option value="울산">울산</option>
            <option value="세종">세종</option>
            <option value="강원">강원</option>
            <option value="충북">충북</option>
            <option value="충남">충남</option>
            <option value="전북">전북</option>
            <option value="전남">전남</option>
            <option value="경북">경북</option>
            <option value="경남">경남</option>
            <option value="제주">제주</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection; 