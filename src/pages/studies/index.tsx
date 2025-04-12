import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface Study {
  id: number;
  title: string;
  description: string;
  subject: 'MATH' | 'ENGLISH' | 'KOREAN' | 'SCIENCE' | 'SOCIAL';
  schoolLevel: 'MIDDLE' | 'HIGH';
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
  locationName: string;
  locationServiceUrl: string;
  studentPublicId: string;
  studentName: string;
}

interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

const getSubjectLabel = (subject: Study['subject']) => {
  switch (subject) {
    case 'MATH': return '수학';
    case 'ENGLISH': return '영어';
    case 'KOREAN': return '국어';
    case 'SCIENCE': return '과학';
    case 'SOCIAL': return '사회';
    default: return subject;
  }
};

const getStatusLabel = (status: Study['status']) => {
  switch (status) {
    case 'ACTIVE': return '모집중';
    case 'CLOSED': return '모집완료';
    default: return status;
  }
};

const getStatusColor = (status: Study['status']) => {
  switch (status) {
    case 'ACTIVE': return 'bg-yellow-100 text-yellow-600';
    case 'CLOSED': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function Studies() {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('전체');
  const [selectedSubject, setSelectedSubject] = useState('전체');
  const [activeTab, setActiveTab] = useState('제목');
  const [pageResponse, setPageResponse] = useState<PageResponse<Study>>({
    content: [],
    page: {
      size: 10,
      number: 0,
      totalElements: 0,
      totalPages: 0
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchStudies = async (page: number = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies`);
      if (page > 0) {
        url.searchParams.append('pageNum', String(page + 1));
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('스터디 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setPageResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '스터디 목록을 불러오는데 실패했습니다.');
      setPageResponse(prev => ({ ...prev, content: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 스터디 목록 로드
  useEffect(() => {
    fetchStudies();
  }, []);

  // 검색 실행 함수
  const handleSearch = async (page: number = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies/search`);
      
      // 페이지 번호 추가
      if (page > 0) {
        url.searchParams.append('pageNum', String(page + 1));
      }

      // 검색어가 있는 경우 검색 타입에 따라 파라미터 추가
      if (searchTerm) {
        if (activeTab === '제목') {
          url.searchParams.append('titleKeyword', searchTerm);
        } else {
          url.searchParams.append('descriptionKeyword', searchTerm);
        }
      }

      // 학년 필터 추가
      if (selectedGrade !== '전체') {
        url.searchParams.append('schoolLevel', selectedGrade);
      }

      // 과목 필터 추가
      if (selectedSubject !== '전체') {
        url.searchParams.append('subject', selectedSubject);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('검색에 실패했습니다.');
      }

      const data = await response.json();
      setPageResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색에 실패했습니다.');
      setPageResponse(prev => ({ ...prev, content: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (searchTerm || selectedGrade !== '전체' || selectedSubject !== '전체') {
      handleSearch(newPage);
    } else {
      fetchStudies(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>스터디 찾기 - 모나리</title>
        <meta name="description" content="모나리 스터디 찾기 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <h1 className="text-2xl font-bold mb-8">스터디 찾기</h1>

        {/* 검색 섹션 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="스터디 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('제목')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === '제목'
                    ? 'bg-[#1B9AF5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                제목
              </button>
              <button
                onClick={() => setActiveTab('내용')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === '내용'
                    ? 'bg-[#1B9AF5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                내용
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대상
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
              >
                <option value="전체">전체</option>
                <option value="MIDDLE">중학교</option>
                <option value="HIGH">고등학교</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                과목
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
              >
                <option value="전체">전체</option>
                <option value="MATH">수학</option>
                <option value="ENGLISH">영어</option>
                <option value="KOREAN">국어</option>
                <option value="SCIENCE">과학</option>
                <option value="SOCIAL">사회</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className={`px-6 py-2 bg-[#1B9AF5] text-white rounded-md hover:bg-[#1B9AF5]/90 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '검색 중...' : '검색'}
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 스터디 목록 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AF5]"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageResponse.content.map((study) => (
                <Link
                  key={study.id}
                  href={`/studies/${study.id}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{study.title}</h3>
                    <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(study.status)}`}>
                      {getStatusLabel(study.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      study.schoolLevel === 'MIDDLE' ? 'bg-[#1B9AF5]/10 text-[#1B9AF5]' :
                      study.schoolLevel === 'HIGH' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {study.schoolLevel === 'MIDDLE' ? '중학교' : '고등학교'}
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">
                      {getSubjectLabel(study.subject)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 truncate">{study.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                      <svg 
                        className="w-4 h-4 text-gray-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{study.locationName}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            {pageResponse.page.totalPages > 0 && pageResponse.content.length > 0 && (
              <div className="flex justify-center mt-8 gap-1">
                <button
                  onClick={() => handlePageChange(pageResponse.page.number - 1)}
                  disabled={pageResponse.page.number === 0}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                >
                  &lt;
                </button>
                {Array.from({ length: pageResponse.page.totalPages }, (_, i) => {
                  // 현재 페이지 주변의 페이지만 표시
                  if (
                    i === 0 || // 첫 페이지
                    i === pageResponse.page.totalPages - 1 || // 마지막 페이지
                    Math.abs(i - pageResponse.page.number) <= 1 // 현재 페이지 주변
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          pageResponse.page.number === i
                            ? 'text-[#1B9AF5] font-semibold'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  // 생략 부호 (...) 표시
                  if (i === pageResponse.page.number - 2 || i === pageResponse.page.number + 2) {
                    return (
                      <span
                        key={i}
                        className="w-8 h-8 flex items-center justify-center text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(pageResponse.page.number + 1)}
                  disabled={pageResponse.page.number === pageResponse.page.totalPages - 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 