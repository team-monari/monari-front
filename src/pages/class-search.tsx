import React, { useState } from 'react';

enum SearchType {
  TITLE = 'TITLE',
  DESCRIPTION = 'DESCRIPTION',
  ALL = 'ALL'
}

interface ClassItem {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  date: string;
}

const ClassSearch: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>(SearchType.TITLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes] = useState<ClassItem[]>([
    // 예시 데이터
    {
      id: '1',
      title: 'React 기초 강의',
      description: 'React의 기본 개념과 사용법을 배웁니다.',
      category: '프론트엔드',
      instructor: '홍길동',
      date: '2024-03-01'
    },
    // 추가 예시 데이터...
  ]);

  const filteredClasses = classes.filter((classItem) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    switch (searchType) {
      case SearchType.TITLE:
        return classItem.title.toLowerCase().includes(query);
      case SearchType.DESCRIPTION:
        return classItem.description.toLowerCase().includes(query);
      case SearchType.ALL:
        return (
          classItem.title.toLowerCase().includes(query) ||
          classItem.description.toLowerCase().includes(query)
        );
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">수업 찾기</h1>
      
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value={SearchType.TITLE}>제목</option>
            <option value={SearchType.DESCRIPTION}>내용</option>
            <option value={SearchType.ALL}>제목 + 내용</option>
          </select>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <h2 className="text-xl font-semibold mb-2">{classItem.title}</h2>
            <p className="text-gray-600 mb-2">{classItem.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{classItem.category}</span>
              <span>{classItem.instructor}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {classItem.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSearch; 