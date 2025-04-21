import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { regions, getRegionText, Region, regionToKorean } from '../../utils/region';

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
  region: Region;
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
    case 'ACTIVE': return 'bg-green-100 text-green-800';
    case 'CLOSED': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Studies() {
  const { accessToken } = useAuth();
  const [filters, setFilters] = useState({
    subject: '',
    schoolLevel: '',
    region: '' as Region | '',
    searchType: 'title',
    keyword: ''
  });
  const [pageResponse, setPageResponse] = useState<PageResponse<Study>>({
    content: [],
    page: {
      size: 6,
      number: 0,
      totalElements: 0,
      totalPages: 0
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (page: number = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      
      if (filters.keyword) {
        if (filters.searchType === 'title') {
          searchParams.append('titleKeyword', filters.keyword);
        } else if (filters.searchType === 'description') {
          searchParams.append('descriptionKeyword', filters.keyword);
        }
      }

      if (filters.subject) searchParams.append('subject', filters.subject);
      if (filters.schoolLevel) searchParams.append('schoolLevel', filters.schoolLevel);
      if (filters.region) searchParams.append('region', filters.region);
      searchParams.append('pageNum', String(page + 1));
      searchParams.append('pageSize', '6');

      const headers: HeadersInit = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies/search?${searchParams.toString()}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('검색 요청에 실패했습니다.');
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 컴포넌트 마운트 시 스터디 목록 로드
  useEffect(() => {
    handleSearch();
  }, []);

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage);
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
          <div className="space-y-6">
            {/* 검색 영역 */}
            <div className="flex items-center gap-4">
              <select
                name="searchType"
                value={filters.searchType}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
              >
                <option value="title">제목</option>
                <option value="description">내용</option>
              </select>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => handleSearch()}
                className="px-6 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
              >
                검색
              </button>
            </div>

            {/* 필터 영역 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">교육 대상</label>
                <select
                  name="schoolLevel"
                  value={filters.schoolLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                >
                  <option value="">전체</option>
                  <option value="MIDDLE">중학교</option>
                  <option value="HIGH">고등학교</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
                <select
                  name="subject"
                  value={filters.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                >
                  <option value="">전체</option>
                  <option value="MATH">수학</option>
                  <option value="ENGLISH">영어</option>
                  <option value="KOREAN">국어</option>
                  <option value="SCIENCE">과학</option>
                  <option value="SOCIAL">사회</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <select
                  name="region"
                  value={filters.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                >
                  <option value="">전체</option>
                  {Object.values(regions).map((region) => (
                    <option key={region} value={region}>
                      {getRegionText(region)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1 max-w-[80%]">
                      {study.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(study.status)}`}>
                      {getStatusLabel(study.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                      {study.schoolLevel === 'MIDDLE' ? '중학교' : '고등학교'}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
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
                      <span className="text-sm text-gray-600">({regionToKorean[study.region]})</span>
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
                  if (
                    i === 0 ||
                    i === pageResponse.page.totalPages - 1 ||
                    Math.abs(i - pageResponse.page.number) <= 1
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