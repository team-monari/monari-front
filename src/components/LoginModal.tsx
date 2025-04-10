import React, { useState, useEffect } from "react";
import StudentSignupForm, { StudentFormData } from "./StudentSignupForm";
import TeacherSignupForm, { TeacherFormData } from "./TeacherSignupForm";
import { getKakaoAuthUrl } from "../utils/socialAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep =
  | "role-selection"
  | "social-login"
  | "student-signup"
  | "teacher-signup";

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | null
  >(null);
  const [currentStep, setCurrentStep] = useState<ModalStep>("role-selection");

  // ESC 키를 누르면 모달이 닫히도록 합니다
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 모달 외부 클릭 시 닫히도록 합니다
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 역할 선택 후 소셜 로그인 화면으로 이동
  const handleRoleSelect = (role: "student" | "teacher") => {
    setSelectedRole(role);
    setCurrentStep("social-login");
  };

  // 소셜 로그인 버튼 클릭 처리
  const handleSocialLogin = (provider: "kakao" | "google") => {
    // 역할이 선택되어 있지 않으면 처리하지 않음
    if (!selectedRole) return;

    if (provider === "kakao") {
      // 카카오 로그인 처리
      const kakaoAuthUrl = getKakaoAuthUrl(selectedRole);
      window.location.href = kakaoAuthUrl;
    } else if (provider === "google") {
      // 구글 로그인 처리
      const state = btoa(JSON.stringify({ role: selectedRole }));
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile&state=${state}`;
      window.location.href = googleAuthUrl;
    }
  };

  // 학생 회원가입 폼 제출 처리
  const handleStudentSignupSubmit = (formData: StudentFormData) => {
    // 실제 학생 회원가입 로직은 여기에 구현됩니다
    console.log("학생 회원가입 데이터:", formData);

    // 회원가입 성공 시 모달 닫기
    onClose();
  };

  // 선생님 회원가입 폼 제출 처리
  const handleTeacherSignupSubmit = (formData: TeacherFormData) => {
    // 실제 선생님 회원가입 로직은 여기에 구현됩니다
    console.log("선생님 회원가입 데이터:", formData);

    // 회원가입 성공 시 모달 닫기
    onClose();
  };

  // 이전 단계로 돌아가기
  const goBack = () => {
    if (currentStep === "social-login") {
      setCurrentStep("role-selection");
      setSelectedRole(null);
    } else if (
      currentStep === "student-signup" ||
      currentStep === "teacher-signup"
    ) {
      setCurrentStep("social-login");
    }
  };

  // 역할 선택 화면
  const renderRoleSelection = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">회원 유형 선택</h2>
        <p className="text-gray-600 mb-6">어떤 목적으로 이용하시나요?</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleRoleSelect("student")}
          className="w-full py-4 flex items-center justify-center bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          학생으로 이용할게요
        </button>
        <button
          onClick={() => handleRoleSelect("teacher")}
          className="w-full py-4 flex items-center justify-center bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
        >
          선생님으로 이용할게요
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>선택한 유형은 나중에 마이페이지에서 변경 가능합니다.</p>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        aria-label="Close modal"
      >
        X
      </button>
    </div>
  );

  // 소셜 로그인 화면
  const renderSocialLogin = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {selectedRole === "student" ? "학생으로 로그인" : "선생님으로 로그인"}
        </h2>
        <p className="text-gray-600 mb-6">
          간편하게 소셜 계정으로 로그인하세요
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleSocialLogin("google")}
          className="w-full py-3 flex items-center justify-center bg-white text-gray-800 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <span className="mr-2">G</span>
          구글 계정으로 로그인
        </button>

        <button
          onClick={() => handleSocialLogin("kakao")}
          className="w-full py-3 flex items-center justify-center bg-[#FEE500] text-[#3A1D1D] rounded-lg font-medium hover:bg-[#fdd835] transition-colors"
        >
          <span className="mr-2">K</span>
          카카오 계정으로 로그인
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          로그인함으로써 <span className="underline">서비스 이용약관</span>과{" "}
          <span className="underline">개인정보처리방침</span>에 동의합니다.
        </p>
      </div>

      <button
        onClick={goBack}
        className="mt-6 text-center w-full text-sm text-gray-500 hover:text-gray-700"
      >
        ← 회원 유형 다시 선택하기
      </button>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        aria-label="Close modal"
      >
        X
      </button>
    </div>
  );

  // 현재 단계에 따라 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "role-selection":
        return renderRoleSelection();
      case "social-login":
        return renderSocialLogin();
      case "student-signup":
        return (
          <StudentSignupForm
            onSubmit={handleStudentSignupSubmit}
            onCancel={goBack}
          />
        );
      case "teacher-signup":
        return (
          <TeacherSignupForm
            onSubmit={handleTeacherSignupSubmit}
            onCancel={goBack}
          />
        );
      default:
        return renderRoleSelection();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {renderCurrentStep()}
    </div>
  );
};

export default LoginModal;
