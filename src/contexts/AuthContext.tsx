import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  email?: string;
  name?: string;
  userType?: string;
  [key: string]: any; // 다른 프로퍼티를 위한 인덱스 시그니처
}

interface AuthData {
  token: string;
  user?: User;
  userType?: string;
  [key: string]: any; // 다른 프로퍼티를 위한 인덱스 시그니처
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userType: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  // 앱 초기화 시 로컬 스토리지에서 인증 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");
    const storedUser = localStorage.getItem("user");

    if (token) {
      setIsAuthenticated(true);
      if (storedUserType) setUserType(storedUserType);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("사용자 정보 파싱 오류:", e);
        }
      }
    }
  }, []);

  const login = (data: AuthData) => {
    // 토큰 저장
    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
    }

    // 사용자 유형 저장
    if (data.userType) {
      localStorage.setItem("userType", data.userType);
      setUserType(data.userType);
    } else if (data.user?.userType) {
      localStorage.setItem("userType", data.user.userType);
      setUserType(data.user.userType);
    }

    // 사용자 정보 저장
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }

    console.log("로그인 정보가 저장되었습니다:", {
      isAuthenticated: true,
      userType: data.userType || data.user?.userType,
      user: data.user,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, userType, login, logout }}
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
