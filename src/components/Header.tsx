import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LoginModal from "./LoginModal";

type UserRole = "student" | "teacher" | null;

const Header = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // 임시로 로그인 상태를 관리하는 상태 (실제로는 전역 상태나 컨텍스트로 관리해야 함)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // 임시 로그인 처리 함수 (테스트용)
  const handleTestLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setIsLoginModalOpen(false);
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // 역할에 따른 마이페이지 경로 결정
  const getMyPagePath = () => {
    return userRole === "teacher" ? "/teacher-mypage" : "/mypage";
  };

  // 프로필 편집 페이지로 이동
  const handleEditProfile = () => {
    const editProfilePath =
      userRole === "teacher"
        ? "/edit-teacher-profile"
        : "/edit-student-profile";
    router.push(editProfilePath);
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
              href="/create-study"
              className={`text-base ${
                router.pathname === "/create-study"
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              스터디 만들기
            </Link>
            <Link
              href="/create-lesson"
              className={`text-base ${
                router.pathname === "/create-lesson"
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              수업 개설
            </Link>
          </nav>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link
              href={getMyPagePath()}
              className={`text-base ${
                router.pathname === getMyPagePath()
                  ? "text-[#1B9AF5]"
                  : "text-gray-600"
              } hover:text-[#1B9AF5]`}
            >
              마이페이지
            </Link>
            <button
              onClick={handleEditProfile}
              className="text-base bg-[#1B9AF5] text-white px-4 py-2 rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
            >
              프로필 편집
            </button>
            <button
              onClick={handleLogout}
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

      {/* 임시 테스트 로그인 버튼 - 실제 배포 시 제거 */}
      {isLoginModalOpen && (
        <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg z-50 flex flex-col space-y-2">
          <button
            onClick={() => handleTestLogin("student")}
            className="bg-[#1B9AF5] text-white px-3 py-1 rounded text-xs"
          >
            학생으로 로그인
          </button>
          <button
            onClick={() => handleTestLogin("teacher")}
            className="bg-[#1B9AF5] text-white px-3 py-1 rounded text-xs"
          >
            선생님으로 로그인
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
