import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import TeacherProfileHeader from "../components/TeacherProfileHeader";
import TeacherEducationSection, {
  EducationItem,
  ExperienceItem,
} from "../components/TeacherEducationSection";
import ClassCard, { ClassData } from "../components/ClassCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

// 샘플 데이터
const sampleTeacherData = {
  name: "김민수",
  job: "웹 개발 전문 강사",
  email: "minsu.kim@email.com",
  phone: "010-1234-5678",
  profileImage: undefined,
};

const sampleEducations: EducationItem[] = [
  {
    school: "서울대학교 컴퓨터공학과 석사",
    degree: "컴퓨터공학과",
    period: "(2018-2020)",
  },
  {
    school: "한국대학교 소프트웨어학과 학사",
    degree: "소프트웨어학과",
    period: "(2014-2018)",
  },
];

const sampleExperiences: ExperienceItem[] = [
  {
    company: "네이버 웹 개발팀 시니어 개발자",
    position: "(2020-현재)",
    period: "(2020-현재)",
  },
  {
    company: "카카오 프론트엔드 개발자",
    position: "프론트엔드 개발자",
    period: "(2018-2020)",
  },
  {
    company: "삼성전자 인턴 개발자",
    position: "인턴 개발자",
    period: "(2017)",
  },
];

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
  const { userType } = useAuth();

  // 프로필 편집 페이지로 이동
  const handleEditProfile = () => {
    router.push("/edit-teacher-profile");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>선생님 마이페이지 | 모나리</title>
        <meta name="description" content="모나리 선생님 마이페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-10">
          <TeacherProfileHeader
            name={sampleTeacherData.name}
            job={sampleTeacherData.job}
            email={sampleTeacherData.email}
            phone={sampleTeacherData.phone}
            profileImage={sampleTeacherData.profileImage}
          />
          <div className="p-4 flex justify-end">
            <button
              onClick={handleEditProfile}
              className="bg-[#1B9AF5] text-white px-4 py-2 rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
            >
              프로필 편집
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-10">
          <TeacherEducationSection
            educations={sampleEducations}
            experiences={sampleExperiences}
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
            {sampleClasses.map((classItem) => (
              <ClassCard key={classItem.id} classData={classItem} />
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
