import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { regions, getRegionText, Region, regionToKorean } from '../../utils/region';
import { generalLocationApi, GeneralLocation } from '../../services/generalLocation';
import { locationApi, Location } from '../../services/location';
import StudyCard from '../../components/StudyCard';
import { Study } from '../../types/study';

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
    case 'SOCIETY': return '사회';
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
    keyword: '',
    studyType: ''
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
  const [locationDetails, setLocationDetails] = useState<Record<number, GeneralLocation>>({});
  const [studyLocations, setStudyLocations] = useState<Record<number, Location>>({});

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
      if (filters.studyType) searchParams.append('studyType', filters.studyType);
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

      // Fetch location details for offline studies
      const locationPromises = data.content
        .filter((study: Study) => study.studyType === 'OFFLINE')
        .map(async (study: Study) => {
          if (study.generalLocationId && !locationDetails[study.generalLocationId]) {
            try {
              const location = await generalLocationApi.getLocation(study.generalLocationId);
              setLocationDetails(prev => ({
                ...prev,
                [study.generalLocationId!]: location
              }));
            } catch (err) {
              console.error('Failed to fetch general location details:', err);
            }
          } else if (study.locationId && !studyLocations[study.locationId]) {
            try {
              const location = await locationApi.getLocation(study.locationId);
              setStudyLocations(prev => ({
                ...prev,
                [study.locationId!]: location
              }));
            } catch (err) {
              console.error('Failed to fetch location details:', err);
            }
          }
        });

      await Promise.all(locationPromises);
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

  const getLocationName = (study: Study): string | null => {
    if (study.generalLocationId && locationDetails[study.generalLocationId]) {
      return locationDetails[study.generalLocationId].locationName;
    }
    if (study.locationId && studyLocations[study.locationId]) {
      return studyLocations[study.locationId].locationName;
    }
    return null;
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <option value="SOCIETY">사회</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">스터디 유형</label>
                <select
                  name="studyType"
                  value={filters.studyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                >
                  <option value="">전체</option>
                  <option value="ONLINE">온라인</option>
                  <option value="OFFLINE">오프라인</option>
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
                <StudyCard
                  key={study.id}
                  study={study}
                  locationName={getLocationName(study)}
                />
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