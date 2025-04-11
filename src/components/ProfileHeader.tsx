import React from "react";
import Image from "next/image";

// 학생 유형 정의
type SchoolLevel = "MIDDLE" | "HIGH";
type Grade = "FIRST" | "SECOND" | "THIRD";

interface ProfileHeaderProps {
  name: string;
  email: string;
  profileImage?: string;
  publicId?: string;
  schoolLevel?: SchoolLevel;
  grade?: Grade;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  profileImage,
  publicId,
  schoolLevel,
  grade,
}) => {
  // 학제와 학년을 문자열로 변환하는 함수
  const getSchoolLevelText = (level?: SchoolLevel): string => {
    if (!level) return "";
    const levelMap: Record<SchoolLevel, string> = {
      MIDDLE: "중학교",
      HIGH: "고등학교",
    };
    return levelMap[level] || "";
  };

  const getGradeText = (gradeValue?: Grade): string => {
    if (!gradeValue) return "";
    const gradeMap: Record<Grade, string> = {
      FIRST: "1학년",
      SECOND: "2학년",
      THIRD: "3학년",
    };
    return gradeMap[gradeValue] || "";
  };

  // 학교 정보 문자열 생성
  const schoolInfo = `${getSchoolLevelText(schoolLevel)} ${getGradeText(
    grade
  )}`.trim();

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center">
        {/* 프로필 이미지 */}
        <div className="relative mb-4 md:mb-0 md:mr-6 self-center md:self-start">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-lg flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`${name}의 프로필 이미지`}
                width={96}
                height={96}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-bold">
                <span>{name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1">
          <div className="flex flex-col justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{name}</h1>
              {schoolInfo ? (
                <p className="text-gray-600 mt-1">{schoolInfo}</p>
              ) : (
                <p className="text-gray-400 italic text-sm mt-1">
                  학교 정보 미입력
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center mt-3 text-gray-600 text-sm">
            {email && (
              <div className="flex items-center justify-center md:justify-start mb-2 md:mb-0 md:mr-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {email}
              </div>
            )}
            {publicId && (
              <div className="flex items-center justify-center md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
                <span className="text-xs font-mono">
                  ID: {publicId.substring(0, 8)}...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
