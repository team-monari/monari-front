import React from 'react';
import { useRouter } from 'next/router';

interface LessonCardProps {
  id: number;
  title: string;
  teacher: string;
  period: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  location: string;
  progress: number;
}

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  teacher,
  period,
  description,
  price,
  originalPrice,
  discount,
  location,
  progress
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/lessons/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">{teacher}</div>
        <div className="text-sm text-gray-600">{period}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">{location}</div>
        <div className="flex items-center">
          <span className="text-lg font-bold">{price.toLocaleString()}원</span>
          {discount > 0 && (
            <>
              <span className="ml-2 text-sm line-through text-gray-400">
                {originalPrice.toLocaleString()}원
              </span>
              <span className="ml-2 text-sm text-blue-500">
                {discount}% 할인
              </span>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="relative h-2 bg-gray-200 rounded mb-1">
          <div 
            className={`absolute left-0 top-0 h-full rounded ${
              progress >= 100 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            현재 달성률 {progress}%
          </div>
          <button 
            className="px-4 h-[44px] bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 참여하기 로직 구현
            }}
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard; 