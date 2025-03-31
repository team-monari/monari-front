import React, { useState } from "react";

interface TeacherSignupFormProps {
  onSubmit: (formData: TeacherFormData) => void;
  onCancel: () => void;
}

export interface TeacherFormData {
  name: string;
  contact: string;
  education: string;
  experience: string;
  region: string;
}

const TeacherSignupForm: React.FC<TeacherSignupFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    contact: "",
    education: "",
    experience: "",
    region: "",
  });

  const [errors, setErrors] = useState<Partial<TeacherFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name as keyof TeacherFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<TeacherFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
      isValid = false;
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "연락처를 입력해주세요";
      isValid = false;
    }

    if (!formData.education.trim()) {
      newErrors.education = "대학/전공을 입력해주세요";
      isValid = false;
    }

    if (!formData.region) {
      newErrors.region = "지역을 선택해주세요";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  // 서울 내 25개 구
  const seoulDistricts = [
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
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">선생님 회원가입</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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

        <div className="mb-4">
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            연락처
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="연락처를 입력하세요"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.contact ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contact && (
            <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="education"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            대학/전공
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="예: 서울대학교 수학교육과"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.education ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.education && (
            <p className="mt-1 text-sm text-red-500">{errors.education}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            경력사항
          </label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="예: 3년간 내신 수학 과외"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
            rows={3}
          />
          {errors.experience && (
            <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            지역
          </label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.region ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">지역을 선택하세요</option>
            {seoulDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="mt-1 text-sm text-red-500">{errors.region}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
        >
          강사 등록하기
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-3 text-gray-600 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default TeacherSignupForm;
