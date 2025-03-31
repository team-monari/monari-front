import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LessonDetail from '../../components/LessonDetail';
import Header from '../../components/Header';
import { lessonApi } from '../../services/api';
import { Lesson } from '../../types/lesson';

const LessonDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await lessonApi.getLessonById(Number(id));
        setLesson(data);
        setError(null);
      } catch (err) {
        setError('수업 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleApply = async () => {
    if (!lesson) return;

    try {
      await lessonApi.applyForLesson(lesson.id);
      alert('수업 신청이 완료되었습니다.');
      router.push('/my-lessons'); // 내 수업 목록 페이지로 이동
    } catch (err) {
      alert('수업 신청에 실패했습니다. 다시 시도해주세요.');
      console.error('Failed to apply for lesson:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            <p>{error || '수업을 찾을 수 없습니다.'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <LessonDetail lesson={lesson} onApply={handleApply} />
    </div>
  );
};

export default LessonDetailPage; 