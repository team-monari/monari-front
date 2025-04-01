import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';

// 스터디 장소 목록 데이터
const studyLocations = [
  {
    id: 1,
    name: '강남구 청년창업지원센터 스터디룸',
    address: '서울특별시 강남구 테헤란로 123',
    availableTime: '09:00 - 22:00',
    rooms: ['스터디룸 A', '스터디룸 B', '스터디룸 C']
  },
  {
    id: 2,
    name: '신촌 스터디센터',
    address: '서울특별시 서대문구 신촌로 456',
    availableTime: '08:00 - 23:00',
    rooms: ['1번룸', '2번룸', '3번룸', '4번룸']
  },
  {
    id: 3,
    name: '홍대입구역 스터디카페',
    address: '서울특별시 마포구 홍대로 789',
    availableTime: '24시간',
    rooms: ['A룸', 'B룸', 'C룸', 'D룸']
  },
  {
    id: 4,
    name: '잠실역 스터디센터',
    address: '서울특별시 송파구 올림픽로 159',
    availableTime: '07:00 - 23:00',
    rooms: ['101호', '102호', '201호', '202호']
  }
];

interface FormData {
  title: string;
  grade: string;
  subject: string;
  location: string;
  room: string;
  description: string;
}

export default function CreateStudy() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    grade: '',
    subject: '',
    location: '',
    room: '',
    description: ''
  });

  const [selectedLocation, setSelectedLocation] = useState<typeof studyLocations[0] | null>(null);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = Number(e.target.value);
    const location = studyLocations.find(loc => loc.id === locationId) || null;
    setSelectedLocation(location);
    setFormData(prev => ({
      ...prev,
      location: e.target.value,
      room: '' // Reset room when location changes
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>스터디 모집하기 - 모나리</title>
        <meta name="description" content="모나리 스터디 모집 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">스터디 모집하기</h1>
          <p className="text-gray-600 mb-8">스터디 정보를 입력하여 멤버를 모집해보세요.</p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            {/* 스터디 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                스터디 제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="스터디 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                required
              />
            </div>

            {/* 학년과 과목 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  학년
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                  required
                >
                  <option value="">학년을 선택하세요</option>
                  <option value="중1">중1</option>
                  <option value="중2">중2</option>
                  <option value="중3">중3</option>
                  <option value="고1">고1</option>
                  <option value="고2">고2</option>
                  <option value="고3">고3</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  과목
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                  required
                >
                  <option value="">과목을 선택하세요</option>
                  <option value="수학">수학</option>
                  <option value="영어">영어</option>
                  <option value="국어">국어</option>
                  <option value="과학">과학</option>
                  <option value="사회">사회</option>
                </select>
              </div>
            </div>

            {/* 장소 선택 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  장소 선택
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleLocationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                  required
                >
                  <option value="">장소를 선택하세요</option>
                  {studyLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLocation && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#1B9AF5] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-900">{selectedLocation.address}</p>
                      <p className="text-sm text-gray-600">운영시간: {selectedLocation.availableTime}</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                      스터디룸 선택
                    </label>
                    <select
                      id="room"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent"
                      required
                    >
                      <option value="">스터디룸을 선택하세요</option>
                      {selectedLocation.rooms.map(room => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 스터디 상세 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                스터디 상세 설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="스터디 진행 방식, 준비물, 참여 조건 등 상세 내용을 작성해주세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent resize-none"
                required
              />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-[#1B9AF5] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1B9AF5]/90 transition-colors"
              >
                모집 시작하기
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 