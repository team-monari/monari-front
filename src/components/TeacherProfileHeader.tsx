import React, { useState } from "react";
import Image from "next/image";
import ProfileImageUpload from "./ProfileImageUpload";

interface TeacherProfileHeaderProps {
  name: string;
  email: string;
  profileImageUrl: string | null;
  canEditImage?: boolean;
  onImageUpload?: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const TeacherProfileHeader: React.FC<TeacherProfileHeaderProps> = ({
  name,
  email,
  profileImageUrl,
  canEditImage = false,
  onImageUpload,
  isLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // 이미지 로드 실패 시 호출되는 핸들러
  const handleImageError = () => {
    console.error(
      "TeacherProfileHeader: 이미지 로드 실패 - URL:",
      profileImageUrl
    );
    setImageError(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          {canEditImage && onImageUpload ? (
            <ProfileImageUpload
              currentImageUrl={profileImageUrl}
              onImageUpload={onImageUpload}
              isLoading={isLoading}
            />
          ) : (
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {profileImageUrl && !imageError ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    src={profileImageUrl}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                    onError={handleImageError}
                    priority
                    unoptimized // Next.js 이미지 최적화 비활성화 (blob URL 사용 시 필요)
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          )}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-600 mt-1">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileHeader;
