import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";

const EditStudentProfile = () => {
  const router = useRouter();

  // 기존 사용자 정보 (실제로는 API나 Context에서 가져와야 함)
  const [formData, setFormData] = useState({
    name: "김민수",
    phone: "010-0000-0000",
    school: "",
    grade: "",
    city: "",
    district: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 입력 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else if (
      !/^\d{3}-\d{4}-\d{4}$/.test(formData.phone) &&
      !/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "올바른 연락처 형식으로 입력해주세요 (예: 010-0000-0000)";
    }

    if (!formData.school.trim()) {
      newErrors.school = "학교를 입력해주세요";
    }

    if (!formData.grade) {
      newErrors.grade = "학년을 선택해주세요";
    }

    if (!formData.city) {
      newErrors.city = "시/도를 선택해주세요";
    }

    if (!formData.district) {
      newErrors.district = "구/군을 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // 프로필 업데이트 API 호출 (실제로는 API 연동 필요)
      console.log("프로필 업데이트:", formData);

      // 성공 시 마이페이지로 이동
      router.push("/mypage");
    }
  };

  // 취소 처리
  const handleCancel = () => {
    router.push("/mypage");
  };

  // 시/도 목록
  const cities = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ];

  // 학년 목록
  const grades = [
    "초등학교 1학년",
    "초등학교 2학년",
    "초등학교 3학년",
    "초등학교 4학년",
    "초등학교 5학년",
    "초등학교 6학년",
    "중학교 1학년",
    "중학교 2학년",
    "중학교 3학년",
    "고등학교 1학년",
    "고등학교 2학년",
    "고등학교 3학년",
  ];

  // 서울특별시 구 목록 (다른 시/도 선택 시 해당하는 구/군 목록으로 변경해야 함)
  const districts = [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ];

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
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                연락처
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="school"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                학교
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="학교명을 입력하세요"
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.school ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.school && (
                <p className="mt-1 text-sm text-red-500">{errors.school}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                학년
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.grade ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">학년을 선택하세요</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-500">{errors.grade}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지역
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">시/도 선택</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
                <div>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">구/군 선택</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.district}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
