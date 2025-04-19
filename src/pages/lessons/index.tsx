import React, { useState } from 'react';
import { useRouter } from 'next/router';
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
      <Header />
      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="mb-12">
          <h1 className="text-2xl font-bold mb-8">수업 찾기</h1>
          <LessonSearch onSearch={handleSearch} />
        </div>
      </main>
    </div>
  );
};

export default LessonsPage; 