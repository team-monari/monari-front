import React from 'react';
import { useRouter } from 'next/router';
import { fetchLessonById } from '../services/lesson';
import Card from './Card';
import Link from 'next/link';

interface Teacher {
  name: string;
}

interface LessonCardProps {
  lessonId: number;
  title: string;
  description: string;
  subject: string;
  schoolLevel: string;
  minStudent: number;
  maxStudent: number;
  currentStudent: number;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lessonId,
  title,
  description,
  subject,
  schoolLevel,
  minStudent,
  maxStudent,
  currentStudent,
  amount,
  startDate,
  endDate,
  status,
}) => {
  const router = useRouter();

  const getSchoolLevelText = (level: string) => {
    switch (level) {
      case 'MIDDLE':
        return '중학교';
      case 'HIGH':
        return '고등학교';
      default:
        return level;
    }
  };

  const getSubjectText = (subj: string) => {
    switch (subj) {
      case 'MATH':
        return '수학';
      case 'SCIENCE':
        return '과학';
      default:
        return subj;
    }
  };

  const handleCardClick = () => {
    router.push(`/lessons/${lessonId}`);
  };

  const getStatusInfo = (status: string) => {
    const isFull = currentStudent >= maxStudent;
    if (isFull) {
      return { text: '모집 완료', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
    switch (status) {
      case 'ACTIVE':
        return { text: '모집중', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'CLOSED':
        return { text: '종료', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
      case 'CANCELED':
        return { text: '취소', bgColor: 'bg-red-100', textColor: 'text-red-800' };
      default:
        return { text: '알 수 없음', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

  const statusInfo = getStatusInfo(status);
  const progress = (currentStudent / maxStudent) * 100;
  const isFull = currentStudent >= maxStudent;
  const isDisabled = isFull || status === 'CANCELED' || status === 'CLOSED';
  
  // 할인된 금액 계산 - N빵 계산
  const calculatedAmount = currentStudent >= minStudent
    ? Math.round(amount / currentStudent)
    : amount;
  
  // 할인율 계산
  const discountRate = currentStudent >= minStudent
    ? Math.round(((amount - calculatedAmount) / amount) * 100)
    : 0;

  const getButtonText = () => {
    if (status === 'CANCELED') return '취소된 수업';
    if (status === 'CLOSED') return '종료된 수업';
    if (isFull) return '모집 완료';
    return '참여하기';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1B9AF5] transition-colors truncate max-w-[75%]">
            {title}
          </h3>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusInfo.bgColor} ${statusInfo.textColor}`}>
            {statusInfo.text}
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-5">{description}</p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
              {getSchoolLevelText(schoolLevel)}
            </span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
              {getSubjectText(subject)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(startDate).toLocaleDateString()} ~ {new Date(endDate).toLocaleDateString()}
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">모집 인원</span>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-bold ${isFull ? 'text-red-500' : 'text-[#1B9AF5]'}`}>
                  {currentStudent}
                </span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm text-gray-600">
                  {maxStudent}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`${isFull ? 'bg-red-500' : 'bg-[#1B9AF5]'} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(currentStudent / maxStudent) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-6 flex items-center justify-between bg-gray-50">
        <div className="flex flex-col">
          {currentStudent >= minStudent ? (
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">총 수강료</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">₩{amount.toLocaleString()}</span>
                  <span className="text-sm font-medium text-[#1B9AF5]">
                    ({discountRate}% 할인)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">현재</span>
                  <span className="font-medium text-gray-700">{currentStudent}명</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#1B9AF5]">1인당</span>
                  <span className="font-bold text-[#1B9AF5]">₩{calculatedAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-600">수강료</span>
              <span className="text-lg font-bold text-gray-900">₩{amount.toLocaleString()}</span>
            </div>
          )}
        </div>
        <Link
          href={isDisabled ? '#' : `/lessons/${lessonId}`}
          onClick={(e) => isDisabled && e.preventDefault()}
          className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#1B9AF5] text-white hover:bg-[#1B9AF5]/90 hover:shadow-md'
          }`}
          aria-disabled={isDisabled}
        >
          {getButtonText()}
        </Link>
      </div>
    </div>
  );
};

export default LessonCard; 