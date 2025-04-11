import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import TeacherProfileHeader from "../components/TeacherProfileHeader";
import TeacherEducationSection from "../components/TeacherEducationSection";
import ClassCard, { ClassData } from "../components/ClassCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

// 선생님 프로필 인터페이스 정의
interface TeacherProfile {
  publicID: string;
  email: string;
  name: string;
  university: string;
  major: string;
  career: string;
  profileImageUrl: string | null;
}

// 샘플 수업 데이터
const sampleClasses: ClassData[] = [
  {
    id: 1,
    title: "JavaScript 기초 강의",
    period: "2024.01.15 - 2024.03.15",
    students: "수강인원: 15/20명",
    status: "진행중",
  },
  {
    id: 2,
    title: "React 심화 과정",
    period: "2024.02.01 - 2024.04.01",
    students: "수강인원: 8/25명",
    status: "모집중",
  },
  {
    id: 3,
    title: "Node.js 웹서버 구축",
    period: "2023.11.01 - 2024.01.01",
    students: "수강인원: 20/20명",
    status: "완료",
  },
];

const TeacherMyPage = () => {
  const router = useRouter();
  const { userType, accessToken, isAuthenticated } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 선생님 프로필 정보 가져오기
  useEffect(() => {
    // 로그인 상태가 아니면 메인 페이지로 리다이렉트
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // 액세스 토큰이 없는 경우
    if (!accessToken) {
      setError("인증 토큰이 없습니다. 다시 로그인해주세요.");
      setIsLoading(false);
      return;
    }

    // 선생님이 아니면 학생 마이페이지로 리다이렉트
    if (userType !== "TEACHER") {
      router.push("/mypage");
      return;
    }

    const fetchTeacherProfile = async () => {
      try {
        setIsLoading(true);

        // 환경 변수에서 API URL 가져오기
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

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-10">
          {teacherProfile && (
            <TeacherProfileHeader
              name={teacherProfile.name || "이름 미입력"}
              email={teacherProfile.email || "이메일 미입력"}
              profileImageUrl={teacherProfile.profileImageUrl}
              publicID={teacherProfile.publicID}
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-10">
          <TeacherEducationSection
            educations={[]}
            experiences={[]}
            university={teacherProfile?.university}
            major={teacherProfile?.major}
            career={teacherProfile?.career}
          />
        </div>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">개설 수업</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
              수업 등록하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleClasses.map((classData) => (
              <ClassCard key={classData.id} classData={classData} />
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

export default TeacherMyPage;
