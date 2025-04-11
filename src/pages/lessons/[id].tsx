import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Lesson, fetchLessonById } from '../../services/lesson';
import { createEnrollment } from '../../services/enrollment';
import Header from '../../components/Header';

const LessonDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const data = await fetchLessonById(Number(id));
      setLesson(data);
    } catch (err) {
      setError('수업 정보를 불러오는데 실패했습니다.');
      console.error('Error loading lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!lesson) return;
    
    try {
      await createEnrollment(lesson.lessonId);
      alert('수업 신청이 완료되었습니다.');
      router.push('/lessons');
    } catch (error) {
      alert('수업 신청에 실패했습니다.');
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!lesson) return <div className="text-center py-12">수업을 찾을 수 없습니다.</div>;

  const isFull = lesson.currentStudent >= lesson.maxStudent;
  
  // 할인된 금액 계산 - N빵 계산
  const calculatedAmount = lesson.currentStudent >= lesson.minStudent
    ? Math.round(lesson.amount / lesson.currentStudent)
    : lesson.amount;
  
  // 할인율 계산
  const discountRate = lesson.currentStudent >= lesson.minStudent
    ? Math.round(((lesson.amount - calculatedAmount) / lesson.amount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-[1280px]">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              isFull 
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {isFull ? '모집 완료' : '모집중'}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {lesson.schoolLevel}
              </span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {lesson.subject}
              </span>
            </div>

            <div className="text-gray-600">
              <h2 className="text-lg font-semibold mb-2">수업 설명</h2>
              <p className="whitespace-pre-wrap">{lesson.description}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">수업 기간</h2>
              <p className="text-gray-600">
                {new Date(lesson.startDate).toLocaleDateString()} ~ {new Date(lesson.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">모집 현황</h2>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">현재 인원</span>
                <span className={`font-medium ${isFull ? 'text-red-500' : 'text-[#1B9AF5]'}`}>
                  {lesson.currentStudent}/{lesson.maxStudent}명
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`${isFull ? 'bg-red-500' : 'bg-[#1B9AF5]'} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(lesson.currentStudent / lesson.maxStudent) * 100}%` }}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">수업 금액</h2>
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-gray-600">총 수강료</span>
                      <span className="text-2xl font-bold text-gray-900">₩{lesson.amount.toLocaleString()}</span>
                    </div>
                    
                    {lesson.currentStudent >= lesson.minStudent && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">현재 인원</span>
                          <span className="text-gray-900">{lesson.currentStudent}명</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#1B9AF5] font-medium">1인당 수강료</span>
                          <span className="text-xl font-bold text-[#1B9AF5]">₩{calculatedAmount.toLocaleString()}</span>
                          <span className="text-sm font-medium text-[#1B9AF5]">
                            ({discountRate}% 할인)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isFull 
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-[#1B9AF5] text-white hover:bg-[#1B9AF5]/90'
                  }`}
                  disabled={isFull}
                  onClick={handleEnroll}
                >
                  {isFull ? '모집 완료' : '수업 신청하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetail; 