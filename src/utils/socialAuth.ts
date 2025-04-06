// 카카오 소셜 로그인 관련 유틸리티 함수

/**
 * 카카오 로그인 인증 URL을 생성하는 함수
 * @param role 사용자 역할 (student 또는 teacher)
 * @returns 카카오 인증 URL
 */
export const getKakaoAuthUrl = (role: "student" | "teacher"): string => {
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  // 프론트엔드 콜백 URL
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/auth/kakao/callback`;

  // 콜백으로 전달할 state에 역할 정보 포함 (소문자로 전달)
  const STATE = encodeURIComponent(JSON.stringify({ role }));

  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&state=${STATE}`;
};
