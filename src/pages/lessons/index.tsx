import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import LessonSearch from '../../components/LessonSearch';

const LessonsPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>수업 찾기 - 모나리</title>
        <meta name="description" content="모나리 과외 목록 페이지" />
      </Head>
      <Header />
      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <h1 className="text-2xl font-bold mb-2">과외 목록</h1>
        <div className="mb-12">
          <LessonSearch onSearch={handleSearch} />
        </div>
      </main>
    </div>
  );
};

export default LessonsPage; 