import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { regionToKorean, Region } from '../utils/region';

interface Study {
  id: number;
  title: string;
  description: string;
  subject: "MATH" | "ENGLISH" | "KOREAN" | "SCIENCE" | "SOCIAL";
  schoolLevel: "MIDDLE" | "HIGH";
  status: "ACTIVE" | "CLOSED" | "IN_PROGRESS";
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

const MyStudies = () => {
  const router = useRouter();
  const { userType, accessToken, isAuthenticated } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 내가 개설한 스터디 목록 가져오기
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

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B9AF5] mx-auto"></div>
          <p className="mt-3 text-gray-600">스터디 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#1B9AF5] text-white px-4 py-2 rounded-lg"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>내가 개설한 스터디 | 모나리</title>
        <meta name="description" content="모나리 개설 스터디" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-8">
          {/* 사이드바 영역 */}
          <div className="w-64 flex-shrink-0">
            <button
              onClick={() => router.push('/mypage')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                <Link
                  href="/mystudies"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1B9AF5] text-white rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span>내가 개설한 스터디</span>
                </Link>
                <Link
                  href="/mylessons"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>내가 참여한 수업</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">내가 개설한 스터디</h1>
              </div>
              <div className="text-gray-600">
                총 {totalElements}개의 스터디
              </div>
            </div>

            {studies.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-600">개설한 스터디가 없습니다.</p>
                <Link
                  href="/create-study"
                  className="mt-4 inline-block bg-[#1B9AF5] text-white px-4 py-2 rounded-lg"
                >
                  스터디 개설하기
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studies.map((study) => (
                    <Link
                      key={study.id}
                      href={`/studies/${study.id}`}
                      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-1 max-w-[80%]">
                          {study.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            study.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : study.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {study.status === "ACTIVE"
                            ? "모집중"
                            : study.status === "IN_PROGRESS"
                            ? "진행중"
                            : "모집완료"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                          {study.schoolLevel === "MIDDLE" ? "중학교" : "고등학교"}
                        </span>
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                          {study.subject === "MATH"
                            ? "수학"
                            : study.subject === "ENGLISH"
                            ? "영어"
                            : study.subject === "KOREAN"
                            ? "국어"
                            : study.subject === "SCIENCE"
                            ? "과학"
                            : "사회"}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 truncate">
                        {study.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
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
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              currentPage === pageNumber
                                ? 'text-[#1B9AF5] font-semibold'
                                : 'text-gray-500 hover:bg-gray-50'
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
                            className="w-8 h-8 flex items-center justify-center text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-8">
        <p>© 2025 모나리. All rights reserved.</p>
        <p className="mt-2">이용약관 | 개인정보처리방침</p>
      </footer>
    </div>
  );
};

export default MyStudies; 