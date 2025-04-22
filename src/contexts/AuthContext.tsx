import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import Swal from "sweetalert2";

interface User {
  id?: string;
  email?: string;
  name?: string;
  userType?: string;
  [key: string]: any; // 다른 프로퍼티를 위한 인덱스 시그니처
}

// OauthLoginResponse에 맞게 구조 정의
interface AuthData {
  token?: string;
  accessToken?: string;
  userType?: string;
  user?: User;
  [key: string]: any; // 다른 프로퍼티를 위한 인덱스 시그니처
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userType: string | null;
  accessToken: string | null;
  login: (data: AuthData) => void;
  logout: (showNotification?: boolean, expiredToken?: boolean) => void;
  getAccessToken: () => string | null;
  checkTokenValidity: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    // 초기 상태 설정 시 localStorage에서 accessToken 가져오기
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  });
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  // 로그아웃 함수를 useCallback으로 감싸서 의존성 문제 해결
  const logout = useCallback(
    (showNotification = true, expiredToken = false) => {
      // 로그아웃 전에 현재 userType 정보 저장
      const currentUserType = userType;

      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setAccessToken(null);
      setUser(null);
      setUserType(null);

      // 로그아웃 알림 표시 - 중앙 상단에 작은 토스트 형태로 표시
      if (showNotification) {
        Swal.fire({
          icon: expiredToken ? "info" : "info",
          title: expiredToken ? "로그인 세션 만료" : "로그아웃 완료",
          text: expiredToken
            ? "로그인 세션이 만료되었습니다. 다시 로그인해주세요."
            : `${
                currentUserType === "STUDENT" ? "학생" : "선생님"
              } 계정에서 로그아웃 되었습니다`,
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          width: "auto",
          padding: "0.5em",
          customClass: {
            container: "z-50",
            popup: "p-2",
            title: "text-sm font-medium",
            htmlContainer: "text-xs",
          },
        });
      }
    },
    [userType]
  );

  // 토큰 유효성 검사 함수
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      // 실제 서비스에 맞는 API 엔드포인트 사용
      const endpoint = "/api/v1/auth/me";

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // 응답이 성공적이면 토큰이 유효한 것으로 간주
        return true;
      } else {
        // 응답이 400 Bad Request일 경우 에러 내용 확인
        const errorData = await response.json();
        // AUTH4001 코드가 있으면 토큰이 만료된 것으로 판단
        if (errorData.code === "AUTH4001") {
          console.warn("토큰이 만료되었습니다:", errorData.message);
          return false;
        }
        // 401 Unauthorized는 토큰이 유효하지 않음을 의미
        if (response.status === 401) {
          console.warn("토큰이 유효하지 않습니다.");
          return false;
        }
        // 다른 오류인 경우 (네트워크 문제 등)는 토큰 검증 실패로 직접 판단하지 않음
        return true; // 다른 오류는 토큰 유효성과 직접적인 관련이 없을 수 있음
      }
    } catch (error) {
      console.error("토큰 검증 중 오류 발생:", error);
      // 네트워크 오류의 경우 토큰 검증에 실패했다고 직접적으로 판단하지 않음
      // 인터넷 연결 문제일 수 있으므로 기존 인증 상태 유지
      return true;
    }
  };

  // 토큰 유효성 확인 함수 (외부에서 호출 가능)
  const checkTokenValidity = async (): Promise<boolean> => {
    if (!accessToken) return false;
    const isValid = await validateToken(accessToken);
    if (!isValid) {
      // 토큰이 유효하지 않으면 로그아웃 처리
      logout(true, true);
    }
    return isValid;
  };

  // 앱 초기화 시 로컬 스토리지에서 인증 정보 불러오기
  useEffect(() => {
    const loadAuthData = async () => {
      const token = localStorage.getItem("token");
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedUserType = localStorage.getItem("userType");
      const storedUser = localStorage.getItem("user");

      if (!storedAccessToken) {
        // 저장된 토큰이 없으면 인증되지 않은 상태로 설정
        setIsTokenValidated(true);
        return;
      }

      // 토큰 유효성 검사
      const isValid = await validateToken(storedAccessToken);

      if (!isValid) {
        // 토큰이 유효하지 않으면 로그아웃 처리
        console.log("저장된 토큰이 유효하지 않아 로그아웃합니다.");
        logout(true, true);
        setIsTokenValidated(true);
        return;
      }

      // 토큰이 유효하면 인증 상태 설정
      setIsAuthenticated(true);
      if (storedAccessToken) setAccessToken(storedAccessToken);
      if (storedUserType) setUserType(storedUserType);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("사용자 정보 파싱 오류:", e);
        }
      } else {
        // 기본 사용자 객체 생성 (최소한의 정보)
        setUser({
          userType: storedUserType || undefined,
        });
      }

      setIsTokenValidated(true);
    };

    loadAuthData();
  }, []);

  // 주기적으로 토큰 유효성 검사 (5분마다)
  useEffect(() => {
    // 토큰이 없으면 검사하지 않음
    if (!accessToken) return;

    const tokenCheckInterval = setInterval(async () => {
      console.log("토큰 유효성 주기적 검사 실행");
      const isValid = await validateToken(accessToken);
      if (!isValid) {
        console.log("토큰이 만료되어 로그아웃합니다.");
        logout(true, true);
      }
    }, 5 * 60 * 1000); // 5분마다 체크

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [accessToken, logout]);

  // accessToken이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  const login = (data: AuthData) => {
    console.log("로그인 요청 데이터:", data);

    // 인증 상태 설정
    setIsAuthenticated(true);

    // 토큰 저장 (있는 경우에만)
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // accessToken 저장 (OauthLoginResponse의 주요 필드)
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
    }

    // userType 저장 (OauthLoginResponse의 주요 필드)
    if (data.userType) {
      localStorage.setItem("userType", data.userType);
      setUserType(data.userType);
    }

    // 사용자 정보 관리 (소셜 로그인에서는 명시적인 user 객체가 없을 수 있음)
    let userData: User = {
      userType: data.userType || undefined,
    };

    if (data.user) {
      userData = { ...userData, ...data.user };
    }

    // 사용자 정보 저장
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    console.log("로그인 정보가 저장되었습니다:", {
      isAuthenticated: true,
      accessToken: data.accessToken,
      userType: data.userType,
      user: userData,
    });

    // 로그인 성공 알림은 메인 페이지에서 처리하도록 제거
  };

  // accessToken을 가져오는 메서드
  const getAccessToken = () => {
    return accessToken;
  };

  // 앱이 로딩되는 동안 스플래시 화면 또는 로딩 표시
  if (!isTokenValidated) {
    return null; // 또는 로딩 컴포넌트 반환
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userType,
        accessToken,
        login,
        logout,
        getAccessToken,
        checkTokenValidity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
