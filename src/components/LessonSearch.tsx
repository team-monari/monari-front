import React, { useState, useMemo } from 'react';
import LessonCard from './LessonCard';
import FilterSection from './FilterSection';

const mockLessons = [
  {
    id: '1',
    title: '국어 독해력 향상반',
    teacher: {
      name: '박선생님',
      image: '/teachers/teacher1.jpg'
    },
    period: '2024.03.10 ~ 2024.06.20',
    description: '중학생을 위한 국어 독해력 향상 수업입니다. 다양한 지문을 통해 실전 연습을 진행합니다.',
    price: 190000,
    originalPrice: 220000,
    discount: 15,
    location: '경기 분당구',
    currentStudents: 8,
    maxStudents: 15
  },
  {
    id: '2',
    title: '수학 기초 완성반',
    teacher: {
      name: '김선생님',
      image: '/teachers/teacher2.jpg'
    },
    period: '2024.03.01 ~ 2024.06.30',
    description: '중학교 1학년을 위한 수학 기초 완성 수업입니다. 기초 개념부터 차근차근 설명해드립니다.',
    price: 180000,
    originalPrice: 200000,
    discount: 10,
    location: '서울 강남구',
    currentStudents: 12,
    maxStudents: 15
  },
  {
    id: '3',
    title: '영어 회화 실전반',
    teacher: {
      name: '이선생님',
      image: '/teachers/teacher3.jpg'
    },
    period: '2024.03.15 ~ 2024.07.15',
    description: '고등학생을 위한 실전 영어 회화 수업입니다. 원어민과 함께하는 실전 회화 훈련!',
    price: 250000,
    location: '서울 서초구',
    currentStudents: 15,
    maxStudents: 15
  },
  {
    id: '4',
    title: '과학 실험 탐구반',
    teacher: {
      name: '정선생님',
      image: '/teachers/teacher4.jpg'
    },
    period: '2024.04.01 ~ 2024.07.31',
    description: '중학생을 위한 과학 실험 탐구 수업입니다. 직접 실험하며 과학의 원리를 이해합니다.',
    price: 220000,
    originalPrice: 250000,
    discount: 12,
    location: '서울 송파구',
    currentStudents: 10,
    maxStudents: 12
  },
  {
    id: '5',
    title: '사회 논술 심화반',
    teacher: {
      name: '최선생님',
      image: '/teachers/teacher5.jpg'
    },
    period: '2024.03.20 ~ 2024.07.20',
    description: '고등학생을 위한 사회 논술 심화 수업입니다. 시사 이슈를 통한 비판적 사고력 향상!',
    price: 200000,
    location: '경기 성남시',
    currentStudents: 8,
    maxStudents: 10
  },
  {
    id: '6',
    title: '수학 문제풀이반',
    teacher: {
      name: '한선생님',
      image: '/teachers/teacher6.jpg'
    },
    period: '2024.04.05 ~ 2024.08.05',
    description: '고등학교 2학년을 위한 수학 문제풀이 수업입니다. 실전 문제 풀이로 실력 향상!',
    price: 230000,
    originalPrice: 260000,
    discount: 12,
    location: '서울 강동구',
    currentStudents: 14,
    maxStudents: 15
  },
  {
    id: '7',
    title: '영어 문법 마스터반',
    teacher: {
      name: '조선생님',
      image: '/teachers/teacher7.jpg'
    },
    period: '2024.04.10 ~ 2024.08.10',
    description: '고등학교 3학년을 위한 영어 문법 마스터 수업입니다. 수능 영어 문법 완벽 대비!',
    price: 210000,
    originalPrice: 240000,
    discount: 13,
    location: '서울 마포구',
    currentStudents: 11,
    maxStudents: 15
  },
  {
    id: '8',
    title: '과학 개념 정리반',
    teacher: {
      name: '윤선생님',
      image: '/teachers/teacher8.jpg'
    },
    period: '2024.04.15 ~ 2024.08.15',
    description: '중학교 3학년을 위한 과학 개념 정리 수업입니다. 고등학교 과학 준비하기!',
    price: 190000,
    location: '경기 수원시',
    currentStudents: 9,
    maxStudents: 12
  },
  {
    id: '9',
    title: '국사 심화 학습반',
    teacher: {
      name: '송선생님',
      image: '/teachers/teacher9.jpg'
    },
    period: '2024.04.20 ~ 2024.08.20',
    description: '고등학생을 위한 국사 심화 학습 수업입니다. 수능 한국사 완벽 대비!',
    price: 200000,
    originalPrice: 230000,
    discount: 13,
    location: '서울 영등포구',
    currentStudents: 13,
    maxStudents: 15
  },
  {
    id: '10',
    title: '수학 고득점 대비반',
    teacher: {
      name: '강선생님',
      image: '/teachers/teacher10.jpg'
    },
    period: '2024.05.01 ~ 2024.09.01',
    description: '고등학교 3학년을 위한 수학 고득점 대비 수업입니다. 수능 수학 만점을 향해!',
    price: 250000,
    originalPrice: 280000,
    discount: 11,
    location: '경기 일산시',
    currentStudents: 12,
    maxStudents: 15
  }
];

export default function LessonSearch() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    searchType: 'title', // 'title' or 'content'
    educationLevel: '',
    subject: '',
    region: '',
    sort: '최신순'
  });

  const filteredLessons = useMemo(() => {
    let filtered = mockLessons.filter(lesson => {
      const searchTerm = filters.search.toLowerCase();
      let matchesSearch = false;

      if (filters.searchType === 'title') {
        matchesSearch = !filters.search || lesson.title.toLowerCase().includes(searchTerm);
      } else {
        matchesSearch = !filters.search || lesson.description.toLowerCase().includes(searchTerm);
      }

      const matchesEducationLevel = !filters.educationLevel || 
        lesson.description.includes(filters.educationLevel);

      const matchesSubject = !filters.subject || 
        lesson.title.includes(filters.subject);

      const matchesRegion = !filters.region || 
        lesson.location.includes(filters.region);

      return matchesSearch && matchesEducationLevel && matchesSubject && matchesRegion;
    });

    // Sort the filtered lessons
    switch (filters.sort) {
      case '최신순':
        filtered.sort((a, b) => new Date(b.period.split(' ~ ')[0]).getTime() - new Date(a.period.split(' ~ ')[0]).getTime());
        break;
      case '인기순':
        filtered.sort((a, b) => (b.currentStudents / b.maxStudents) - (a.currentStudents / a.maxStudents));
        break;
      case '가격 낮은순':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case '가격 높은순':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [filters]);

  const lessonsPerPage = 6;
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);

  const startIndex = (currentPage - 1) * lessonsPerPage;
  const endIndex = startIndex + lessonsPerPage;
  const currentLessons = filteredLessons.slice(startIndex, endIndex);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
      >
        &lt;
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            currentPage === i
              ? 'bg-[#1B9AF5] text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
      >
        &gt;
      </button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 pl-6">수업 찾기</h2>
        <FilterSection 
          onFilterChange={handleFilterChange}
          searchType={filters.searchType}
          onSearchTypeChange={(type) => setFilters(prev => ({ ...prev, searchType: type }))}
        />
        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-4">
            총 {filteredLessons.length}개의 수업
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                {...lesson}
                minStudents={3}
              />
            ))}
            {currentLessons.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </div>
  );
} 