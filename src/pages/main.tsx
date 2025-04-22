import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Link from 'next/link';
import Image from 'next/image';

// Import images
import mainImage1 from '../images/main/1.png';
import mainImage2 from '../images/main/2.png';
import mainImage3 from '../images/main/3.png';
import mainImage4 from '../images/main/4.png';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>모나리 - 선생님과 학생을 연결하는 플랫폼</title>
        <meta name="description" content="모나리 - 선생님과 학생을 연결하는 플랫폼" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 pt-2 max-w-[1440px]">
        {/* 첫 번째 섹션 */}
        <section className="mb-16">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl">
              <Image
                src={mainImage1}
                alt="모여서 나누는 우리"
                priority
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* 두 번째 섹션 */}
        <section className="mb-16">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl">
              <Image
                src={mainImage2}
                alt="배움의 부담을 줄이는 곳"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* 세 번째 섹션 */}
        <section className="mb-16">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl">
              <Image
                src={mainImage3}
                alt="배우는 즐거움"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* 네 번째 섹션 */}
        <section className="mb-16">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl">
              <Image
                src={mainImage4}
                alt="서울시 공공시설"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* 서비스 바로가기 버튼 */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block bg-[#1B9AF5] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#1B9AF5]/90 transition-colors"
          >
            서비스 바로가기
          </Link>
        </div>
      </main>
    </div>
  );
} 