import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LoginModal from "./LoginModal";

const Header = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-blue-500">
            모나리
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/lessons"
              className={`text-sm ${
                router.pathname === "/lessons"
                  ? "text-blue-500"
                  : "text-gray-600"
              } hover:text-blue-500`}
            >
              수업 찾기
            </Link>
            <Link
              href="/create-study"
              className={`text-sm ${
                router.pathname === "/create-study"
                  ? "text-blue-500"
                  : "text-gray-600"
              } hover:text-blue-500`}
            >
              스터디 만들기
            </Link>
            <Link
              href="/create-lesson"
              className={`text-sm ${
                router.pathname === "/create-lesson"
                  ? "text-blue-500"
                  : "text-gray-600"
              } hover:text-blue-500`}
            >
              수업 개설
            </Link>
          </nav>
        </div>
        <button
          className="text-sm text-gray-600 hover:text-blue-500"
          onClick={openLoginModal}
        >
          로그인
        </button>
      </div>

      {/* 로그인 모달 */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
};

export default Header;
