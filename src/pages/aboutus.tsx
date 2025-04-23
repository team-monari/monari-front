import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../utils/motion';

interface Testimonial {
  role: string;
  quote: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    role: "학생 후기",
    quote: "모나리를 통해 합리적인 가격으로 훌륭한 선생님을 만나게 되었습니다. 학습 효과도 뛰어나고 가격도 부담 없어서 정말 만족합니다.",
    author: "김학생 (고등학교 2학년)"
  },
  {
    role: "선생님 후기",
    quote: "모나리의 투명한 가격 정책과 효율적인 매칭 시스템 덕분에 안정적인 수업을 진행할 수 있습니다.",
    author: "이선생님 (수학 과외)"
  },
  {
    role: "학생 후기",
    quote: "그룹 스터디를 통해 비용을 절약하면서도 효과적인 학습을 할 수 있어서 좋았습니다.",
    author: "박학생 (중학교 3학년)"
  },
  {
    role: "선생님 후기",
    quote: "학생들의 성적 향상이 눈에 보일 때 정말 뿌듯합니다. 모나리의 시스템이 이런 성과를 가능하게 해줍니다.",
    author: "최선생님 (영어 과외)"
  },
  {
    role: "학생 후기",
    quote: "유연한 스케줄 조정이 가능해서 학원과 병행하기에도 좋았습니다.",
    author: "정학생 (고등학교 1학년)"
  },
  {
    role: "선생님 후기",
    quote: "학생들의 피드백을 통해 수업을 개선할 수 있어서 좋습니다.",
    author: "김선생님 (과학 과외)"
  },
  {
    role: "학생 후기",
    quote: "개인 맞춤형 학습이 가능해서 정말 효과적이었습니다. 선생님과의 소통이 원활해서 학습 방향을 정하는데 큰 도움이 되었어요.",
    author: "이학생 (고등학교 3학년)"
  },
  {
    role: "선생님 후기",
    quote: "수업료가 투명하고 공정해서 좋습니다. 학생과 학부모님들도 만족해하시네요.",
    author: "박선생님 (국어 과외)"
  }
];

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Head>
        <title>모나리 - 1:1 맞춤 과외/스터디 매칭 서비스</title>
        <meta
          name="description"
          content="나에게 딱 맞는 과외 선생님과 스터디 그룹을 찾아보세요."
        />
      </Head>

      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] via-[#1B9AF5]/90 to-[#1B9AF5] leading-tight">
                합리적인 가격으로
                <br />
                최고의 교육을 받으세요
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                시장 최저가로 제공되는
                <br />
                고품질 과외 및 스터디 서비스
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Link
                  href="/lessons"
                  className="bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/90 text-white px-10 py-5 rounded-2xl font-medium hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base shadow-lg shadow-[#1B9AF5]/20"
                >
                  과외 찾기
                </Link>
                <Link
                  href="/studies"
                  className="bg-white text-[#1B9AF5] px-10 py-5 rounded-2xl font-medium border-2 border-[#1B9AF5] hover:bg-[#1B9AF5]/10 transition-all duration-300 transform hover:-translate-y-1 text-base shadow-lg shadow-gray-200"
                >
                  스터디 찾기
                </Link>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1B9AF5]/20 to-[#1B9AF5]/5 rounded-3xl transform rotate-6" />
              <Image
                src="/images/main/1.png"
                alt="Learning Illustration"
                width={600}
                height={400}
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: "10,000+", label: "활성 사용자" },
              { number: "5,000+", label: "등록된 선생님" },
              { number: "30%", label: "평균 수강료 절감" },
              { number: "98%", label: "만족도" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 min-h-[200px] flex flex-col justify-center items-center text-center"
              >
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/80 mb-6">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Competitive Advantages Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/80">
              타사와 비교한 모나리의 장점
            </h2>
            <p className="text-lg text-gray-600">
              다른 플랫폼과 비교했을 때 모나리가 제공하는 특별한 가치
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-3xl shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-6 text-left text-xl font-bold text-[#1B9AF5]">구분</th>
                  <th className="p-6 text-left text-xl font-bold text-[#1B9AF5]">모나리</th>
                  <th className="p-6 text-left text-xl font-bold text-[#1B9AF5]">타 플랫폼</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    category: "수업료",
                    monari: "시간당 20,000원 ~ 40,000원",
                    others: "시간당 30,000원 ~ 60,000원"
                  },
                  {
                    category: "수수료",
                    monari: "수수료 없음",
                    others: "10~20% 수수료 발생"
                  },
                  {
                    category: "스케줄",
                    monari: "자유로운 시간 조정 가능",
                    others: "고정된 시간표 운영"
                  },
                  {
                    category: "결제 방식",
                    monari: "선생님과 직접 협의",
                    others: "플랫폼 통한 강제 결제"
                  },
                  {
                    category: "환불 정책",
                    monari: "유연한 환불 가능",
                    others: "환불 제한적"
                  }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-6 text-lg font-medium text-gray-700">{row.category}</td>
                    <td className="p-6 text-lg text-gray-600">{row.monari}</td>
                    <td className="p-6 text-lg text-gray-600">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Learning Process Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/80">
              학습 과정
            </h2>
            <p className="text-lg text-gray-600">
              모나리의 체계적인 학습 프로세스로 효과적인 학습을 경험하세요
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              {
                title: "1. 프로필 분석",
                description: "학생의 학습 수준과 목표를 분석하여 최적의 학습 계획을 수립합니다."
              },
              {
                title: "2. 맞춤형 매칭",
                description: "학생의 특성에 맞는 선생님과 스터디 그룹을 추천합니다."
              },
              {
                title: "3. 체계적 학습",
                description: "개인별 맞춤 학습 계획에 따라 체계적인 학습을 진행합니다."
              },
              {
                title: "4. 성과 관리",
                description: "정기적인 피드백과 성과 분석으로 학습 효과를 극대화합니다."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 min-h-[200px] flex flex-col"
              >
                <div className="text-2xl font-bold text-[#1B9AF5] mb-3">{step.title}</div>
                <p className="text-base text-gray-600 leading-relaxed flex-grow">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Pricing System Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            <motion.div variants={fadeInUp} className="p-12 bg-white rounded-3xl shadow-lg backdrop-blur-sm bg-opacity-80">
              <h3 className="text-3xl font-bold mb-8 text-[#1B9AF5]">수업료 시스템</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold mb-2">1:1 과외</h4>
                  <p className="text-lg text-gray-600">시간당 20,000원 ~ 40,000원</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">그룹 스터디</h4>
                  <p className="text-lg text-gray-600">시간당 10,000원 ~ 20,000원</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">특별 할인</h4>
                  <p className="text-lg text-gray-600">장기 수강 시 최대 20% 할인</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-12 bg-gradient-to-br from-[#1B9AF5]/5 to-white rounded-3xl shadow-lg backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-8 text-[#1B9AF5]">사교육비 절감 효과</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold mb-2">평균 절감액</h4>
                  <p className="text-lg text-gray-600">월 30만원 ~ 50만원 절감</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">연간 절감액</h4>
                  <p className="text-lg text-gray-600">연 360만원 ~ 600만원 절감</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">학습 효율성</h4>
                  <p className="text-lg text-gray-600">학습 시간 대비 성적 향상률 40% 증가</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Success Stories Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/80">
              학습 성공 사례
            </h2>
            <p className="text-lg text-gray-600">
              모나리와 함께 성장한 학생들의 실제 성공 스토리
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                student: "김○○ 학생",
                subject: "수학, 과학",
                before: "수학 4등급, 과학 3등급",
                after: "수학 1등급, 과학 1등급",
                period: "1년",
                result: "서울대 의예과 합격",
                description: "체계적인 학습 관리와 꾸준한 문제 풀이로 성적 향상",
                improvement: "수학 3등급, 과학 2등급 향상",
                studyMethod: "주 3회 1:1 맞춤 수업 + 주말 그룹 스터디",
                teacher: "이수학 선생님, 박과학 선생님"
              },
              {
                student: "이○○ 학생",
                subject: "국어, 영어",
                before: "국어 5등급, 영어 4등급",
                after: "국어 2등급, 영어 1등급",
                period: "8개월",
                result: "연세대 경영학과 합격",
                description: "기초부터 차근차근, 독해력 향상에 중점",
                improvement: "국어 3등급, 영어 3등급 향상",
                studyMethod: "주 2회 1:1 맞춤 수업 + 온라인 학습",
                teacher: "김국어 선생님, 최영어 선생님"
              },
              {
                student: "박○○ 학생",
                subject: "전과목",
                before: "평균 5등급",
                after: "평균 2등급",
                period: "1년 6개월",
                result: "고려대 컴퓨터학과 합격",
                description: "취약 과목 집중 관리로 전체적인 성적 향상",
                improvement: "평균 3등급 향상",
                studyMethod: "주 4회 1:1 맞춤 수업 + 주말 특강",
                teacher: "다과목 맞춤 선생님 팀"
              }
            ].map((success, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B9AF5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#1B9AF5] mb-2">{success.student}</h3>
                    <p className="text-lg text-gray-700">{success.subject}</p>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl transform transition-transform duration-300 group-hover:-translate-y-1">
                      <p className="text-base text-gray-600">Before</p>
                      <p className="text-lg font-medium text-gray-800">{success.before}</p>
                    </div>
                    <div className="bg-[#1B9AF5]/5 p-4 rounded-xl transform transition-transform duration-300 group-hover:-translate-y-1">
                      <p className="text-base text-[#1B9AF5]">After</p>
                      <p className="text-lg font-medium text-[#1B9AF5]">{success.after}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-base text-gray-600">학습 기간: {success.period}</p>
                      <p className="text-lg font-bold text-gray-800">{success.result}</p>
                      <p className="text-base text-gray-600">{success.description}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-base font-medium text-[#1B9AF5]">성적 향상: {success.improvement}</p>
                      <p className="text-sm text-gray-600">학습 방법: {success.studyMethod}</p>
                      <p className="text-sm text-gray-500">담당 선생님: {success.teacher}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Success Stories Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/80">
              실제 사용자 후기
            </h2>
            <p className="text-lg text-gray-600">
              모나리를 통해 만족스러운 학습 경험을 한 사용자들의 이야기
            </p>
          </motion.div>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex space-x-8"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {[...testimonials, ...testimonials].map((story, index) => (
                <motion.div
                  key={index}
                  className="min-w-[450px] p-12 bg-gradient-to-br from-[#1B9AF5]/5 to-white rounded-3xl shadow-lg min-h-[350px] flex flex-col justify-between relative overflow-hidden group"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1B9AF5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#1B9AF5]/10 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl text-[#1B9AF5]">👨‍🎓</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1B9AF5]">
                        {story.role}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-600 italic leading-relaxed mb-6">
                      "{story.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-1 h-8 bg-[#1B9AF5] rounded-full mr-4" />
                      <p className="text-base text-gray-500 font-medium">
                        - {story.author}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-40">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/80">
              자주 묻는 질문
            </h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                question: "수업료는 어떻게 결제하나요?",
                answer: "수업료는 선생님과 직접 협의하여 결정하며, 모나리 플랫폼을 통해 안전하게 결제할 수 있습니다."
              },
              {
                question: "수업 시간은 어떻게 조정할 수 있나요?",
                answer: "선생님과 학생이 직접 스케줄을 조정할 수 있으며, 유연한 시간 조정이 가능합니다."
              },
              {
                question: "환불 정책은 어떻게 되나요?",
                answer: "수업 시작 전에는 전액 환불이 가능하며, 수업 시작 후에는 진행된 수업 시간에 따라 환불이 가능합니다."
              },
              {
                question: "선생님 변경이 가능한가요?",
                answer: "수업 진행 중에도 선생님 변경이 가능하며, 새로운 선생님과의 매칭을 지원합니다."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-opacity-80"
              >
                <h3 className="text-xl font-bold mb-4 text-[#1B9AF5]">{faq.question}</h3>
                <p className="text-lg text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/80">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                합리적인 가격으로 최고의 교육을 경험해보세요
              </p>
              <Link
                href="/"
                className="bg-gradient-to-r from-[#1B9AF5] to-[#1B9AF5]/90 text-white px-14 py-6 rounded-2xl font-medium hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-block text-lg shadow-lg shadow-[#1B9AF5]/20"
              >
                서비스 이용하기
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default AboutUsPage; 