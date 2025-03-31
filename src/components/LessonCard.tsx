import React from 'react';
import { useRouter } from 'next/router';

interface LessonCardProps {
  id: number;
  title: string;
  teacher: {
    name: string;
    image?: string;
  };
  period: string;
  description: string;
  price: number;
  minStudents: number;
  location: string;
  currentStudents: number;
  maxStudents: number;
}

export default function LessonCard({
  id,
  title,
  teacher,
  period,
  description,
  price,
  minStudents = 4,
  location,
  currentStudents,
  maxStudents
}: LessonCardProps) {
  const router = useRouter();
  const isFull = currentStudents >= maxStudents;

  const showDiscount = currentStudents > minStudents;
  const calculateDiscount = () => {
    if (!showDiscount) return 0;
    
    const discountRate = Math.floor((1 - (minStudents / currentStudents)) * 100);
    return discountRate;
  };

  const discountRate = calculateDiscount();
  const discountedPrice = showDiscount ? Math.floor(price * minStudents / currentStudents) : price;

  const handleClick = () => {
    router.push(`/lessons/${id}`);
  };

  const handleParticipate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFull) return;
    router.push(`/lessons/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow shadow-md"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            src={teacher.image || "/placeholder-teacher.jpg"} 
            alt={teacher.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h3 className="font-medium text-base">{title}</h3>
          <p className="text-gray-600 text-sm">{teacher.name}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-600 text-sm">기간: {period}</p>
        <p className="text-sm text-gray-700 line-clamp-2 mt-1">{description}</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          {showDiscount ? (
            <>
              <span className="text-gray-400 line-through text-sm">
                ₩{price.toLocaleString()}
              </span>
              <span className="font-bold text-lg text-[#1B9AF5]">
                ₩{discountedPrice.toLocaleString()}
              </span>
              <span className="text-[#FF0000] text-sm font-medium">{discountRate}% 할인</span>
            </>
          ) : (
            <span className="font-bold text-lg text-black">
              ₩{price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-800">모집 현황</span>
            <span className="text-sm text-gray-500">{currentStudents}/{maxStudents}명</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                isFull ? 'bg-red-500' : 'bg-[#1B9AF5]'
              }`}
              style={{ width: `${(currentStudents / maxStudents) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-500 text-sm">{location}</span>
          </div>

          <button
            onClick={handleParticipate}
            disabled={isFull}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              isFull
                ? 'bg-red-500 text-white cursor-not-allowed'
                : 'bg-[#1B9AF5] text-white hover:bg-[#1B9AF5]/90'
            }`}
          >
            {isFull ? '모집 완료' : '참여하기'}
          </button>
        </div>
      </div>
    </div>
  );
} 