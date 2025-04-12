import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

// 스터디 상태 타입
type StudyStatus = 'ACTIVE' | 'CLOSED';

// 과목 타입
type Subject = 'MATH' | 'ENGLISH' | 'KOREAN' | 'SCIENCE' | 'SOCIAL';

// 학교 레벨 타입
type SchoolLevel = 'MIDDLE' | 'HIGH';

// 스터디 상세 정보 인터페이스
interface StudyDetail {
  id: number;
  title: string;
  description: string;
  subject: Subject;
  schoolLevel: SchoolLevel;
  status: StudyStatus;
  createdAt: string;
  locationName: string;
  locationServiceUrl: string;
  studentPublicId: string;
  studentName: string;
}

const getSubjectLabel = (subject: Subject) => {
  switch (subject) {
    case 'MATH': return '수학';
    case 'ENGLISH': return '영어';
    case 'KOREAN': return '국어';
    case 'SCIENCE': return '과학';
    case 'SOCIAL': return '사회';
    default: return subject;
  }
};

const getStatusLabel = (status: StudyStatus) => {
  switch (status) {
    case 'ACTIVE': return '모집중';
    case 'CLOSED': return '모집완료';
    default: return status;
  }
};

const getStatusColor = (status: StudyStatus) => {
  switch (status) {
    case 'ACTIVE': return 'bg-yellow-100 text-yellow-600';
    case 'CLOSED': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function StudyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { accessToken } = useAuth();
  const [study, setStudy] = useState<StudyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyDetail = async () => {
      if (!id || !accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('스터디 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setStudy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '스터디 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyDetail();
  }, [id, accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-8 max-w-[1280px]">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AF5]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-8 max-w-[1280px]">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error || '스터디 정보를 찾을 수 없습니다.'}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{study.title} - 모나리</title>
        <meta name="description" content="모나리 스터디 상세 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="max-w-3xl mx-auto">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span></span>
          </button>

          <div className="bg-white rounded-lg p-8 shadow-sm">
            {/* 제목 및 상태 */}
            <div className="mb-6 relative">
              <div className="absolute top-0 right-0">
                <div className={`flex items-center gap-2 px-4 py-2 ${getStatusColor(study.status)} rounded-full font-medium`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{getStatusLabel(study.status)}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">{study.title}</h1>
              <div className="flex items-center text-gray-500 text-sm">
                <span>{study.studentName}</span>
                <span className="mx-2">·</span>
                <span>{new Date(study.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* 태그 영역 */}
            <div className="flex gap-2 mb-8">
              <span className={`px-3 py-1.5 rounded-full text-sm ${
                study.schoolLevel === 'MIDDLE' ? 'bg-[#1B9AF5]/10 text-[#1B9AF5]' :
                'bg-green-100 text-green-600'
              }`}>
                {study.schoolLevel === 'MIDDLE' ? '중학교' : '고등학교'}
              </span>
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                {getSubjectLabel(study.subject)}
              </span>
            </div>

            {/* 스터디 설명 */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="whitespace-pre-line text-gray-700">
                  {study.description.split('\n').map((line, index) => (
                    line.trim() && (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* 스터디 장소 */}
            <div>
              <h2 className="text-lg font-bold mb-4">스터디 장소</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-[#1B9AF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    {study.locationServiceUrl ? (
                      <a 
                        href={study.locationServiceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-[#1B9AF5] hover:underline"
                      >
                        {study.locationName}
                      </a>
                    ) : (
                      <p className="font-medium text-gray-900">{study.locationName}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 