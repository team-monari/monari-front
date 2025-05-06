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
  lessonType: string;
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
  lessonType,
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

  const getLessonTypeInfo = (type: string) => {
    switch (type) {
      case 'ONLINE':
        return {
          text: '온라인',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        };
      case 'OFFLINE':
        return {
          text: '오프라인',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        };
      default:
        return {
          text: '알 수 없음',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          icon: null
        };
    }
  };

  const handleCardClick = () => {
    router.push(`/lessons/${lessonId}`);
  };

  const getStatusInfo = (status: string) => {
    const isFull = currentStudent >= maxStudent;
    
    // 수업이 취소되었거나 종료된 경우
    if (status === 'CANCELED') {
      return { text: '취소', bgColor: 'bg-red-100', textColor: 'text-red-800' };
    }
    if (status === 'CLOSED') {
      return { text: '종료', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
    
    // 수업이 활성 상태일 때
    if (status === 'ACTIVE') {
      if (isFull) {
        return { text: '모집 완료', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
      }
      return { text: '모집중', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    }
    
    // 기본값
    return { text: '알 수 없음', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  };

  const statusInfo = getStatusInfo(status);
  const lessonTypeInfo = getLessonTypeInfo(lessonType);
  const progress = (currentStudent / maxStudent) * 100;
  const isFull = currentStudent >= maxStudent;
  const isDisabled = isFull || status === 'CANCELED' || status === 'CLOSED';
  
  // 할인된 금액 계산 - 공동 참여 기반 수강료 절감
  let calculatedAmount = amount;
  let discountRate = 0;
  if (currentStudent > minStudent) {
    const extra = currentStudent - minStudent;
    discountRate = Math.min(extra * 2.5, 50); 
    calculatedAmount = Math.round(amount * (1 - discountRate / 100));
  }

  const getButtonText = () => {
    if (status === 'CANCELED') return '취소된 수업';
    if (status === 'CLOSED') return '종료된 수업';
    if (isFull) return '모집완료';
    return '참여하기';
  };

  return (
    <Link
      href={`/lessons/${lessonId}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      <div className="p-6 flex flex-col h-full">
        {/* 위쪽 정보들 */}
        <div className="flex-1 flex flex-col">
          {/* 제목/태그 */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1B9AF5] transition-colors break-words flex-1 min-h-[2.5rem]">
              {title}
            </h3>
            <div className="flex flex-row items-center gap-1 ml-2">
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${lessonTypeInfo.bgColor} ${lessonTypeInfo.textColor}`}>{lessonTypeInfo.icon}{lessonTypeInfo.text}</div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusInfo.bgColor} ${statusInfo.textColor}`}>{statusInfo.text}</div>
            </div>
          </div>

          {/* 위치/기간 */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {lessonType === 'OFFLINE' ? '서울시 강남구' : '온라인'}
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(startDate).toLocaleDateString()} ~ {new Date(endDate).toLocaleDateString()}
            </div>
          </div>

          {/* 모집/태그 */}
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm text-gray-700">
              모집 <span className="font-bold">{currentStudent}/{maxStudent}</span>명 <span className="text-gray-400">(최소 {minStudent}명)</span>
            </div>
            <div className="flex gap-1">
              <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium border border-gray-100">{getSchoolLevelText(schoolLevel)}</span>
              <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium border border-gray-100">{getSubjectText(subject)}</span>
            </div>
          </div>
        </div>
        {/* 모집 현황 progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
          <div className={`${isFull ? 'bg-red-500' : 'bg-[#1B9AF5]'} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${progress}%` }} />
        </div>
        {/* 하단: 가격/버튼 */}
        <div className="flex items-end justify-between pt-2 border-t border-gray-100 min-h-[72px]">
          <div className="flex flex-col">
            {/* 원래 가격 (할인 시만 보임, 아니면 invisible) */}
            <span className={`text-xs text-gray-500 line-through ${currentStudent > minStudent ? '' : 'invisible'}`}>
              ₩{(amount || 0).toLocaleString()}
            </span>
            <div className="flex items-baseline gap-2 min-h-[28px]">
              <span className="text-lg font-bold text-gray-900">
                ₩{(calculatedAmount || 0).toLocaleString()}
              </span>
              {/* 할인율 (할인 시만 보임, 아니면 invisible) */}
              <span className={`px-2 py-0.5 bg-[#1B9AF5]/10 text-[#1B9AF5] rounded-full text-xs font-medium ${currentStudent > minStudent ? '' : 'invisible'}`}>
                {discountRate}% 할인
              </span>
            </div>
            {/* 안내문구 (항상 보이게) */}
            <span className="text-xs text-[#1B9AF5] mt-1">
              최소 {minStudent}명 초과 시 할인 적용
            </span>
          </div>
          <button
            disabled={isDisabled}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ml-4 ${isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1B9AF5] text-white hover:bg-[#1B9AF5]/90 hover:shadow-md'}`}
            aria-disabled={isDisabled}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default LessonCard; 