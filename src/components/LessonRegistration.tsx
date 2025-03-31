import React, { useState } from 'react';

interface LessonRegistrationProps {
  onSubmit: (lessonData: any) => void;
}

const LessonRegistration: React.FC<LessonRegistrationProps> = ({ onSubmit }) => {
  const [lessonData, setLessonData] = useState({
    educationLevel: '중등',
    subject: '수학',
    title: '',
    description: '',
    minStudents: '3',
    maxStudents: '4',
    monthlyFee: '',
    startDate: '',
    endDate: '',
    location: '장소 선택하기'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(lessonData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-[#1B9AF5]">수업 개설</h1>
      <p className="text-gray-600 mb-8">현재 진행중인 인기 팀딩 프로젝트를 확인해보세요</p>
      
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">교육 대상</label>
              <select
                name="educationLevel"
                value={lessonData.educationLevel}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                <option value="중등">중등</option>
                <option value="고등">고등</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">과목</label>
              <select
                name="subject"
                value={lessonData.subject}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                <option value="수학">수학</option>
                <option value="영어">영어</option>
                <option value="국어">국어</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">수업 제목</label>
            <input
              type="text"
              name="title"
              placeholder="예: 중2 내신 수학 1등급 만들기"
              value={lessonData.title}
              onChange={handleChange}
              className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">수업 설명</label>
            <textarea
              name="description"
              placeholder="수업 명식, 대상, 커리큘럼, 수업 시간 등을 자세히 설명해주세요 (예: 매주 수요일 오후 3시~5시 수업 진행)"
              value={lessonData.description}
              onChange={handleChange}
              className="w-full h-32 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">최소 정원</label>
              <select
                name="minStudents"
                value={lessonData.minStudents}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}명</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">최대 정원</label>
              <select
                name="maxStudents"
                value={lessonData.maxStudents}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}명</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">월 수업 총액</label>
            <div className="relative flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="monthlyFee"
                  placeholder="900,000"
                  value={lessonData.monthlyFee}
                  onChange={handleChange}
                  className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">원</span>
              </div>
              <div className="text-red-500 font-medium">13% 할인</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">수업 시작일</label>
              <input
                type="date"
                name="startDate"
                value={lessonData.startDate}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">수업 종료일</label>
              <input
                type="date"
                name="endDate"
                value={lessonData.endDate}
                onChange={handleChange}
                className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">수업 장소</label>
            <select
              name="location"
              value={lessonData.location}
              onChange={handleChange}
              className="w-full h-[42px] px-3 border border-gray-200 rounded text-sm focus:outline-none"
            >
              <option value="장소 선택하기">장소 선택하기</option>
              <option value="강남구">강남구</option>
              <option value="서초구">서초구</option>
              <option value="송파구">송파구</option>
              <option value="마포구">마포구</option>
              <option value="서대문구">서대문구</option>
            </select>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-[#1B9AF5] text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-[#1B9AF5]/90 transition-colors"
            >
              수업 개설
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonRegistration; 