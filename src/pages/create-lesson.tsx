import React from 'react';
import { useRouter } from 'next/router';
import LessonRegistration from '../components/LessonRegistration';

const CreateLesson = () => {
  const router = useRouter();

  const handleSubmit = async (lessonData: any) => {
    try {
      // TODO: API 호출로 수업 데이터 저장
      console.log('Lesson data:', lessonData);
      
      // 성공적으로 등록되면 메인 페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('Failed to create lesson:', error);
      // TODO: 에러 처리
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LessonRegistration onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateLesson; 