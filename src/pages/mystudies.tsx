import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { regionToKorean, Region } from '../utils/region';
import { Study } from '../types/study';

interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

const EmptyState = () => (
  <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">아직 개설한 스터디가 없습니다</h3>
      <p className="text-gray-500 mb-8">새로운 스터디를 개설하고 함께 공부해보세요!</p>
      <Link
        href="/create-study"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        <span>스터디 개설하기</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  </div>
);

const StudyCard = ({ study }: { study: Study }) => (
  <Link href={`/studies/${study.id}`} className="block">
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {study.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
          {study.schoolLevel === "MIDDLE" ? "중학교" : "고등학교"}
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
          {study.subject === "MATH" ? "수학" :
           study.subject === "ENGLISH" ? "영어" :
           study.subject === "KOREAN" ? "국어" :
           study.subject === "SCIENCE" ? "과학" : "사회"}
        </span>
        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${
          study.studyType === "ONLINE" 
            ? "bg-blue-50 text-blue-600 border-blue-100" 
            : "bg-purple-50 text-purple-600 border-purple-100"
        }`}>
          {study.studyType === "ONLINE" ? "온라인" : "오프라인"}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-5 line-clamp-2">
        {study.description}
      </p>

      <div className="mt-auto">
        {study.studyType === "OFFLINE" && study.locationName && (
          <div className="flex items-center gap-3 text-gray-500 mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex items-center gap-1 text-sm">
              <span>{study.locationName}</span>
              <span className="text-gray-400">·</span>
              <span>{regionToKorean[study.region]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </Link>
);

const Sidebar = ({ currentPath }: { currentPath: string }) => {
  const router = useRouter();
  
  return (
    <div className="w-72 flex-shrink-0">
      <button
        onClick={() => router.push('/mypage')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group px-4"
      >
        <svg
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>마이페이지로 돌아가기</span>
      </button>
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-2">
          <Link
            href="/mystudies"
            className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
              currentPath === '/mystudies' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${currentPath === '/mystudies' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">내가 개설한 스터디</span>
              <span className="text-sm text-gray-500">스터디 관리 및 확인</span>
            </div>
          </Link>
          <Link
            href="/mylessons"
            className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
              currentPath === '/mylessons'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${currentPath === '/mylessons' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">내가 참여한 수업</span>
              <span className="text-sm text-gray-500">수업 관리 및 확인</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const MyStudies = () => {
  const router = useRouter();
  const { userType, accessToken, isAuthenticated } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMyStudies = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies/me`
      );
      url.searchParams.append("pageSize", "6");
      url.searchParams.append("pageNumber", page.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("스터디 목록을 불러오는데 실패했습니다.");
      }

      const data: PageResponse<Study> = await response.json();
      setStudies(data.content);
      setTotalPages(data.page.totalPages);
      setTotalElements(data.page.totalElements);
    } catch (err) {
      console.error("Error fetching studies:", err);
      setError(
        err instanceof Error
          ? err.message
          : "스터디 목록을 불러오는데 실패했습니다."
      );
      setStudies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (!accessToken) {
      setError("인증 토큰이 없습니다. 다시 로그인해주세요.");
      setIsLoading(false);
      return;
    }

    if (userType !== "STUDENT") {
      router.push("/mypage");
      return;
    }

    fetchMyStudies(currentPage);
  }, [isAuthenticated, userType, accessToken, router, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">스터디 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>내가 개설한 스터디 - 모나리</title>
        <meta name="description" content="내가 개설한 스터디 목록과 관리" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex gap-8">
          <Sidebar currentPath={router.pathname} />

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">내가 개설한 스터디</h1>
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    총 {totalElements}개
                  </span>
                </div>
              </div>

              {studies.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studies.map((study) => (
                    <StudyCard 
                      key={study.id} 
                      study={study}
                    />
                  ))}
                </div>
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                            currentPage === pageNumber
                              ? 'bg-blue-50 text-blue-600 font-semibold transform scale-110'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return (
                        <span
                          key={pageNumber}
                          className="w-10 h-10 flex items-center justify-center text-gray-400"
                        >
                          ···
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2025 모나리. All rights reserved.</p>
          <div className="mt-3 space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">이용약관</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyStudies; 