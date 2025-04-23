import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/router";
import FilterSection from "../components/FilterSection";
import LessonCard from "../components/LessonCard";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { Region, regionToKorean } from "../utils/region";

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

interface Lesson {
  lessonId: number;
  locationId: number;
  teacherId: number;
  title: string;
  currentStudent: number;
  description: string;
  amount: number;
  minStudent: number;
  maxStudent: number;
  startDate: string;
  endDate: string;
  deadline: string;
  status: string;
  schoolLevel: string;
  subject: string;
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

const getSubjectLabel = (subject: Study["subject"]) => {
  switch (subject) {
    case "MATH":
      return "수학";
    case "ENGLISH":
      return "영어";
    case "KOREAN":
      return "국어";
    case "SCIENCE":
      return "과학";
    case "SOCIAL":
      return "사회";
    default:
      return subject;
  }
};

const getStatusLabel = (status: Study["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "모집중";
    case "CLOSED":
      return "모집완료";
    case "IN_PROGRESS":
      return "진행중";
    default:
      return status;
  }
};

const getStatusColor = (status: Study["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "bg-yellow-100 text-yellow-600";
    case "CLOSED":
      return "bg-gray-100 text-gray-600";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Home = () => {
  const router = useRouter();
  const { accessToken, checkTokenValidity } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  // 페이지 로드 시 토큰 유효성 검사
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (accessToken) {
          await checkTokenValidity();
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
      } finally {
        setTokenChecked(true);
      }
    };

    validateToken();
  }, [accessToken, checkTokenValidity]);

  // API 호출 함수
  const fetchStudies = async () => {
    // 토큰 검사가 완료되지 않았으면 기다림
    if (accessToken && !tokenChecked) return;

    setIsLoading(true);
    setError(null);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies`);
      url.searchParams.append("size", "3"); // 메인 페이지에는 3개만 표시

      const headers: HeadersInit = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        headers,
      });

      if (!response.ok) {
        // 만약 401 에러가 발생하면 (토큰 만료 가능성)
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
        throw new Error("스터디 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setStudies(data.content);
    } catch (err) {
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

  // 수업 목록 가져오기
  const fetchLessons = async () => {
    // 토큰 검사가 완료되지 않았으면 기다림
    if (accessToken && !tokenChecked) return;

    setIsLessonsLoading(true);
    setLessonsError(null);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons`);
      url.searchParams.append("size", "3");

      const headers: HeadersInit = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        headers,
      });

      if (!response.ok) {
        // 만약 401 에러가 발생하면 (토큰 만료 가능성)
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
        throw new Error("수업 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      // CANCELED 상태의 수업은 제외
      const filteredLessons = data.content.filter(
        (lesson: Lesson) => lesson.status !== "CANCELED"
      );
      setLessons(filteredLessons);
    } catch (err) {
      setLessonsError(
        err instanceof Error
          ? err.message
          : "수업 목록을 불러오는데 실패했습니다."
      );
      setLessons([]);
    } finally {
      setIsLessonsLoading(false);
    }
  };

  useEffect(() => {
    // 토큰 검사가 완료되거나, 토큰이 없는 경우 API 호출
    if (tokenChecked || !accessToken) {
      fetchStudies();
      fetchLessons();
    }
  }, [tokenChecked, accessToken]);

  // 로그인 성공 확인 및 알림 표시
  useEffect(() => {
    // 로컬 스토리지에서 로그인 성공 플래그 확인
    const loginSuccess = localStorage.getItem("login_success");
    const userType = localStorage.getItem("login_user_type");

    if (loginSuccess === "true" && userType) {
      // 로그인 성공 알림 표시 - 작게, 중앙 상단에 표시
      Swal.fire({
        icon: "success",
        title: "로그인 성공",
        text: `${
          userType === "STUDENT" ? "학생" : "선생님"
        }으로 로그인되었습니다`,
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: "auto",
        padding: "0.5em",
        customClass: {
          container: "z-50",
          popup: "p-2",
          title: "text-sm font-medium",
          htmlContainer: "text-xs",
        },
      });

      // 플래그 제거 (중복 알림 방지)
      localStorage.removeItem("login_success");
      localStorage.removeItem("login_user_type");
    }
  }, []);

  const handleCreateLesson = () => {
    router.push("/create-lesson");
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>모나리 - 선생님과 학생을 연결하는 플랫폼</title>
        <meta
          name="description"
          content="모나리 - 선생님과 학생을 연결하는 플랫폼"
        />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-12 max-w-[1280px]">
        <section className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4">
            선생님과 학생을 연결하는 플랫폼
          </h1>
          <p className="text-gray-600 mb-8">
            현재 진행중인 인기 팀당 프로젝트를 확인해보세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/lessons"
              className="bg-[#1B9AF5] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1B9AF5]/90"
            >
              수업 찾기
            </Link>
            <Link
              href="/aboutus"
              className="text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50"
            >
              더 알아보기
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">학생 모집</h2>
            <Link
              href="/lessons"
              className="flex items-center gap-1 text-[#1B9AF5] hover:text-[#1B9AF5]/80 transition-colors"
            >
              <span>더보기</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {isLessonsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AF5]"></div>
            </div>
          ) : lessonsError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {lessonsError}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.slice(0, 3).map((lesson) => (
                <Link
                  key={lesson.lessonId}
                  href={`/lessons/${lesson.lessonId}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1 max-w-[80%]">
                      {lesson.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        lesson.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : lesson.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {lesson.status === "ACTIVE"
                        ? "모집중"
                        : lesson.status === "IN_PROGRESS"
                        ? "진행중"
                        : "모집완료"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                      {lesson.schoolLevel === "MIDDLE" ? "중학교" : "고등학교"}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                      {lesson.subject === "MATH"
                        ? "수학"
                        : lesson.subject === "ENGLISH"
                        ? "영어"
                        : lesson.subject === "KOREAN"
                        ? "국어"
                        : lesson.subject === "SCIENCE"
                        ? "과학"
                        : "사회"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 truncate">
                    {lesson.description}
                  </p>

                  <div className="flex flex-col gap-2">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {new Date(lesson.startDate).toLocaleDateString()} ~{" "}
                          {new Date(lesson.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {lesson.currentStudent}/{lesson.maxStudent}명
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">스터디 모집</h2>
            <Link
              href="/studies"
              className="flex items-center gap-1 text-[#1B9AF5] hover:text-[#1B9AF5]/80 transition-colors"
            >
              <span>더보기</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AF5]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies.slice(0, 3).map((study) => (
                <Link
                  key={study.id}
                  href={`/studies/${study.id}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-100"
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
                      {getSubjectLabel(study.subject)}
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
                      <span className="text-sm text-gray-600">
                        {study.locationName}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({regionToKorean[study.region]})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-8">WE MAKE POSSIBLE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-[#1B9AF5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1B9AF5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">팀 매칭</h3>
              <p className="text-gray-600">
                같은 목표를 가진 학습 동료를 쉽게 찾아보세요
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#1B9AF5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1B9AF5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">성장의 매칭</h3>
              <p className="text-gray-600">전문적인 선생님과 함께 성장하세요</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#1B9AF5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1B9AF5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">공간 대관</h3>
              <p className="text-gray-600">
                편리한 학습 공간을 합리적인 가격에 이용하세요
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-24 text-center text-sm text-gray-500">
          <p>© 2025 모나리. All rights reserved.</p>
          <p className="mt-2">이용약관 | 개인정보처리방침</p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
