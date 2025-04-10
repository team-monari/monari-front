import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const GoogleCallback = () => {
  const router = useRouter();
  const { code, state } = router.query;
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (!code || !state) return;

      try {
        // state 파라미터 디코딩
        const decodedState = JSON.parse(atob(state as string));
        const userType =
          decodedState.role === "student" ? "STUDENT" : "TEACHER";

        console.log("Received authorization code:", code);
        console.log("Decoded state:", decodedState);
        console.log("User type:", userType);

        // 백엔드에 소셜 로그인 요청
        const response = await authApi.socialLogin({
          code: code as string,
          socialProvider: "GOOGLE",
          userType,
        });

        console.log("Backend response:", response);

        // 로그인 성공 처리
        login(response.data);
        router.push("/");
      } catch (err) {
        console.error("Google login error:", err);
        if (err instanceof Error) {
          if (err.message.includes("Network Error")) {
            setError(
              "서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요."
            );
          } else {
            setError("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        } else {
          setError("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    };

    handleGoogleCallback();
  }, [code, state, router, login]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">오류 발생</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              로그인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">로그인 처리 중...</h2>
          <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
