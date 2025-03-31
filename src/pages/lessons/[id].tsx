import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

// 데모 데이터
const lessonDetail = {
  id: '1',
  title: "중2 내신 수학 1등급 만들기",
  subTitle: "수학 교과 내신 대비 특별 수업",
  teacher: {
    id: '1',
    name: "김민수",
    image: "/teachers/teacher1.jpg",
    university: "서울대학교 수학교육과",
    experience: "5년"
  },
  period: "2024.03.01 ~ 2024.05.31",
  price: 720000,
  originalPrice: 900000,
  discount: 20,
  location: "강남 스터디센터 (2호선 강남역 4번 출구 도보 3분)",
  currentStudents: 3,
  minStudents: 4,
  maxStudents: 7,
  targetGrade: "중등 2학년",
  subject: "수학",
  description: [
    {
      title: "수업 목표",
      content: [
        "중2 수학 내신 1등급 달성",
        "기초 개념부터 심화 문제까지 체계적 학습",
        "개인별 맞춤형 학습 관리"
      ]
    },
    {
      title: "수업 방식",
      content: [
        "매주 수요일 오후 3시~5시 수업 진행",
        "실시간 문제 풀이 및 개별 설명",
        "주간 테스트로 성적도 확인"
      ]
    },
    {
      title: "커리큘럼",
      content: [
        "1개월차: 기초 개념 정립",
        "2개월차: 심화 문제 풀이",
        "3개월차: 실전 문제 및 기출 분석"
      ]
    }
  ]
};

export default function LessonDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const lesson = lessonDetail;

  if (!lesson) {
    return <div>Loading...</div>;
  }

  const progressPercentage = Math.floor((lesson.currentStudents / lesson.maxStudents) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-[1280px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-black">{lesson.title}</h1>
          <p className="text-gray-800 text-lg">{lesson.subTitle}</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <p className="font-medium text-lg text-black">{lesson.teacher.name} 선생님</p>
              <p className="text-gray-800">{lesson.teacher.university} 졸업</p>
              <p className="text-gray-800">수업 경력 {lesson.teacher.experience}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-medium text-gray-700 mb-2 text-base">교육 대상</h3>
              <p className="text-lg text-black">{lesson.targetGrade}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2 text-base">과목</h3>
              <p className="text-lg text-black">{lesson.subject}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2 text-base">수업 정원</h3>
              <div className="flex items-center gap-2">
                <p className="text-lg text-black">{lesson.minStudents}~{lesson.maxStudents}명</p>
                <span className="text-lg">👤</span>
                <span className="text-[#1B9AF5] text-base ml-1">
                  현재 {lesson.currentStudents}/{lesson.maxStudents}명
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2 text-base">수업 기간</h3>
              <p className="text-lg text-black">{lesson.period}</p>
            </div>
          </div>

          {lesson.description.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-medium mb-4 text-black">{section.title}</h2>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-800 text-lg flex items-center gap-2">
                    <span className="text-[#1B9AF5]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4 text-black">수업 장소</h2>
            <p className="text-gray-800 text-lg">{lesson.location}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-700 mb-2">월 수업료</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-black">{lesson.price.toLocaleString()}원</span>
                  {lesson.discount && (
                    <>
                      <span className="text-gray-500 line-through text-lg">{lesson.originalPrice.toLocaleString()}원</span>
                      <span className="text-[#1B9AF5] font-medium">{lesson.discount}% 할인</span>
                    </>
                  )}
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#1B9AF5] h-2 rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">현재 {progressPercentage}% 달성</p>
                </div>
              </div>
              <button 
                className="bg-[#1B9AF5] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#1B9AF5]/90 transition-colors"
                onClick={() => alert('신청이 완료되었습니다!')}
              >
                수업 참여하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 