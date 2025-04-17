import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { authApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

const GoogleCallback = () => {
  const router = useRouter();
  const { code, state } = router.query;
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const processedRef = useRef<string | null>(null); // 이미 처리된 코드를 저장

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // 코드나 state가 없으면 아직 처리하지 않음
      if (!code || !state) {
        console.log("코드 또는 state가 없습니다:", { code, state });
        return;
      }

      // 현재 코드가 이미 처리된 코드와 동일하면 중복 처리 방지
      if (processedRef.current === code) return;

      // 현재 코드를 처리된 코드로 기록
      processedRef.current = code as string;

      try {
        console.log("구글 콜백 처리 시작. 코드:", code);
        console.log("State 파라미터:", state);

        // state 파라미터 디코딩
        try {
          // Base64 디코딩 및 URI 디코딩 적용
          const decodedStateText = decodeURIComponent(atob(state as string));
          const decodedState = JSON.parse(decodedStateText);
          console.log("디코딩된 state:", decodedState);

          const userType =
            decodedState.role === "student" ? "STUDENT" : "TEACHER";
          console.log("변환된 사용자 유형:", userType);

          // 백엔드 API 요청 정보 로깅
          console.log("백엔드로 소셜 로그인 요청 전송:", {
            code,
            socialProvider: "GOOGLE",
            userType,
          });

          // 백엔드에 소셜 로그인 요청
          const response = await authApi.socialLogin({
            code: code as string,
            socialProvider: "GOOGLE",
            userType,
          });

          console.log("백엔드 응답:", response);

          // OauthLoginResponse(String accessToken, UserType userType) 구조 처리
          login({
            token: "social_login_token", // JWT 토큰이 없으므로 임시 값 설정
            accessToken: response.accessToken,
            userType: response.userType || userType, // 백엔드에서 반환한 userType 사용, 없으면 요청 시 userType 사용
          });

          // 로그인 성공 플래그 및 타입 저장
          localStorage.setItem("login_success", "true");
          localStorage.setItem(
            "login_user_type",
            response.userType || userType
          );

          // 로딩 상태 해제
          setIsLoading(false);

          // 홈으로 리다이렉트 (router.events 방지를 위해 window.location 사용)
          window.location.href = "/";
        } catch (stateError) {
          console.error("State 파라미터 디코딩 오류:", stateError);
          throw new Error("유효하지 않은 state 파라미터입니다.");
        }
      } catch (err) {
        console.error("구글 로그인 처리 중 오류 발생:", err);
        setIsLoading(false);

        // SweetAlert2를 사용하여 에러 메시지 표시
        let errorMessage = "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.";

        if (err instanceof Error) {
          if (err.message.includes("Network Error")) {
            errorMessage =
              "서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
          } else if (err.message.includes("state")) {
            errorMessage =
              "인증 상태 정보가 올바르지 않습니다. 다시 로그인을 시도해주세요.";
          } else {
            errorMessage = `로그인 처리 중 오류: ${err.message}`;
          }
        }

        setError(errorMessage);

        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: errorMessage,
          confirmButtonText: "확인",
          confirmButtonColor: "#1B9AF5",
        });
      }
    };

    // 쿼리 파라미터가 로드된 경우에만 콜백 처리 실행
    if (router.isReady) {
      handleGoogleCallback();
    }
  }, [code, state, router.isReady, login]); // router.query 대신 code, state와 router.isReady 사용

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">오류 발생</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => (window.location.href = "/auth/login")}
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
