import axios from "axios";
import { Lesson, LessonFilters, PaginatedResponse } from "../types/lesson";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const accessToken = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 에러가 발생해도 자동으로 로그아웃하지 않고 오류만 반환
    // 필요한 경우 호출하는 컴포넌트에서 직접 처리하도록 함
    console.error("API 요청 에러:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const lessonApi = {
  // 수업 목록 조회
  getLessons: async (
    filters: LessonFilters
  ): Promise<PaginatedResponse<Lesson>> => {
    const response = await api.get("/lessons", { params: filters });
    return response.data;
  },

  // 수업 상세 조회
  getLessonById: async (id: number): Promise<Lesson> => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  // 수업 등록
  createLesson: async (lessonData: Partial<Lesson>): Promise<Lesson> => {
    const response = await api.post("/lessons", lessonData);
    return response.data;
  },

  // 수업 수정
  updateLesson: async (
    id: number,
    lessonData: Partial<Lesson>
  ): Promise<Lesson> => {
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data;
  },

  // 수업 삭제
  deleteLesson: async (id: number): Promise<void> => {
    await api.delete(`/lessons/${id}`);
  },

  // 수업 신청
  applyForLesson: async (lessonId: number): Promise<void> => {
    await api.post(`/lessons/${lessonId}/apply`);
  },
};

export const authApi = {
  // 로그인
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  },

  // 회원가입
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
  },

  // 소셜 로그인 인가코드를 백엔드로 전송
  socialLogin: async (data: {
    code: string;
    socialProvider: "KAKAO" | "GOOGLE";
    userType: "STUDENT" | "TEACHER";
  }) => {
    console.log("소셜 로그인 요청 데이터:", data);
    try {
      const response = await api.post("/api/v1/auth/oauth", data);
      console.log("소셜 로그인 응답 데이터:", response.data);

      // OauthLoginResponse(String accessToken, UserType userType) 형태의 응답 처리
      if (response.data) {
        // accessToken 저장
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        }

        // userType 저장
        if (response.data.userType) {
          localStorage.setItem("userType", response.data.userType);
        }
      }

      return response.data;
    } catch (error) {
      console.error("소셜 로그인 API 호출 오류:", error);
      throw error;
    }
  },
};

export default api;
