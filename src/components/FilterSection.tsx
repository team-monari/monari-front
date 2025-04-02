import React from 'react';

interface FilterSectionProps {
  onFilterChange: (filters: {
    search: string;
    searchType: string;
    educationLevel: string;
    subject: string;
    region: string;
    sort: string;
  }) => void;
  searchType: string;
  onSearchTypeChange: (type: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  onFilterChange,
  searchType,
  onSearchTypeChange
}) => {
  const [filters, setFilters] = React.useState({
    search: '',
    educationLevel: '',
    subject: '',
    region: '',
    sort: '최신순'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onFilterChange({ ...filters, searchType });
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      educationLevel: '',
      subject: '',
      region: '',
      sort: '최신순'
    };
    setFilters(resetFilters);
    onFilterChange({ ...resetFilters, searchType });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2">
            <div className="text-sm text-gray-600 mb-1">검색</div>
            <select
              value={searchType}
              onChange={(e) => onSearchTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>
          </div>
          <div className="col-span-4">
            <div className="text-sm text-gray-600 mb-1">&nbsp;</div>
            <input
              type="text"
              name="search"
              placeholder="검색어를 입력하세요"
              value={filters.search}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
            />
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-600 mb-1">교육 대상</div>
            <select
              name="educationLevel"
              value={filters.educationLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
            >
              <option value="">전체</option>
              <option value="중등">중등</option>
              <option value="고등">고등</option>
            </select>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-600 mb-1">과목</div>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
            >
              <option value="">전체</option>
              <option value="수학">수학</option>
              <option value="영어">영어</option>
              <option value="국어">국어</option>
            </select>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-600 mb-1">지역</div>
            <select
              name="region"
              value={filters.region}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
            >
              <option value="">전체</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-10 flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#1B9AF5] text-white rounded-md text-sm hover:bg-[#1B9AF5]/90 transition-colors"
            >
              ▾ 필터 적용
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              초기화
            </button>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-600 mb-1">정렬</div>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
            >
              <option value="최신순">최신순</option>
              <option value="인기순">인기순</option>
              <option value="가격 낮은순">가격 낮은순</option>
              <option value="가격 높은순">가격 높은순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection; 