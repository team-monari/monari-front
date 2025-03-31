import React from 'react';

interface FilterSectionProps {
  filters: {
    subject: string;
    educationLevel: string;
    course: string;
    region: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    subject: string;
    educationLevel: string;
    course: string;
    region: string;
  }>>;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">수업 찾기</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-2">검색</div>
            <div className="flex">
              <div className="relative">
                <select
                  className="h-[38px] appearance-none bg-white border border-gray-200 rounded-l pl-3 pr-8 text-sm text-gray-900 focus:outline-none"
                  value={filters.subject}
                  onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                >
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="w-full h-[38px] px-3 border-y border-r border-gray-200 rounded-r text-sm focus:outline-none"
                  value={filters.subject}
                  onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                />
                <button className="absolute right-2 inset-y-0 flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">교육 대상</div>
            <div className="relative">
              <select
                className="w-full h-[38px] appearance-none bg-white border border-gray-200 rounded pl-3 pr-8 text-sm text-gray-900 focus:outline-none"
                value={filters.educationLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, educationLevel: e.target.value }))}
              >
                <option value="전체">전체</option>
                <option value="중학생">중학생</option>
                <option value="고등학생">고등학생</option>
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">과목</div>
            <div className="relative">
              <select
                className="w-full h-[38px] appearance-none bg-white border border-gray-200 rounded pl-3 pr-8 text-sm text-gray-900 focus:outline-none"
                value={filters.course}
                onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
              >
                <option value="전체">전체</option>
                <option value="수학">수학</option>
                <option value="영어">영어</option>
                <option value="국어">국어</option>
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">지역</div>
            <div className="relative">
              <select
                className="w-full h-[38px] appearance-none bg-white border border-gray-200 rounded pl-3 pr-8 text-sm text-gray-900 focus:outline-none"
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
              >
                <option value="전체">전체</option>
                <option value="강남구">강남구</option>
                <option value="강동구">강동구</option>
                <option value="강북구">강북구</option>
                <option value="강서구">강서구</option>
                <option value="관악구">관악구</option>
                <option value="광진구">광진구</option>
                <option value="구로구">구로구</option>
                <option value="금천구">금천구</option>
                <option value="노원구">노원구</option>
                <option value="도봉구">도봉구</option>
                <option value="동대문구">동대문구</option>
                <option value="동작구">동작구</option>
                <option value="마포구">마포구</option>
                <option value="서대문구">서대문구</option>
                <option value="서초구">서초구</option>
                <option value="성동구">성동구</option>
                <option value="성북구">성북구</option>
                <option value="송파구">송파구</option>
                <option value="양천구">양천구</option>
                <option value="영등포구">영등포구</option>
                <option value="용산구">용산구</option>
                <option value="은평구">은평구</option>
                <option value="종로구">종로구</option>
                <option value="중구">중구</option>
                <option value="중랑구">중랑구</option>
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center bg-blue-500 text-white px-4 h-[32px] rounded text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            필터 적용
          </button>
          <button className="h-[32px] px-4 bg-white border border-gray-200 rounded text-sm text-gray-600">
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection; 