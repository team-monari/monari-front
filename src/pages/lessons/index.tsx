import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import FilterSection from '../../components/FilterSection';
import LessonCard from '../../components/LessonCard';
import { lessonApi } from '../../services/api';
import { Lesson, LessonFilters } from '../../types/lesson';

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LessonFilters>({
    subject: '',
    educationLevel: '',
    course: '',
    region: '',
    page: 1,
    limit: 9
  });

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await lessonApi.getLessons(filters);
      setLessons(response.data);
      setError(null);
    } catch (err) {
      setError('수업 목록을 불러오는데 실패했습니다.');
      console.error('Failed to fetch lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<LessonFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // 필터 변경시 첫 페이지로 리셋
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchLessons}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">수업 찾기</h1>
          <FilterSection 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
        </div>

        {lessons.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(lesson => (
              <LessonCard
                key={lesson.id}
                {...lesson}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsPage; 