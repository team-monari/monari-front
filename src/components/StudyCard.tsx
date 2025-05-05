import React from 'react';
import Link from 'next/link';
import { Region, regionToKorean } from '../utils/region';
import { Study } from '../types/study';

interface StudyCardProps {
  study: Study;
  locationName: string | null;
}

const StudyCard: React.FC<StudyCardProps> = ({ study, locationName }) => {
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
      case 'ENGLISH':
        return '영어';
      case 'KOREAN':
        return '국어';
      case 'SCIENCE':
        return '과학';
      case 'SOCIETY':
        return '사회';
      default:
        return subj;
    }
  };

  const getStudyTypeInfo = (type: string) => {
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { text: '모집중', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'IN_PROGRESS':
        return { text: '진행중', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'CLOSED':
        return { text: '모집완료', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
      default:
        return { text: '알 수 없음', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

  const studyTypeInfo = getStudyTypeInfo(study.studyType);
  const statusInfo = getStatusInfo(study.status);

  return (
    <Link
      href={`/studies/${study.id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3 gap-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1B9AF5] transition-colors truncate max-w-[75%]">
            {study.title}
          </h3>
          <div className="flex gap-2">
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${studyTypeInfo.bgColor} ${studyTypeInfo.textColor}`}>
              {studyTypeInfo.icon}
              {studyTypeInfo.text}
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusInfo.bgColor} ${statusInfo.textColor}`}>
              {statusInfo.text}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 break-words whitespace-pre-wrap min-h-[40px]">
          {study.description}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
              {getSchoolLevelText(study.schoolLevel)}
            </span>
            <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
              {getSubjectText(study.subject)}
            </span>
          </div>

          {study.studyType === 'OFFLINE' && locationName && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{locationName}</span>
              <span>({regionToKorean[study.region]})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StudyCard;
