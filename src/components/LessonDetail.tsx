import React from 'react';

interface LessonDetailProps {
  id: string;
  title: string;
  teacher: {
    name: string;
    university: string;
    rating: number;
    experience: number;
    image?: string;
  };
  period: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  location: string;
  progress: number;
  curriculum: string[];
  maxStudents: number;
  currentStudents: number;
}

export default function LessonDetail({
  title,
  teacher,
  period,
  description,
  price,
  originalPrice,
  discount,
  location,
  progress,
  curriculum,
  maxStudents,
  currentStudents,
}: LessonDetailProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        {/* 교사 정보 */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0">
            <img
              src={teacher.image || "/placeholder-teacher.jpg"}
              alt={teacher.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-gray-700 mb-2">
              {teacher.name} 선생님 | {teacher.university}
            </p>
            <div className="flex items-center gap-4 text-gray-600">
              <span>⭐ {teacher.rating.toFixed(1)}</span>
              <span>수업 경력 {teacher.experience}년</span>
            </div>
          </div>
        </div>

        {/* 수업 정보 */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <h2 className="text-xl font-bold mb-4">수업 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2">수업 기간</p>
              <p className="font-medium">{period}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">수업 장소</p>
              <p className="font-medium">{location}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">수강 인원</p>
              <p className="font-medium">
                {currentStudents}/{maxStudents}명
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">모집률</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 수업 설명 */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <h2 className="text-xl font-bold mb-4">수업 설명</h2>
          <p className="text-gray-700 whitespace-pre-line">{description}</p>
        </div>

        {/* 커리큘럼 */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <h2 className="text-xl font-bold mb-4">커리큘럼</h2>
          <ul className="list-disc pl-5 space-y-2">
            {curriculum.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>

        {/* 수강료 및 신청 버튼 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 mb-1">수강료</p>
              <div className="flex items-center gap-2">
                {originalPrice && discount && (
                  <span className="text-gray-400 line-through">
                    {originalPrice.toLocaleString()}원
                  </span>
                )}
                <span className="text-2xl font-bold text-blue-600">
                  {price.toLocaleString()}원
                </span>
                {discount && (
                  <span className="text-red-500">{discount}% 할인</span>
                )}
              </div>
            </div>
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              수업 신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 