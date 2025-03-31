import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Image from "next/image";

interface EducationItem {
  school: string;
  major: string;
  startYear: string;
  endYear: string;
}

interface ExperienceItem {
  company: string;
  position: string;
  startYear: string;
  endYear: string;
}

const EditTeacherProfile = () => {
  const router = useRouter();

  // 기존 사용자 정보 (실제로는 API나 Context에서 가져와야 함)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "김민수",
    job: "웹 개발 전문 강사",
    email: "minsu.kim@email.com",
    phone: "010-1234-5678",
  });

  // 학력 정보
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      school: "서울대학교",
      major: "컴퓨터공학과",
      startYear: "2018",
      endYear: "2020",
    },
  ]);

  // 경력 정보
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      company: "네이버",
      position: "웹 개발팀 시니어 개발자",
      startYear: "2020",
      endYear: "현재",
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // 학력 정보 변경 처리
  const handleEducationChange = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const newEducations = [...educations];
    newEducations[index] = {
      ...newEducations[index],
      [field]: value,
    };
    setEducations(newEducations);
  };

  // 경력 정보 변경 처리
  const handleExperienceChange = (
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    const newExperiences = [...experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value,
    };
    setExperiences(newExperiences);
  };

  // 학력 추가
  const addEducation = () => {
    setEducations([
      ...educations,
      { school: "", major: "", startYear: "", endYear: "" },
    ]);
  };

  // 경력 추가
  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: "", position: "", startYear: "", endYear: "" },
    ]);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.job.trim()) {
      newErrors.job = "직책을 입력해주세요";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식으로 입력해주세요";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else if (!/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone =
        "올바른 연락처 형식으로 입력해주세요 (예: 010-1234-5678)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 프로필 이미지 변경 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // 프로필 업데이트 API 호출 (실제로는 API 연동 필요)
      console.log("프로필 업데이트:", {
        ...formData,
        educations,
        experiences,
        profileImage,
      });

      // 성공 시 마이페이지로 이동
      router.push("/teacher-mypage");
    }
  };

  // 취소 처리
  const handleCancel = () => {
    router.push("/teacher-mypage");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>프로필 수정 | 모나리</title>
        <meta name="description" content="모나리 선생님 프로필 수정" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-8 text-center">프로필 수정</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form onSubmit={handleSubmit}>
            {/* 프로필 이미지 섹션 */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                      Image
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
            </div>

            {/* 기본 정보 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
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

              <div>
                <label
                  htmlFor="job"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  직책
                </label>
                <input
                  type="text"
                  id="job"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  placeholder="직책을 입력하세요"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.job ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.job && (
                  <p className="mt-1 text-sm text-red-500">{errors.job}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
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
            </div>

            {/* 학력 섹션 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">학력</h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <span className="mr-1">+</span> 학력 추가
                </button>
              </div>

              {educations.map((education, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        학교명
                      </label>
                      <input
                        type="text"
                        value={education.school}
                        onChange={(e) =>
                          handleEducationChange(index, "school", e.target.value)
                        }
                        placeholder="학교명을 입력하세요"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        전공
                      </label>
                      <input
                        type="text"
                        value={education.major}
                        onChange={(e) =>
                          handleEducationChange(index, "major", e.target.value)
                        }
                        placeholder="전공을 입력하세요"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        입학년도
                      </label>
                      <input
                        type="text"
                        value={education.startYear}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "startYear",
                            e.target.value
                          )
                        }
                        placeholder="YYYY"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        졸업년도
                      </label>
                      <input
                        type="text"
                        value={education.endYear}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "endYear",
                            e.target.value
                          )
                        }
                        placeholder="YYYY"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 경력 섹션 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">경력</h2>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <span className="mr-1">+</span> 경력 추가
                </button>
              </div>

              {experiences.map((experience, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        회사명
                      </label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="회사명을 입력하세요"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        직책
                      </label>
                      <input
                        type="text"
                        value={experience.position}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                        placeholder="직책을 입력하세요"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        입사년월
                      </label>
                      <input
                        type="text"
                        value={experience.startYear}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "startYear",
                            e.target.value
                          )
                        }
                        placeholder="YYYY"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        퇴사년월
                      </label>
                      <input
                        type="text"
                        value={experience.endYear}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "endYear",
                            e.target.value
                          )
                        }
                        placeholder="YYYY (또는 현재)"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 버튼 섹션 */}
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

export default EditTeacherProfile;
