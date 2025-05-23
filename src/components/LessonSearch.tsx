import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Lesson, fetchLessons, searchLessons } from '../services/lesson';
import { SearchType } from '../types/lesson';
import LessonCard from './LessonCard';
import FilterSection from './FilterSection';
import Card from './Card';

interface LessonSearchProps {
  onSearch: (query: string) => void;
}

const LessonSearch: React.FC<LessonSearchProps> = ({ onSearch }) => {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    subject: '',
    schoolLevel: '',
    region: '',
    searchType: SearchType.TITLE,
    keyword: '',
    lessonType: ''
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const { page, keyword, subject, schoolLevel, region } = router.query;
    const newFilters = {
      ...filters,
      keyword: keyword as string || '',
      subject: subject as string || '',
      schoolLevel: schoolLevel as string || '',
      region: region as string || ''
    };

    if (page) {
      const pageNum = parseInt(page as string, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }

    setFilters(newFilters);
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!router.isReady) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (filters.keyword) searchParams.append('keyword', filters.keyword);
        if (filters.subject) searchParams.append('subject', filters.subject);
        if (filters.schoolLevel) searchParams.append('schoolLevel', filters.schoolLevel);
        if (filters.region) searchParams.append('region', filters.region);
        if (filters.lessonType) searchParams.append('lessonType', filters.lessonType);
        searchParams.append('searchType', filters.searchType);
        searchParams.append('pageNumber', currentPage.toString());
        searchParams.append('pageSize', '6');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/search?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('검색 요청에 실패했습니다.');
        }

        const data = await response.json();
        setLessons(data.content || []);
        setTotalPages(data.page?.totalPages || 0);
        setError(null);
      } catch (err) {
        setError('검색 중 오류가 발생했습니다.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadData();
  }, [currentPage, filters.subject, filters.schoolLevel, filters.region, filters.keyword, filters.lessonType, filters.searchType, router.isReady]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateUrl(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    if (!isNaN(newPage) && newPage > 0) {
      setCurrentPage(newPage);
      updateUrl(newPage, filters);
    }
  };

  const updateUrl = (page: number, currentFilters: typeof filters) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (currentFilters.keyword) params.set('keyword', currentFilters.keyword);
    if (currentFilters.subject) params.set('subject', currentFilters.subject);
    if (currentFilters.schoolLevel) params.set('schoolLevel', currentFilters.schoolLevel);
    if (currentFilters.region) params.set('region', currentFilters.region);
    
    router.push(`/lessons?${params.toString()}`, undefined, { shallow: true });
  };

  const renderPagination = () => {
    if (totalPages <= 0 || lessons.length === 0) return null;

    // Calculate page window for pagination (10 pages per window)
    const pageLimit = 10;
    const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    const endPage = Math.min(startPage + pageLimit - 1, totalPages);

    return (
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
        >
          &lt;
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageNumber = startPage + i;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                currentPage === pageNumber
                  ? 'bg-blue-50 text-blue-600 font-semibold transform scale-110'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
        >
          &gt;
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
        <button
          onClick={() => {
            setCurrentPage(1);
            updateUrl(1, filters);
          }}
          className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <FilterSection filters={filters} onFilterChange={handleFilterChange} />
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.lessonId}
            lessonId={lesson.lessonId}
            title={lesson.title}
            description={lesson.description}
            subject={lesson.subject}
            schoolLevel={lesson.schoolLevel}
            minStudent={lesson.minStudent}
            maxStudent={lesson.maxStudent}
            currentStudent={lesson.currentStudent}
            amount={lesson.amount}
            startDate={lesson.startDate}
            endDate={lesson.endDate}
            status={lesson.status}
            lessonType={lesson.lessonType}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {renderPagination()}
      </div>
    </div>
  );
};

export default LessonSearch; 