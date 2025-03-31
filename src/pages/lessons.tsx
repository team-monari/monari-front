import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import LessonSearch from '../components/LessonSearch';

export default function Lessons() {
  const [filters, setFilters] = useState({
    subject: '',
    educationLevel: '전체',
    course: '전체',
    region: '전체',
  });

  const lessons = [
    {
      id: 1,
      title: '수학 기초 완성반',
      teacher: '김선생님',
      period: '2024.03.01 ~ 2024.06.30',
      description: '중학교 1학년을 위한 수학 기초 완성 수업입니다. 기초 개념부터 차근히근 설명해드립니다.',
      price: 180000,
      originalPrice: 200000,
      discount: 10,
      location: '서울 강남구',
      progress: '12/15',
    },
    {
      id: 2,
      title: '영어 회화 심화반',
      teacher: '이선생님',
      period: '2024.03.15 ~ 2024.07.15',
      description: '고등학생을 위한 실전 영어 회화 수업입니다. 원어민과 함께하는 실전 회화 훈련',
      price: 250000,
      originalPrice: 250000,
      discount: 0,
      location: '서울 서초구',
      progress: '15/15',
    },
    {
      id: 3,
      title: '국어 독해력 향상반',
      teacher: '박선생님',
      period: '2024.03.10 ~ 2024.06.20',
      description: '중학생을 위한 국어 독해력 향상 수업입니다. 다양한 지문을 통해 실전 연습을 진행합니다.',
      price: 190000,
      originalPrice: 220000,
      discount: 15,
      location: '경기 분당구',
      progress: '8/15',
    },
    {
      id: 4,
      title: '수학 문제풀이반',
      teacher: '정선생님',
      period: '2024.04.01 ~ 2024.07.31',
      description: '고등학교 수학 문제풀이를 중심으로 실전 대비를 합니다. 실전 문제 해결 능력을 향상시킵니다.',
      price: 160000,
      originalPrice: 200000,
      discount: 20,
      location: '서울 송파구',
      progress: '5/15',
    },
    {
      id: 5,
      title: '영어 문법 완성반',
      teacher: '최선생님',
      period: '2024.03.20 ~ 2024.07.20',
      description: '중고등학교 영어 문법의 기초부터 심화까지 체계적으로 학습합니다.',
      price: 175000,
      originalPrice: 200000,
      discount: 12,
      location: '경기 일산',
      progress: '10/15',
    },
    {
      id: 6,
      title: '국어 논술반',
      teacher: '한선생님',
      period: '2024.04.05 ~ 2024.08.05',
      description: '고등학교 대비 국어 논술 심화 과정입니다. 논리적 사고와 글쓰기 능력을 향상시킵니다.',
      price: 180000,
      originalPrice: 220000,
      discount: 18,
      location: '서울 마포구',
      progress: '7/15',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>모나리 - 수업 찾기</title>
        <meta name="description" content="모나리 과외/수업 검색" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <LessonSearch 
          filters={filters}
          setFilters={setFilters}
          lessons={lessons}
        />
      </main>
    </div>
  );
} 