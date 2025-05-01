import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // 배포 환경에 따라 도메인 설정
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://monari.co.kr";
  // GitHub 이미지 URL
  const imageUrl =
    "https://github.com/team-monari/monari-front/blob/main/public/images/main/1.png?raw=true";

  return (
    <Html lang="ko">
      <Head>
        {/* OG 태그 */}
        <meta property="og:title" content="공부의 문턱을 낮추다, 모나리" />
        <meta
          property="og:description"
          content="배움에 필요한 모든 것을 합리적인 가격으로 완성하세요"
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={domain} />
        <meta property="og:type" content="website" />

        {/* 추가 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="공부의 문턱을 낮추다, 모나리" />
        <meta
          name="twitter:description"
          content="배움에 필요한 모든 것을 합리적인 가격으로 완성하세요"
        />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
