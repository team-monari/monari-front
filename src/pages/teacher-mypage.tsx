import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import TeacherProfileHeader from "../components/TeacherProfileHeader";
import TeacherEducationSection from "../components/TeacherEducationSection";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";

// 선생님 프로필 인터페이스 정의
interface TeacherProfile {
  email: string;
  name: string;
  university: string;
  major: string;
  career: string;
  profileImageUrl: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
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
  totalPaymentAmount?: number;
  paidStudentCount?: number;
  pendingPaymentCount?: number;
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

const TeacherMyPage = () => {
  const router = useRouter();
  const { userType, accessToken, isAuthenticated } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
    null
  );
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonsError, setLessonsError] = useState<string | null>(null);

  // 내가 개설한 수업 목록 가져오기
  const fetchMyLessons = async () => {
    setIsLessonsLoading(true);
    setLessonsError(null);
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/teacher/me`
      );
      url.searchParams.append("size", "3");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("수업 목록을 불러오는데 실패했습니다.");
      }

      const data: PageResponse<Lesson> = await response.json();
      console.log("API Response:", data);
      
      setLessons(data.content);
    } catch (err) {
      console.error("Error fetching lessons:", err);
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
    if (accessToken) {
      fetchMyLessons();
    }
  }, [accessToken]);

  // 선생님 프로필 정보 가져오기
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

    if (userType !== "TEACHER") {
      router.push("/mypage");
      return;
    }

    const fetchTeacherProfile = async () => {
      try {
        setIsLoading(true);

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = `${baseUrl}/api/v1/teachers/me`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setTeacherProfile(data);
      } catch (err) {
        console.error("선생님 프로필 정보 가져오기 실패:", err);
        setError(
          "프로필 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [isAuthenticated, userType, accessToken, router]);

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B9AF5] mx-auto"></div>
          <p className="mt-3 text-gray-600">프로필 정보를 불러오는 중...</p>
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
        <title>선생님 마이페이지 | 모나리</title>
        <meta name="description" content="모나리 선생님 마이페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {teacherProfile && (
            <TeacherProfileHeader
              name={teacherProfile.name || "이름 미입력"}
              email={teacherProfile.email || "이메일 미입력"}
              profileImageUrl={teacherProfile.profileImageUrl}
            />
          )}
        </div>

        {teacherProfile && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">경력</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  대학교
                </h3>
                {teacherProfile.university ? (
                  <p>{teacherProfile.university}</p>
                ) : (
                  <p className="text-gray-400 italic text-sm">미입력</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  전공
                </h3>
                {teacherProfile.major ? (
                  <p>{teacherProfile.major}</p>
                ) : (
                  <p className="text-gray-400 italic text-sm">미입력</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  경력사항
                </h3>
                {teacherProfile.career ? (
                  <p className="whitespace-pre-line">{teacherProfile.career}</p>
                ) : (
                  <p className="text-gray-400 italic text-sm">미입력</p>
                )}
              </div>
            </div>

            {/* 계좌 정보 섹션 */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">계좌 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">
                    은행명
                  </h3>
                  {teacherProfile.bankName ? (
                    <p>{teacherProfile.bankName}</p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">미입력</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">
                    계좌번호
                  </h3>
                  {teacherProfile.accountNumber ? (
                    <p>{teacherProfile.accountNumber}</p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">미입력</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">
                    예금주
                  </h3>
                  {teacherProfile.accountHolder ? (
                    <p>{teacherProfile.accountHolder}</p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">미입력</p>
                  )}
                </div>
              </div>
        </div>

            {/* 프로필 정보 안내 메시지 */}
            <div className="mt-6 text-sm">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium">
                      프로필 정보가 불완전합니다
                    </p>
                    <p className="text-blue-600 mt-1">
                      프로필 정보를 완성하면 학생들이 더 신뢰할 수 있습니다.
                    </p>
                    <Link href="/edit-teacher-profile">
                      <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                        프로필 수정하기 →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">개설 수업</h2>
            <Link
              href="/myclasses"
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
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B9AF5]"></div>
            </div>
          ) : lessonsError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {lessonsError}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.lessonId}
                  href={`/lessons/${lesson.lessonId}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {lesson.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        lesson.status === "RECRUITING"
                          ? "bg-yellow-100 text-yellow-600"
                          : lesson.status === "IN_PROGRESS"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lesson.status === "RECRUITING"
                        ? "모집중"
                        : lesson.status === "IN_PROGRESS"
                        ? "진행중"
                        : "완료"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        lesson.schoolLevel === "MIDDLE"
                          ? "bg-[#1B9AF5]/10 text-[#1B9AF5]"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {lesson.schoolLevel === "MIDDLE" ? "중학교" : "고등학교"}
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">
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
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {new Date(lesson.startDate).toLocaleDateString()} - {new Date(lesson.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {lesson.currentStudent}/{lesson.maxStudent}명
                      </span>
                    </div>
                    <Link
                      href={`/lessons/${lesson.lessonId}/payments`}
                      className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      결제 현황 상세보기
                    </Link>
                  </div>
                </Link>
            ))}
          </div>
          )}
        </section>
      </main>

      <footer className="text-center text-sm text-gray-500 py-8">
        <p>© 2025 모나리. All rights reserved.</p>
        <p className="mt-2">이용약관 | 개인정보처리방침</p>
      </footer>
    </div>
  );
};

export default TeacherMyPage;
