import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Header from "../components/Header";
import ProfileHeader from "../components/ProfileHeader";
import StudyCard from "../components/StudyCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { regionToKorean, Region } from '../utils/region';

// 학생 프로필 인터페이스 정의
interface StudentProfile {
  publicId: string;
  email: string;
  name: string;
  schoolName: string;
  schoolLevel: "MIDDLE" | "HIGH";
  grade: "FIRST" | "SECOND" | "THIRD";
  profileImageUrl: string | null;
}

interface Study {
  id: number;
  title: string;
  description: string;
  subject: "MATH" | "ENGLISH" | "KOREAN" | "SCIENCE" | "SOCIETY";
  schoolLevel: "MIDDLE" | "HIGH";
  status: "ACTIVE" | "CLOSED" | "IN_PROGRESS";
  createdAt: string;
  studyType: "ONLINE" | "OFFLINE";
  locationId: number | null;
  generalLocationId: number | null;
  studentPublicId: string;
  studentName: string;
  region: Region;
  locationName: string;
  locationServiceUrl: string;
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

const MyPage = () => {
  const router = useRouter();
  const { userType, accessToken, isAuthenticated } = useAuth();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [myStudies, setMyStudies] = useState<Study[]>([]);
  const [myLessons, setMyLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudiesLoading, setIsStudiesLoading] = useState(false);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studiesError, setStudiesError] = useState<string | null>(null);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // 프로필 이미지 업로드 함수
  const handleProfileImageUpload = async (file: File): Promise<void> => {
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }

