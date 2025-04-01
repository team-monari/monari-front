import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Link from 'next/link';

// 임시 스터디 데이터
const studyList = [
  {
    id: 1,
    title: '수학 기초 스터디',
    description: '수학 기초 개념부터 차근차근 학습하는 스터디입니다.',
    subject: '수학',
    status: '중학생'
  },
  {
    id: 2,
    title: '영어 회화 스터디',
    description: '실전 영어회화 능력 향상을 위한 스터디입니다.',
    subject: '영어',
    status: '고등학생'
  },
  {
    id: 3,
    title: '과학 실험 스터디',
    description: '재미있는 과학 실험과 함께하는 스터디입니다.',
    subject: '과학',
    status: '초등학생'
  },
  {
    id: 4,
    title: '국어 독서 토론',
    description: '다양한 도서를 읽고 토론하는 스터디입니다.',
    subject: '국어',
    status: '중학생'
  },
  {
    id: 5,
    title: '수능 수학 스터디',
    description: '수능 수학 문제 풀이 및 개념 학습 스터디입니다.',
    subject: '수학',
    status: '고등학생'
  },
  {
    id: 6,
    title: '코딩 기초 스터디',
    description: '프로그래밍 기초부터 배우는 스터디입니다.',
    subject: '컴퓨터',
    status: '대학생'
  }
];

export default function Studies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('전체');
  const [selectedSubject, setSelectedSubject] = useState('전체');
  const [activeTab, setActiveTab] = useState('제목'); // '제목' | '내용'

  // 필터링된 스터디 목록
  const filteredStudies = studyList.filter(study => {
    const matchesSearch = activeTab === '제목' 
      ? study.title.toLowerCase().includes(searchTerm.toLowerCase())
      : study.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === '전체' || study.status === selectedGrade;
    const matchesSubject = selectedSubject === '전체' || study.subject === selectedSubject;

    return matchesSearch && matchesGrade && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>스터디 찾기 - 모나리</title>
        <meta name="description" content="모나리 스터디 찾기 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <h1 className="text-2xl font-bold mb-8">스터디 찾기</h1>

        {/* 검색 섹션 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="스터디 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('제목')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === '제목'
                    ? 'bg-[#1B9AF5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                제목
              </button>
              <button
                onClick={() => setActiveTab('내용')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === '내용'
                    ? 'bg-[#1B9AF5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                내용
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                학년대상
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
              >
                <option value="전체">전체</option>
                <option value="초등학생">초등학생</option>
                <option value="중학생">중학생</option>
                <option value="고등학생">고등학생</option>
                <option value="대학생">대학생</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                과목
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
              >
                <option value="전체">전체</option>
                <option value="수학">수학</option>
                <option value="영어">영어</option>
                <option value="국어">국어</option>
                <option value="과학">과학</option>
                <option value="사회">사회</option>
                <option value="컴퓨터">컴퓨터</option>
              </select>
            </div>
          </div>
        </div>

        {/* 스터디 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map((study) => (
            <Link
              key={study.id}
              href={`/studies/${study.id}`}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">{study.title}</h3>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  study.status === '중학생' ? 'bg-[#1B9AF5]/10 text-[#1B9AF5]' :
                  study.status === '고등학생' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {study.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{study.description}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded-full">
                  {study.subject}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8 gap-2">
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-[#1B9AF5] text-white rounded">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
            &gt;
          </button>
        </div>
      </main>
    </div>
  );
} 