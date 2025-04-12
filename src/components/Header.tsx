import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LoginModal from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, userType, logout } = useAuth();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
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
            <Link
              href="/lessons/create"
              className={`text-base ${
                router.pathname === "/lessons/create"
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              수업 개설
            </Link>
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
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="text-base text-gray-600 hover:text-[#1B9AF5]"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            className="text-base text-gray-600 hover:text-[#1B9AF5]"
            onClick={openLoginModal}
          >
            로그인
          </button>
        )}
      </div>

      {/* 로그인 모달 */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
};

export default Header;