    try {
      // FormData 생성 및 파일 추가
      const formData = new FormData();
      formData.append("file", file);

      // 환경 변수에서 API URL 가져오기
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const apiUrl = `${baseUrl}/api/v1/students/me/profile-image`;

      // 이미지 업로드 API 호출
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type은 FormData를 사용할 때 자동으로 설정됨
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `이미지 업로드 실패: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("이미지 업로드 성공:", data);

      // 이미지 URL이 응답에 포함된 경우 상태 업데이트
      if (data.profileImageUrl) {
        setProfileImageUrl(data.profileImageUrl);
        // 프로필 정보도 업데이트
        setStudentProfile((prev) =>
          prev ? { ...prev, profileImageUrl: data.profileImageUrl } : null
        );
      } else {
        // 이미지 URL이 응답에 없는 경우 이미지를 다시 로드
        fetchProfileImage();
      }

      Swal.fire({
        icon: "success",
        title: "이미지 업로드 성공",
        text: "프로필 이미지가 업데이트되었습니다.",
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
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      throw error;
    }
  };

  // 프로필 이미지 조회 함수
  const fetchProfileImage = async () => {
    if (!accessToken) return;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const apiUrl = `${baseUrl}/api/v1/students/me/profile-image`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // 이미지가 없는 경우 등 404 오류는 정상적인 상황으로 처리
        if (response.status === 404) {
          setProfileImageUrl(null);
          return;
        }
        throw new Error(`이미지 조회 실패: ${response.status}`);
      }

      // 이미지 데이터를 Blob으로 받아오기
      const imageBlob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setProfileImageUrl(imageObjectUrl);
    } catch (error) {
      console.error("프로필 이미지 조회 중 오류 발생:", error);
      // 이미지 조회 실패는 치명적인 오류가 아니므로 기본 이미지를 사용
      setProfileImageUrl(null);
    }
  };

  // 내가 개설한 스터디 목록 가져오기
  const fetchMyStudies = async () => {
    setIsStudiesLoading(true);
    setStudiesError(null);
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies/me`
      );
      url.searchParams.append("size", "3");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("스터디 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      // API 응답을 StudyCard 인터페이스에 맞게 변환
      const transformedStudies = data.content.map((study: any) => ({
        ...study,
        studyType: study.locationId || study.generalLocationId ? 'OFFLINE' : 'ONLINE',
        locationId: study.locationId || null,
        generalLocationId: study.generalLocationId || null,
      }));
      setMyStudies(transformedStudies);
    } catch (err) {
      setStudiesError(
        err instanceof Error
          ? err.message
          : "스터디 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setIsStudiesLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchMyStudies();
    }
  }, [accessToken]);

  // 학생 프로필 정보 가져오기
  useEffect(() => {
    // 디버깅용 로그 추가
    console.log("인증 상태:", isAuthenticated);
    console.log("사용자 타입:", userType);
    console.log("액세스 토큰:", accessToken ? "토큰 있음" : "토큰 없음");

    // 로그인 상태가 아니면 메인 페이지로 리다이렉트
    if (!isAuthenticated) {
      console.log("인증되지 않은 사용자, 메인 페이지로 리다이렉트");
      router.push("/");
      return;
    }

    // 액세스 토큰이 없는 경우
    if (!accessToken) {
      console.log("액세스 토큰 없음, 오류 설정");
      setError("인증 토큰이 없습니다. 다시 로그인해주세요.");
      setIsLoading(false);
      return;
    }

    // 학생이 아니면 선생님 마이페이지로 리다이렉트
    if (userType !== "STUDENT") {
      console.log("학생이 아님, 선생님 페이지로 리다이렉트");
      router.push("/teacher-mypage");
      return;
    }

    const fetchStudentProfile = async () => {
      try {
        setIsLoading(true);
        console.log("학생 프로필 정보 요청 시작");

        // 환경 변수에서 API URL 가져오기
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = `${baseUrl}/api/v1/students/me`;
        console.log("API 요청 URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API 응답 상태:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API 오류 응답:", errorText);
          throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("받은 학생 데이터:", data);
        setStudentProfile(data);

        // 프로필 이미지 가져오기
        await fetchProfileImage();
      } catch (err) {
        console.error("학생 프로필 정보 가져오기 실패:", err);
        setError(
          "프로필 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentProfile();
  }, [isAuthenticated, userType, accessToken, router]);

  // 내가 참여한 수업 목록 가져오기
  const fetchMyLessons = async () => {
    setIsLessonsLoading(true);
    setLessonsError(null);
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/student/me`
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

      const data = await response.json();
      setMyLessons(data.content);
    } catch (err) {
      setLessonsError(
        err instanceof Error
          ? err.message
          : "수업 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setIsLessonsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchMyLessons();
    }
  }, [accessToken]);

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
        <title>마이페이지 | 모나리</title>
        <meta name="description" content="모나리 학생 마이페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {studentProfile && (
            <>
              <ProfileHeader
                name={studentProfile.name}
                email={studentProfile.email}
                profileImage={profileImageUrl || studentProfile.profileImageUrl}
                canEditImage={true}
                onImageUpload={handleProfileImageUpload}
              />
            </>
          )}
        </div>

        {studentProfile && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">학생 정보</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  학교
                </h3>
                {studentProfile.schoolName ? (
                  <p>{studentProfile.schoolName}</p>
                ) : (
                  <p className="text-gray-400 italic text-sm">미입력</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  학년
                </h3>
                {studentProfile.grade ? (
                  <p>
                    {studentProfile.grade === "FIRST"
                      ? "1학년"
                      : studentProfile.grade === "SECOND"
                      ? "2학년"
                      : "3학년"}
                  </p>
                ) : (
                  <p className="text-gray-400 italic text-sm">미입력</p>
                )}
              </div>
            </div>

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
                    <p className="text-blue-700 font-medium">프로필 정보</p>
                    <p className="mt-1 text-blue-600">
                      정확한 프로필 정보는 맞춤형 학습 경험을 위해 중요합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">내가 개설한 스터디</h2>
            <Link
              href="/mystudies"
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

          {isStudiesLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B9AF5]"></div>
            </div>
          ) : studiesError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {studiesError}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myStudies.slice(0, 3).map((study) => (
                <StudyCard
                  key={study.id}
                  study={study}
                  locationName={study.locationName}
                />
              ))}
          </div>
          )}
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">내가 참여한 수업</h2>
            <Link
              href="/mylessons"
              className="flex items-center gap-1 text-[#1B9AF5] hover:text-[#1B9AF5]/80 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                router.push('/mylessons');
              }}
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
              {myLessons.slice(0, 3).map((lesson) => (
                <Link
                  key={lesson.lessonId}
                  href={`/lessons/${lesson.lessonId}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1 max-w-[80%]">
                      {lesson.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        lesson.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : lesson.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {lesson.status === "ACTIVE" ? "모집중" : lesson.status === "IN_PROGRESS" ? "진행중" : "모집완료"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                      {lesson.schoolLevel === 'MIDDLE' ? '중학교' : '고등학교'}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                      {lesson.subject === 'MATH' ? '수학' :
                       lesson.subject === 'ENGLISH' ? '영어' :
                       lesson.subject === 'KOREAN' ? '국어' :
                       lesson.subject === 'SCIENCE' ? '과학' : '사회'}
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

      <footer className="mt-12 text-center text-sm text-gray-500 py-8">
        <p>© 2025 모나리. All rights reserved.</p>
        <p className="mt-2">이용약관 | 개인정보처리방침</p>
      </footer>
      </main>
    </div>
  );
};

export default MyPage;
