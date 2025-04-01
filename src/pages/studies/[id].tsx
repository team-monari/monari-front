import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';

// 임시 데이터
const studyDetail = {
  title: '수학 문제 풀이 스터디',
  targetGrade: '중학생',
  subject: '수학',
  studyDetails: {
    schedule: {
      title: '1. 스터디 진행 방식',
      content: [
        '매주 토요일 오후 2시 ~ 5시 (3시간)',
        '매주 지정된 범위의 수학 문제를 풀어옵니다.',
        '토요일 모임에서 어려웠던 문제들을 함께 풀이하고 토론합니다.',
        '월 1회 모의고사를 통해 실력을 점검합니다.'
      ]
    },
    fees: {
      title: '2. 비용',
      content: [
        '월 참가비: 50,000원',
        '스터디룸 대여비: 인당 10,000원/월',
        '교재비: 25,000원 (별도)'
      ]
    },
    materials: {
      title: '3. 준비물',
      content: [
        '수학 문제집 (개별 구매)',
        '필기구'
      ]
    },
    rules: {
      title: '4. 스터디 규칙',
      content: [
        '결석 시 하루 전까지 팀장에게 연락',
        '과제 미완성 시 벌금 5,000원',
        '지각 시 벌금 3,000원 (10분 초과)'
      ]
    },
    contact: {
      title: '5. 연락처',
      content: [
        '카카오톡 오픈채팅방: https://open.kakao.com/mathstudy',
        '전화: 010-1234-5678',
        '이메일: study@example.com'
      ]
    }
  },
  location: {
    title: '스터디 장소',
    name: '강남구 청년창업지원센터 스터디룸',
    address: '서울특별시 강남구 테헤란로 123',
    hours: '이용 가능 시간: 09:00 - 22:00'
  }
};

export default function StudyDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{studyDetail.title} - 모나리</title>
        <meta name="description" content="모나리 스터디 상세 페이지" />
      </Head>

      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="mb-8 relative">
              <div className="absolute top-0 right-0">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1B9AF5]/10 text-[#1B9AF5] rounded-full font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>모집중</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4">{studyDetail.title}</h1>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1B9AF5]/10 rounded-full">
                  <svg className="w-4 h-4 text-[#1B9AF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-[#1B9AF5] font-medium">{studyDetail.targetGrade}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1B9AF5]/10 rounded-full">
                  <svg className="w-4 h-4 text-[#1B9AF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span className="text-[#1B9AF5] font-medium">{studyDetail.subject}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* 스터디 진행 방식 */}
              <div>
                <h2 className="text-lg font-medium mb-3">{studyDetail.studyDetails.schedule.title}</h2>
                <ul className="space-y-2">
                  {studyDetail.studyDetails.schedule.content.map((item, index) => (
                    <li key={index} className="text-gray-600">- {item}</li>
                  ))}
                </ul>
              </div>

              {/* 비용 */}
              <div>
                <h2 className="text-lg font-medium mb-3">{studyDetail.studyDetails.fees.title}</h2>
                <ul className="space-y-2">
                  {studyDetail.studyDetails.fees.content.map((item, index) => (
                    <li key={index} className="text-gray-600">- {item}</li>
                  ))}
                </ul>
              </div>

              {/* 준비물 */}
              <div>
                <h2 className="text-lg font-medium mb-3">{studyDetail.studyDetails.materials.title}</h2>
                <ul className="space-y-2">
                  {studyDetail.studyDetails.materials.content.map((item, index) => (
                    <li key={index} className="text-gray-600">- {item}</li>
                  ))}
                </ul>
              </div>

              {/* 스터디 규칙 */}
              <div>
                <h2 className="text-lg font-medium mb-3">{studyDetail.studyDetails.rules.title}</h2>
                <ul className="space-y-2">
                  {studyDetail.studyDetails.rules.content.map((item, index) => (
                    <li key={index} className="text-gray-600">- {item}</li>
                  ))}
                </ul>
              </div>

              {/* 연락처 */}
              <div>
                <h2 className="text-lg font-medium mb-3">{studyDetail.studyDetails.contact.title}</h2>
                <ul className="space-y-2">
                  {studyDetail.studyDetails.contact.content.map((item, index) => (
                    <li key={index} className="text-gray-600">- {item}</li>
                  ))}
                </ul>
              </div>

              {/* 스터디 장소 */}
              <div>
                <h2 className="text-lg font-medium mb-3">{studyDetail.location.title}</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <svg className="w-5 h-5 text-[#1B9AF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{studyDetail.location.name}</p>
                      <p className="text-gray-600">{studyDetail.location.address}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{studyDetail.location.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 