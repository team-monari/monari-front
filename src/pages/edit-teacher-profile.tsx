import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

// 선생님 프로필 인터페이스
interface TeacherProfile {
  publicID: string;
  email: string;
  name: string;
  university: string;
  major: string;
  career: string;
  profileImageUrl: string | null;
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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 프로필 이미지 미리보기용 상태
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

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
        });

        // 프로필 이미지가 있으면 미리보기 설정
        if (data.profileImageUrl) {
          setProfileImagePreview(data.profileImageUrl);
        }
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

  // 프로필 이미지 변경 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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

    // 프로필 이미지 URL 유효성 검사 (선택사항이므로 값이 있는 경우만 검사)
    if (formData.profileImageUrl && formData.profileImageUrl.length > 500) {
      newErrors.profileImageUrl = "이미지 URL은 500자 이내로 입력해주세요";
    }

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
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
        }

        // 성공 메시지 표시
        setSaveSuccess(true);

        // 3초 후 마이페이지로 이동
        setTimeout(() => {
          router.push("/teacher-mypage");
        }, 3000);
      } catch (err) {
        console.error("프로필 업데이트 실패:", err);
        setSaveError(
          "프로필 정보 업데이트 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
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
        <title>프로필 수정 | 모나리</title>
        <meta name="description" content="모나리 선생님 프로필 수정" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-8 text-center">
          선생님 프로필 수정
        </h1>

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            프로필이 성공적으로 업데이트되었습니다. 마이페이지로 이동합니다...
          </div>
        )}

        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {saveError}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form onSubmit={handleSubmit}>
            {/* 프로필 이미지 섹션 */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profileImagePreview ? (
                    <Image
                      src={profileImagePreview}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover"
                      width={128}
                      height={128}
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-500 text-4xl font-bold">
                      <span>?</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
                    <label htmlFor="profileImage" className="cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                프로필 이미지 (선택사항)
              </p>
              {errors.profileImageUrl && (
                <p className="text-sm text-red-500">{errors.profileImageUrl}</p>
              )}
            </div>

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
