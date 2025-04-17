import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
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
  logout: () => void;
  getAccessToken: () => string | null;
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

  // 앱 초기화 시 로컬 스토리지에서 인증 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUserType = localStorage.getItem("userType");
    const storedUser = localStorage.getItem("user");

    if (token || storedAccessToken) {
      // token 또는 accessToken이 있으면 인증된 상태로 간주
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
    }
  }, []);

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

  const logout = () => {
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
    Swal.fire({
      icon: "info",
      title: "로그아웃 완료",
      text: `${
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
  };

  // accessToken을 가져오는 메서드
  const getAccessToken = () => {
    return accessToken;
  };

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
