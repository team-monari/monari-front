import React from 'react';
import Image from 'next/image';

interface LessonDetailProps {
  lesson: {
    title: string;
    teacher: {
      name: string;
      university: string;
      rating: number;
      experience: string;
    };
    educationLevel: string;
    subject: string;
    period: string;
    capacity: {
      current: number;
      max: number;
    };
    description: {
      goals: string[];
      schedule: string[];
      curriculum: {
        title: string;
        details: string[];
      }[];
    };
    location: string;
    price: {
      current: number;
      original: number;
      discount: number;
    };
    progress: number;
  };
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-600">{`${lesson.subject} 교과 내신 대비 특별 수업`}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
              <Image
                src="/placeholder-teacher.png"
                alt="선생님 프로필"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">{lesson.teacher.name} 선생님</h2>
              <p className="text-gray-600 text-sm mb-2">{lesson.teacher.university}</p>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-gray-900">{lesson.teacher.rating}</span>
                <span className="text-gray-400 mx-2">·</span>
                <span className="text-gray-600">수업 경력 {lesson.teacher.experience}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-gray-600 text-sm mb-2">교육 대상</h3>
              <p>{lesson.educationLevel}</p>
            </div>
            <div>
              <h3 className="text-gray-600 text-sm mb-2">과목</h3>
              <p>{lesson.subject}</p>
            </div>
            <div>
              <h3 className="text-gray-600 text-sm mb-2">수업 정원</h3>
              <p>{`${lesson.capacity.current}-${lesson.capacity.max}명`}</p>
              <div className="text-blue-500 text-sm">현재 3/4명</div>
            </div>
            <div>
              <h3 className="text-gray-600 text-sm mb-2">수업 기간</h3>
              <p>{lesson.period}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">수업 설명</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-2">1. 수업 목표</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {lesson.description.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">2. 수업 방식</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {lesson.description.schedule.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">3. 커리큘럼</h4>
                {lesson.description.curriculum.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p className="mb-1">{item.title}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {item.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-gray-600 text-sm mb-2">수업 장소</h3>
            <p>{lesson.location}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">월 수업료</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{lesson.price.current.toLocaleString()}원</span>
                  <span className="ml-2 line-through text-gray-400">{lesson.price.original.toLocaleString()}원</span>
                  <span className="ml-2 text-blue-500">{lesson.price.discount}% 할인</span>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                수업 신청하기
              </button>
            </div>
            <div className="relative h-2 bg-gray-200 rounded">
              <div 
                className={`absolute left-0 top-0 h-full rounded ${
                  lesson.progress >= 100 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(lesson.progress, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">현재 달성률 {lesson.progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail; 