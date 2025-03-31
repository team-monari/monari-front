import React, { useState } from "react";

interface StudentSignupFormProps {
  onSubmit: (formData: StudentFormData) => void;
  onCancel: () => void;
}

export interface StudentFormData {
  name: string;
  contact: string;
  school: string;
  region: string;
}

const StudentSignupForm: React.FC<StudentSignupFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    contact: "",
    school: "",
    region: "",
  });

  const [errors, setErrors] = useState<Partial<StudentFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
      isValid = false;
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "연락처를 입력해주세요";
      isValid = false;
    }

    if (!formData.school.trim()) {
      newErrors.school = "학교/학년을 입력해주세요";
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

  const regions = [
    "서울",
    "경기",
    "인천",
    "강원",
    "충북",
    "충남",
    "대전",
    "세종",
    "경북",
    "경남",
    "대구",
    "울산",
    "부산",
    "전북",
    "전남",
    "광주",
    "제주",
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">학생 회원가입</h2>

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
            htmlFor="school"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            학교/학년 (선택)
          </label>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            placeholder="학교명과 학년을 입력하세요"
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
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="mt-1 text-sm text-red-500">{errors.region}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          가입하기
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

export default StudentSignupForm;
