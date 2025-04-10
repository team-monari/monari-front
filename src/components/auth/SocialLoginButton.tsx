import React from "react";
import { useRouter } from "next/router";

interface SocialLoginButtonProps {
  provider: "kakao" | "google";
  userType: "student" | "teacher";
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  userType,
}) => {
  const router = useRouter();

  const handleSocialLogin = () => {
    const state = btoa(JSON.stringify({ role: userType }));

    if (provider === "kakao") {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code&state=${state}`;
      window.location.href = kakaoAuthUrl;
    } else if (provider === "google") {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile&state=${state}`;
      window.location.href = googleAuthUrl;
    }
  };

  return (
    <button
      onClick={handleSocialLogin}
      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
        provider === "kakao"
          ? "bg-[#FEE500] text-black"
          : "bg-white text-gray-800 border border-gray-300"
      }`}
    >
      {provider === "kakao" ? (
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M128 36C70.562 36 24 72.713 24 118C24 147.138 44.194 172.862 74.25 187.488L66.281 219.387C65.2 224.25 70.7 228.1 74.938 225.35L114.375 199.087C118.85 199.675 123.387 200 128 200C185.438 200 232 163.287 232 118C232 72.713 185.438 36 128 36Z"
              fill="#000000"
            />
          </svg>
          <span>카카오로 시작하기</span>
        </>
      ) : (
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.73 17.56V20.34H19.25C21.21 18.5 22.56 15.63 22.56 12.25Z"
              fill="#4285F4"
            />
            <path
              d="M12 23C14.97 23 17.46 22.02 19.25 20.34L15.73 17.56C14.74 18.22 13.47 18.62 12 18.62C9.11 18.62 6.67 16.69 5.79 14.1H2.19V16.94C3.98 20.54 7.7 23 12 23Z"
              fill="#34A853"
            />
            <path
              d="M5.79 14.09C5.58 13.44 5.46 12.75 5.46 12C5.46 11.25 5.58 10.56 5.79 9.91V7.07H2.19C1.44 8.56 1 10.24 1 12C1 13.76 1.44 15.44 2.19 16.93L5.79 14.09Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.46 2.1 14.97 1 12 1C7.7 1 3.98 3.46 2.19 7.07L5.79 9.91C6.67 7.32 9.11 5.38 12 5.38Z"
              fill="#EA4335"
            />
          </svg>
          <span>구글로 시작하기</span>
        </>
      )}
    </button>
  );
};

export default SocialLoginButton;
