import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LoginModal from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedLoginRole, setSelectedLoginRole] = useState<
    "student" | "teacher" | undefined
  >(undefined);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const { isAuthenticated, userType, logout } = useAuth();

  const showNotification = (message: string, type: "error" | "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openLoginModal = (role?: "student" | "teacher") => {
    setSelectedLoginRole(role);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setSelectedLoginRole(undefined);
  };

  // 역할에 따른 마이페이지 경로 결정
  const getMyPagePath = () => {
    return userType === "TEACHER" ? "/teacher-mypage" : "/mypage";
  };

  // 프로필 편집 페이지로 이동
  const handleEditProfile = () => {
    const editProfilePath =
      userType === "TEACHER"
        ? "/edit-teacher-profile"
        : "/edit-student-profile";
    router.push(editProfilePath);
  };

  // 현재 페이지가 마이페이지인지 확인
  const isMyPage = () => {
    const myPagePath = getMyPagePath();
    return (
      router.pathname === myPagePath ||
      router.pathname.startsWith(`${myPagePath}/`)
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleCreateLesson = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else if (userType === "STUDENT") {
      showNotification("학생은 수업을 개설할 수 없습니다.", "error");
    } else {
      router.push("/lessons/create");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-[#1B9AF5]">
            모나리
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/lessons"
              className={`text-base ${
                router.pathname === "/lessons"
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              수업 찾기
            </Link>
            <Link
              href="/studies"
              className={`text-base ${
                router.pathname === "/studies"
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              스터디 찾기
            </Link>
            <Link
              href="/create-study"
              className={`text-base ${
                router.pathname === "/create-study"
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              스터디 개설
            </Link>
            <button
              onClick={handleCreateLesson}
              className={`text-base ${
                router.pathname === "/lessons/create"
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              수업 개설
            </button>
          </nav>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link
              href={getMyPagePath()}
              className={`text-base ${
                isMyPage() ? "text-[#1B9AF5]" : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              마이페이지
            </Link>
            {isMyPage() && (
              <button
                onClick={handleEditProfile}
                className="text-base bg-[#1B9AF5] text-white px-4 py-2 rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
              >
                프로필 편집
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-base text-gray-600 hover:text-[#1B9AF5]"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              className="text-base text-gray-600 hover:text-[#1B9AF5]"
              onClick={() => openLoginModal("student")}
            >
              로그인/회원가입
            </button>
            <button
              className="text-base bg-[#1B9AF5] text-white px-4 py-2 rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
              onClick={() => openLoginModal("teacher")}
            >
              선생님으로 로그인
            </button>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-4 rounded-xl shadow-xl transition-all duration-300 transform ${
            notification.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === "error" ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span className="font-medium text-lg">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        initialRole={selectedLoginRole}
      />
    </header>
  );
};

export default Header;
