import React, { useState } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/router';

interface FormData {
  title: string;
  description: string;
  price: number;
  minStudents: number;
  maxStudents: number;
  location: string;
  period: string;
  educationLevel: string;
  subject: string;
}

const CreateLessonPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    minStudents: 4,
    maxStudents: 7,
    location: '',
    period: '',
    educationLevel: '',
    subject: ''
  });

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 호출 로직 구현
    router.push('/lessons');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">수업 개설하기</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                placeholder="수업 제목을 입력하세요"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                rows={4}
                placeholder="수업 설명을 입력하세요"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 가격
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                  placeholder="수업 가격을 입력하세요"
                />
                <span className="absolute right-3 top-2 text-gray-500">원</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                모집 인원
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">최소 인원</label>
                  <input
                    type="number"
                    value={formData.minStudents}
                    onChange={(e) => handleChange('minStudents', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                    placeholder="최소 인원"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">최대 인원</label>
                  <input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleChange('maxStudents', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                    placeholder="최대 인원"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 기간
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => handleChange('period', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                placeholder="예: 2024년 3월 ~ 6월"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                교육 대상
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleChange('educationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
              >
                <option value="">선택하세요</option>
                <option value="초등">초등학생</option>
                <option value="중등">중학생</option>
                <option value="고등">고등학생</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                과목
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
              >
                <option value="">선택하세요</option>
                <option value="국어">국어</option>
                <option value="영어">영어</option>
                <option value="수학">수학</option>
                <option value="과학">과학</option>
                <option value="사회">사회</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수업 장소
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B9AF5]"
                placeholder="수업 장소를 입력하세요"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#1B9AF5] text-white rounded-md hover:bg-[#1B9AF5]/90"
              >
                수업 개설하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLessonPage; 