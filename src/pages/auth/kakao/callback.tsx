import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authApi } from "../../../services/api";

export default function KakaoCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL에서 인가코드와 state 파라미터 추출
    const { code, state } = router.query;

    // 쿼리 파라미터가 아직 로드되지 않았으면 처리하지 않음
    if (!code || !state) return;

    console.log("카카오 콜백 페이지 - 인가코드 수신:", { code, state });

    const handleKakaoCallback = async () => {
      try {
        // state 파라미터에서 사용자 역할 정보 추출
        let roleInfo;
        try {
          roleInfo = JSON.parse(decodeURIComponent(state as string));
          console.log("디코딩된 역할 정보:", roleInfo);
        } catch (e) {
          console.error("상태 정보 파싱 오류:", e);
          throw new Error("유효하지 않은 상태 정보입니다.");
        }

        const { role } = roleInfo;
        // 백엔드 API 형식에 맞게 role 변환 (student -> STUDENT, teacher -> TEACHER)
        const userType = role.toUpperCase();
        console.log("변환된 사용자 유형:", userType);

        if (userType !== "STUDENT" && userType !== "TEACHER") {
          throw new Error("유효하지 않은 역할입니다.");
        }

        // 백엔드로 인가코드 전송
        console.log("백엔드로 소셜 로그인 요청 전송:", {
          code,
          provider: "KAKAO",
          userType,
        });

        const response = await authApi.socialLogin(
          code as string,
          "KAKAO",
          userType
        );

        console.log("백엔드 응답:", response);

        // 회원가입이 필요한 경우 (백엔드에서 넘겨주는 필드에 따라 조정 필요)
        if (response.needsSignup) {
          // 회원가입 페이지로 리다이렉트
          router.push({
            pathname:
              userType === "STUDENT" ? "/student-signup" : "/teacher-signup",
            query: {
              socialId: response.socialId,
              provider: "KAKAO",
              // 기본 정보가 있다면 전달
              name: response.name || "",
              email: response.email || "",
            },
          });
        } else {
          // 로그인 성공, 메인 페이지로 리다이렉트
          router.push("/");
        }
      } catch (err: any) {
        console.error("카카오 로그인 처리 중 오류 발생:", err);

        // 네트워크 연결 오류인 경우 더 명확한 메시지 표시
        if (err.message === "Network Error") {
          setError(
            "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요."
          );
        } else {
          setError(`로그인 처리 중 오류가 발생했습니다: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    handleKakaoCallback();
  }, [router, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {loading ? (
          <>
            <h1 className="text-2xl font-bold mb-4">로그인 처리 중</h1>
            <p className="text-gray-600 mb-4">잠시만 기다려 주세요...</p>
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-500">오류 발생</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </>
        ) : (
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
        )}
      </div>
    </div>
  );
}
