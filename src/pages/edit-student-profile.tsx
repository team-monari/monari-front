import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

// 학교 타입 정의
type SchoolType = "ELEMENTARY" | "MIDDLE" | "HIGH";

interface StudentProfileData {
  publicId?: string;
  email?: string;
  name?: string;
  schoolLevel?: "MIDDLE" | "HIGH";
  grade?: "FIRST" | "SECOND" | "THIRD";
  profileImageUrl?: string | null;
  phone?: string;
  schoolName?: string;
  city?: string;
  district?: string;
  // 폼 전용 필드
  schoolType?: SchoolType;
  selectedGrade?: string;
}

const EditStudentProfile = () => {
  const router = useRouter();
  const { accessToken, userType, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  // 기본 폼 데이터
  const [formData, setFormData] = useState<StudentProfileData>({
    name: "",
    phone: "",
    schoolName: "",
    email: "",
    publicId: "",
    schoolLevel: undefined,
    grade: undefined,
    profileImageUrl: null,
    schoolType: undefined,
    selectedGrade: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 페이지 로드 시 학생 프로필 정보 가져오기
  useEffect(() => {
    // 인증 상태 확인
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // 학생 사용자 확인
    if (userType !== "STUDENT") {
      router.push("/teacher-mypage");
      return;
    }

    // 학생 프로필 정보 가져오기
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);

        // API URL 설정
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = `${baseUrl}/api/v1/students/me`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();

        // 학교 타입과 학년 정보 변환
        const { schoolType, gradeText } = convertSchoolInfo(
          data.schoolLevel,
          data.grade
        );

        // 기존 폼 데이터와 API에서 받아온 데이터 병합
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          publicId: data.publicId || "",
          schoolLevel: data.schoolLevel,
          grade: data.grade,
          profileImageUrl: data.profileImageUrl || null,
          // 폼 표시용 필드
          schoolType,
          selectedGrade: gradeText,
          schoolName: data.schoolName || "",
        }));
      } catch (error) {
        console.error("학생 정보 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [isAuthenticated, userType, accessToken, router]);

  // 학제와 학년 정보를 폼에 맞게 변환
  const convertSchoolInfo = (
    schoolLevel?: string,
    grade?: string
  ): { schoolType: SchoolType | undefined; gradeText: string } => {
    let schoolType: SchoolType | undefined = undefined;
    let gradeText = "";

    if (!schoolLevel || !grade) {
      return { schoolType, gradeText };
    }

    if (schoolLevel === "MIDDLE") {
      schoolType = "MIDDLE";
      if (grade === "FIRST") gradeText = "1";
      else if (grade === "SECOND") gradeText = "2";
      else if (grade === "THIRD") gradeText = "3";
    } else if (schoolLevel === "HIGH") {
      schoolType = "HIGH";
      if (grade === "FIRST") gradeText = "1";
      else if (grade === "SECOND") gradeText = "2";
      else if (grade === "THIRD") gradeText = "3";
    }

    return { schoolType, gradeText };
  };

  // 입력 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "schoolType") {
      // 학교 타입이 변경되면 학년 초기화
      setFormData((prev) => ({
        ...prev,
        [name]: value as SchoolType,
        selectedGrade: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 학교 구분과 학년에 대한 유효성 검사
    if (
      !formData.schoolType ||
      !(formData.schoolType === "MIDDLE" || formData.schoolType === "HIGH")
    ) {
      newErrors.schoolType = "중학교 또는 고등학교를 선택해주세요";
    }

    if (!formData.selectedGrade) {
      newErrors.selectedGrade = "학년을 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // 학교 타입과 학년을 API 형식으로 변환
      let apiSchoolLevel: "MIDDLE" | "HIGH" | undefined = undefined;
      let apiGrade: "FIRST" | "SECOND" | "THIRD" | undefined = undefined;

      if (formData.schoolType === "MIDDLE" || formData.schoolType === "HIGH") {
        apiSchoolLevel = formData.schoolType;

        if (formData.selectedGrade) {
          const gradeMap: Record<string, "FIRST" | "SECOND" | "THIRD"> = {
            "1": "FIRST",
            "2": "SECOND",
            "3": "THIRD",
          };
          apiGrade = gradeMap[formData.selectedGrade];
        }
      }

      // 필수 필드가 없는 경우 처리
      if (!apiSchoolLevel || !apiGrade) {
        setErrors({
          ...errors,
          schoolType: !apiSchoolLevel ? "학교 구분을 선택해주세요" : "",
          selectedGrade: !apiGrade ? "학년을 선택해주세요" : "",
        });
        return;
      }

      // API 요청 데이터 준비 (API 스펙에 맞게 필수 필드만 포함)
      const apiData = {
        schoolLevel: apiSchoolLevel,
        grade: apiGrade,
        // 학교 정보가 있는 경우만 포함
        ...(formData.schoolName && { schoolName: formData.schoolName }),
      };

      try {
        setLoading(true);

        // API URL 설정
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const apiUrl = `${baseUrl}/api/v1/students/me`;

        // PATCH 요청 보내기
        const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API 요청 실패: ${response.status} - ${errorData}`);
        }

        // 성공 시 마이페이지로 이동 후 토스트 알림 표시
        router.push("/mypage").then(() => {
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
      } catch (error) {
        console.error("프로필 업데이트 오류:", error);
        // 사용자에게 오류 메시지 표시
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
        setLoading(false);
      }
    }
  };

  // 취소 처리
  const handleCancel = () => {
    router.push("/mypage");
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B9AF5] mx-auto"></div>
          <p className="mt-3 text-gray-600">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 선택된 학교 타입에 따른 학년 옵션
  const getGradeOptions = () => {
    if (!formData.schoolType) return [];

    switch (formData.schoolType) {
      case "MIDDLE":
      case "HIGH":
        return ["1", "2", "3"];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>프로필 수정 | 모나리</title>
        <meta name="description" content="모나리 학생 프로필 수정" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center">프로필 수정</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {formData.phone && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">연락처</div>
                <div>{formData.phone}</div>
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="schoolName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                학교명
              </label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName || ""}
                onChange={handleChange}
                placeholder="학교명을 입력하세요 (예: 서울고등학교)"
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.schoolName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.schoolName && (
                <p className="mt-1 text-sm text-red-500">{errors.schoolName}</p>
              )}
              {!formData.schoolName && (
                <p className="mt-1 text-sm text-gray-500">
                  학교 정보를 입력하면 맞춤형 학습 추천을 받을 수 있습니다.
                </p>
              )}
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="schoolType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  학교 구분
                </label>
                <select
                  id="schoolType"
                  name="schoolType"
                  value={formData.schoolType || ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.schoolType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">학교 구분 선택</option>
                  <option value="MIDDLE">중학교</option>
                  <option value="HIGH">고등학교</option>
                </select>
                {errors.schoolType && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.schoolType}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="selectedGrade"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  학년
                </label>
                <select
                  id="selectedGrade"
                  name="selectedGrade"
                  value={formData.selectedGrade || ""}
                  onChange={handleChange}
                  disabled={!formData.schoolType}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.selectedGrade ? "border-red-500" : "border-gray-300"
                  } ${
                    !formData.schoolType ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">학년 선택</option>
                  {getGradeOptions().map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}학년
                    </option>
                  ))}
                </select>
                {errors.selectedGrade && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.selectedGrade}
                  </p>
                )}
              </div>
            </div>
            {!formData.schoolType && (
              <p className="mt-1 text-sm text-gray-500 mb-6">
                학교 구분과 학년 정보를 선택하면 맞춤형 학습 콘텐츠를 추천받을
                수 있습니다.
              </p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditStudentProfile;
