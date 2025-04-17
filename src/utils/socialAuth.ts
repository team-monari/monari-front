// 카카오 소셜 로그인 관련 유틸리티 함수

/**
 * 카카오 로그인 인증 URL을 생성하는 함수
 * @param role 사용자 역할 (student 또는 teacher)
 * @returns 카카오 인증 URL
 */
export const getKakaoAuthUrl = (role: "student" | "teacher"): string => {
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  // 프론트엔드 콜백 URL
  const REDIRECT_URI =
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
    "http://localhost:3000/auth/kakao/callback";

  // 콜백으로 전달할 state에 역할 정보 포함 (소문자로 전달)
  const STATE = encodeURIComponent(JSON.stringify({ role }));

  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&state=${STATE}`;
};

/**
 * 구글 로그인 인증 URL을 생성하는 함수
 * @param role 사용자 역할 (student 또는 teacher)
 * @returns 구글 인증 URL
 */
export const getGoogleAuthUrl = (role: "student" | "teacher"): string => {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // 프론트엔드 콜백 URL
  const REDIRECT_URI =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/auth/google/callback";

  // 역할 정보를 포함한 JSON 문자열 생성
  const stateObj = JSON.stringify({ role });

  // Base64 인코딩 (URL 안전한 형식으로)
  // btoa() 함수는 일부 특수 문자에서 문제가 발생할 수 있으므로 encodeURIComponent로 먼저 인코딩
  const STATE = btoa(encodeURIComponent(stateObj));

  console.log("Google Auth URL 생성:");
  console.log("- Client ID:", GOOGLE_CLIENT_ID);
  console.log("- Redirect URI:", REDIRECT_URI);
  console.log("- State 원본:", stateObj);
  console.log("- State 인코딩:", STATE);

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=email profile&state=${STATE}`;
};
