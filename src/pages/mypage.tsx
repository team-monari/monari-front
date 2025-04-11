import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Header from "../components/Header";
import ProfileHeader from "../components/ProfileHeader";
import StudyCard, { StudyData } from "../components/StudyCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

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

// 샘플 데이터 - 실제로는 API에서 가져올 예정
const sampleUserData = {
  name: "김민수",
  school: "서울 과학고등학교 2학년",
  email: "minsu.kim@email.com",
  phone: "010-1234-5678",
  profileImage: undefined, // 기본 이미지를 사용하도록 undefined로 설정
};

const sampleStudies: StudyData[] = [
  {
    id: 1,
    title: "수학 문제풀이 스터디",
    type: "모집중",
    participants: "학습 대상: 고등학생",
    subject: "수학",
    status: "모집중",
  },
  {
    id: 2,
    title: "과학 실험 스터디",
    type: "진행중",
    participants: "학습 대상: 중등학생",
    subject: "영어",
    status: "진행중",
  },
  {
    id: 3,
    title: "영어 회화 스터디",
    type: "완료",
    participants: "학습 대상: 고등학생",
    subject: "국어",
    status: "완료",
  },
];

const sampleCourses = [
  {
    id: 1,
    title: "물리 실전 문제풀이",
    type: "모집중",
    participants: "담당 선생님: 박교사",
    time: "월, 수 17:00-19:00",
    status: "진행중",
  },
  {
    id: 2,
    title: "수능 영어 독해",
    type: "진행중",
    participants: "담당 선생님: 김교사",
    time: "화, 목 19:00-21:00",
    status: "진행중",
  },
  {
    id: 3,
    title: "생명과학 심화",
    type: "완료",
    participants: "담당 선생님: 이교사",
    time: "토 10:00-12:00",
    status: "완료",
  },
];

const MyPage = () => {
  const router = useRouter();
  const { userType, accessToken, isAuthenticated } = useAuth();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                profileImage={studentProfile.profileImageUrl || undefined}
                publicId={studentProfile.publicId}
                schoolName={studentProfile.schoolName}
                schoolLevel={studentProfile.schoolLevel}
                grade={studentProfile.grade}
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
                  학생 ID
                </h3>
                <p className="font-mono text-sm">{studentProfile.publicId}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  이메일
                </h3>
                <p>{studentProfile.email}</p>
              </div>

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
          <h2 className="text-xl font-bold mb-4">내가 개설한 스터디</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleStudies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">내가 참여한 수업</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleCourses.map((course) => (
              <StudyCard key={course.id} study={course as StudyData} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500 py-8">
        <p>© 2025 모나리. All rights reserved.</p>
        <p className="mt-2">이용약관 | 개인정보처리방침</p>
      </footer>
    </div>
  );
};

export default MyPage;
