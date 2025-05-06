import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

// 선생님 프로필 인터페이스
interface TeacherProfile {
  publicID: string;
  email: string;
  name: string;
  university: string;
  major: string;
  career: string;
  profileImageUrl: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
}

const EditTeacherProfile = () => {
  const router = useRouter();
  const { accessToken, userType, isAuthenticated } = useAuth();

  // 프로필 데이터 상태
  const [formData, setFormData] = useState({
    university: "",
    major: "",
    career: "",
    profileImageUrl: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 프로필 이미지 미리보기용 상태 제거

  // 선생님 프로필 정보 가져오기
  useEffect(() => {
    // 로그인 상태가 아니면 메인 페이지로 리다이렉트
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // 액세스 토큰이 없는 경우
    if (!accessToken) {
      setErrors({ auth: "인증 토큰이 없습니다. 다시 로그인해주세요." });
      setIsLoading(false);
      return;
    }

    // 선생님이 아니면 학생 마이페이지로 리다이렉트
    if (userType !== "TEACHER") {
      router.push("/mypage");
      return;
    }

    const fetchTeacherProfile = async () => {
      try {
        setIsLoading(true);

        // 환경 변수에서 API URL 가져오기
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = `${baseUrl}/api/v1/teachers/me`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // 폼 데이터 설정
        setFormData({
          university: data.university || "",
          major: data.major || "",
          career: data.career || "",
          profileImageUrl: data.profileImageUrl || "",
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          accountHolder: data.accountHolder || "",
        });

        // 프로필 이미지 관련 코드 제거
      } catch (err) {
        console.error("선생님 프로필 정보 가져오기 실패:", err);
        setErrors({ fetch: "프로필 정보를 불러오는 중 오류가 발생했습니다." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [isAuthenticated, userType, accessToken, router]);

  // 입력 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 프로필 이미지 변경 처리 함수 제거

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 대학교 유효성 검사 (선택사항이므로 값이 있는 경우만 검사)
    if (formData.university && formData.university.length > 100) {
      newErrors.university = "대학교 이름은 100자 이내로 입력해주세요";
    }

    // 전공 유효성 검사 (선택사항이므로 값이 있는 경우만 검사)
    if (formData.major && formData.major.length > 100) {
      newErrors.major = "전공은 100자 이내로 입력해주세요";
    }

    // 경력 유효성 검사 (선택사항이므로 값이 있는 경우만 검사)
    if (formData.career && formData.career.length > 500) {
      newErrors.career = "경력은 500자 이내로 입력해주세요";
    }

    // 프로필 이미지 URL 유효성 검사 제거

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        // 환경 변수에서 API URL 가져오기
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = `${baseUrl}/api/v1/teachers/me`;

        // 프로필 업데이트 API 호출
        const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            university: formData.university || null,
            major: formData.major || null,
            career: formData.career || null,
            profileImageUrl: formData.profileImageUrl || null,
            bankName: formData.bankName || null,
            accountNumber: formData.accountNumber || null,
            accountHolder: formData.accountHolder || null,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
        }

        // 성공 시 마이페이지로 이동 후 토스트 알림 표시
        router.push("/teacher-mypage").then(() => {
          Swal.fire({
            toast: true,
            position: "top",
            icon: "success",
            title: "프로필이 성공적으로 수정되었습니다",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: "#F8F9FA",
            iconColor: "#1B9AF5",
          });
        });
      } catch (err) {
        console.error("프로필 업데이트 실패:", err);
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "프로필 업데이트에 실패했습니다",
          showConfirmButton: false,
          timer: 3000,
          background: "#F8F9FA",
          iconColor: "#E74C3C",
        });
        setIsSaving(false);
      }
    }
  };

  // 취소 처리
  const handleCancel = () => {
    router.push("/teacher-mypage");
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B9AF5] mx-auto"></div>
          <p className="mt-3 text-gray-600">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>프로필 수정 - 모나리</title>
        <meta name="description" content="모나리 선생님 프로필 수정" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-8 text-center">
          선생님 프로필 수정
        </h1>

        {/* 성공 및 오류 메시지 UI 제거 - Sweet Alert로 대체 */}

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form onSubmit={handleSubmit}>
            {/* 프로필 이미지 섹션 제거 */}

            {/* 프로필 정보 섹션 */}
            <div className="space-y-6">
              {/* 대학교 */}
              <div>
                <label
                  htmlFor="university"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  출신 대학교
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 서울대학교"
                />
                {errors.university && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.university}
                  </p>
                )}
              </div>

              {/* 전공 */}
              <div>
                <label
                  htmlFor="major"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  전공
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 컴퓨터공학과"
                />
                {errors.major && (
                  <p className="mt-1 text-sm text-red-500">{errors.major}</p>
                )}
              </div>

              {/* 경력 */}
              <div>
                <label
                  htmlFor="career"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  경력
                </label>
                <textarea
                  id="career"
                  name="career"
                  value={formData.career}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 5년 경력, 대치동 학원 출신"
                ></textarea>
                {errors.career && (
                  <p className="mt-1 text-sm text-red-500">{errors.career}</p>
                )}
              </div>
            </div>

            {/* 계좌 정보 섹션 */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    은행명
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 국민은행"
                  />
                  {errors.bankName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bankName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    계좌번호
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 1234567890"
                  />
                  {errors.accountNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="accountHolder"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    예금주
                  </label>
                  <input
                    type="text"
                    id="accountHolder"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 홍길동"
                  />
                  {errors.accountHolder && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.accountHolder}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 버튼 섹션 */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-6 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors ${
                  isSaving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    저장 중...
                  </span>
                ) : (
                  "저장"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditTeacherProfile;
