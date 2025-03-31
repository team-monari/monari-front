import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Header from "../components/Header";
import ProfileHeader from "../components/ProfileHeader";
import StudyCard, { StudyData } from "../components/StudyCard";

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
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>마이페이지 | 모나리</title>
        <meta name="description" content="모나리 학생 마이페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <ProfileHeader
            name={sampleUserData.name}
            school={sampleUserData.school}
            email={sampleUserData.email}
            phone={sampleUserData.phone}
            profileImage={sampleUserData.profileImage}
          />
        </div>

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
