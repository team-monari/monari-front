import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

// API 응답 타입 정의
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

// API 요청 옵션 타입 정의
interface ApiOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
  skipTokenExpireCheck?: boolean; // 토큰 만료 체크를 스킵할지 여부
}

/**
 * API 요청을 처리하는 커스텀 훅
 * 토큰 만료 시 자동으로 로그아웃 처리 및 사용자에게 알림
 */
export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    isLoading: false,
  });
  const { accessToken, logout } = useAuth();

  // 토큰 만료 처리 중복 방지를 위한 플래그
  const isHandlingTokenExpired = useRef(false);

  // 토큰 만료 처리 함수
  const handleTokenExpired = useCallback(() => {
    if (isHandlingTokenExpired.current) return;

    isHandlingTokenExpired.current = true;
    console.log("토큰 만료 감지: 로그아웃 처리 시작");

    // 로컬 스토리지에서 인증 정보 제거
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");

    // 세션 타임아웃 처리 - 알림 표시 후 로그아웃
    setTimeout(() => {
      logout(true, true);
      isHandlingTokenExpired.current = false;
    }, 100);
  }, [logout]);

  /**
   * API 요청 실행 함수
   */
  const makeRequest = useCallback(
    async (options: ApiOptions): Promise<ApiResponse<T>> => {
      const {
        url,
        method = "GET",
        headers = {},
        body,
        requiresAuth = true,
        skipTokenExpireCheck = false,
      } = options;

      // 로딩 상태 설정
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // URL 구성
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

        // 헤더 구성
        const requestHeaders: HeadersInit = {
          "Content-Type": "application/json",
          ...headers,
        };

        // 인증이 필요한 요청이고 토큰이 있는 경우 인증 헤더 추가
        if (requiresAuth && accessToken) {
          requestHeaders["Authorization"] = `Bearer ${accessToken}`;
        }

        // 요청 옵션 구성
        const requestOptions: RequestInit = {
          method,
          headers: requestHeaders,
        };

        // 요청 바디가 있는 경우 추가
        if (body) {
          requestOptions.body =
            typeof body === "string" ? body : JSON.stringify(body);
        }

        // API 요청 실행
        const response = await fetch(apiUrl, requestOptions);

        // 응답이 성공적이지 않은 경우
        if (!response.ok) {
          let errorText;
          let errorData;

          try {
            errorData = await response.json();
            errorText = errorData.message || `요청 실패: ${response.status}`;

            // 토큰 만료 처리 (400 Bad Request, AUTH4001 코드)
            if (
              response.status === 400 &&
              errorData.code === "AUTH4001" &&
              requiresAuth &&
              !skipTokenExpireCheck
            ) {
              console.warn("인증 토큰이 만료되었습니다 (AUTH4001).");

              // 에러 메시지 설정
              const errorMessage =
                "세션이 만료되었습니다. 다시 로그인해주세요.";

              setState({
                data: null,
                error: errorMessage,
                isLoading: false,
              });

              // 토큰 만료 처리는 한 번만 실행되도록 함
              if (!isHandlingTokenExpired.current) {
                handleTokenExpired();
              }

              return {
                data: null,
                error: errorMessage,
                isLoading: false,
              };
            }
          } catch {
            errorText = `요청 실패: ${response.status}`;
          }

          // 기존 401 Unauthorized 처리 유지
          if (
            response.status === 401 &&
            requiresAuth &&
            !skipTokenExpireCheck
          ) {
            // 로그아웃 관련 요청이 아닌 경우만 토큰 만료로 간주
            if (!url.includes("/logout") && !url.includes("/signout")) {
              console.warn("인증 토큰이 만료되었습니다 (401 Unauthorized).");

              // 에러 메시지 설정
              const errorMessage =
                "세션이 만료되었습니다. 다시 로그인해주세요.";

              setState({
                data: null,
                error: errorMessage,
                isLoading: false,
              });

              // 토큰 만료 처리는 한 번만 실행되도록 함
              if (!isHandlingTokenExpired.current) {
                handleTokenExpired();
              }

              return {
                data: null,
                error: errorMessage,
                isLoading: false,
              };
            }
          }

          setState({
            data: null,
            error: errorText,
            isLoading: false,
          });

          return {
            data: null,
            error: errorText,
            isLoading: false,
          };
        }

        // 응답 데이터 파싱
        const contentType = response.headers.get("content-type");
        let data: T;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          // JSON이 아닌 응답 처리 (텍스트, 이미지 등)
          const text = await response.text();
          data = text as unknown as T;
        }

        // 성공 상태 설정
        setState({
          data,
          error: null,
          isLoading: false,
        });

        return {
          data,
          error: null,
          isLoading: false,
        };
      } catch (error) {
        // 네트워크 에러 등 예외 처리
        const errorMessage =
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.";

        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
        });

        return {
          data: null,
          error: errorMessage,
          isLoading: false,
        };
      }
    },
    [accessToken, handleTokenExpired]
  );

  // GET 요청 함수
  const get = useCallback(
    async (url: string, requiresAuth = true, headers = {}) => {
      return makeRequest({ url, method: "GET", headers, requiresAuth });
    },
    [makeRequest]
  );

  // POST 요청 함수
  const post = useCallback(
    async (url: string, body: any, requiresAuth = true, headers = {}) => {
      return makeRequest({ url, method: "POST", body, headers, requiresAuth });
    },
    [makeRequest]
  );

  // PUT 요청 함수
  const put = useCallback(
    async (url: string, body: any, requiresAuth = true, headers = {}) => {
      return makeRequest({ url, method: "PUT", body, headers, requiresAuth });
    },
    [makeRequest]
  );

  // PATCH 요청 함수
  const patch = useCallback(
    async (url: string, body: any, requiresAuth = true, headers = {}) => {
      return makeRequest({ url, method: "PATCH", body, headers, requiresAuth });
    },
    [makeRequest]
  );

  // DELETE 요청 함수
  const del = useCallback(
    async (url: string, requiresAuth = true, headers = {}) => {
      return makeRequest({ url, method: "DELETE", headers, requiresAuth });
    },
    [makeRequest]
  );

  // 현재 상태와 HTTP 메서드 함수들 반환
  return {
    ...state,
    get,
    post,
    put,
    patch,
    delete: del,
    request: makeRequest,
  };
}

export default useApi;
