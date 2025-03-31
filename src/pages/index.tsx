import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import FilterSection from '../components/FilterSection';
import LessonCard from '../components/LessonCard';

const Home = () => {
  const router = useRouter();
  const [filters, setFilters] = React.useState({
    subject: '',
    educationLevel: '',
    course: '',
    region: ''
  });

  const projects = [
    {
      title: '메타버스 교육 플랫폼',
      status: '학생 모집',
      progress: '78%',
      target: '5천만원',
      type: '학생 모집'
    },
    {
      title: 'AI 학습 분석 시스템',
      status: '팀당 진행중',
      progress: '65%',
      target: '3천만원',
      type: '팀당 진행중'
    },
    {
      title: '실시간 학습 플랫폼',
      status: '팀당 진행중',
      progress: '45%',
      target: '4천만원',
      type: '팀당 진행중'
    }
  ];

  const studies = [
    {
      title: '수능 수학 스터디',
      time: '2/4명',
      location: '강남역 인근',
      price: '월 30만원'
    },
    {
      title: '수능 영어 독해 스터디',
      time: '3/6명',
      location: '신촌역 인근',
      price: '월 25만원'
    },
    {
      title: '수능 과학탐구 스터디',
      time: '1/4명',
      location: '잠실역 인근',
      price: '월 40만원'
    },
    {
      title: '수능 사회탐구 스터디',
      time: '2/5명',
      location: '홍대입구역 인근',
      price: '월 35만원'
    }
  ];

  const lessons = [
    {
      id: 1,
      title: "중2 내신 수학 1등급 만들기",
      teacher: "김민수 선생님",
      period: "2024.03.01 ~ 2024.05.31",
      description: "중2 수학 내신 1등급 달성을 위한 체계적인 커리큘럼",
      price: 720000,
      originalPrice: 900000,
      discount: 20,
      location: "강남구",
      progress: 80
    },
    // ... 기존 수업 데이터 ...
  ];

  const handleCreateLesson = () => {
    router.push('/create-lesson');
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>모나리 - 선생님과 학생을 연결하는 플랫폼</title>
        <meta name="description" content="모나리 - 선생님과 학생을 연결하는 플랫폼" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-12 max-w-[1280px]">
        <section className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4">선생님과 학생을 연결하는 플랫폼</h1>
          <p className="text-gray-600 mb-8">현재 진행중인 인기 팀당 프로젝트를 확인해보세요</p>
          <div className="flex gap-4 justify-center">
            <Link href="/lessons" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">
              수업 찾기
            </Link>
            <button className="text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300">
              더 알아보기
            </button>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-sm text-blue-500 font-medium mb-2">{project.type}</div>
                <h3 className="text-xl font-bold mb-4">{project.title}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: project.progress }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{project.progress}</span>
                </div>
                <div className="text-right text-gray-900 font-medium">{project.target}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">스터디 모집</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studies.map((study, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium mb-4">{study.title}</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>시간</span>
                    <span className="text-gray-900">{study.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>예상 비용</span>
                    <span className="text-gray-900">{study.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-8">WE MAKE POSSIBLE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">팀 매칭</h3>
              <p className="text-gray-600">같은 목표를 가진 학습 동료를 쉽게 찾아보세요</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">성장의 매칭</h3>
              <p className="text-gray-600">전문적인 선생님과 함께 성장하세요</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">공간 대관</h3>
              <p className="text-gray-600">편리한 학습 공간을 합리적인 가격에 이용하세요</p>
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