import React from "react";
import Image from "next/image";

// 학생 유형 정의
type SchoolLevel = "MIDDLE" | "HIGH";
type Grade = "FIRST" | "SECOND" | "THIRD";

interface ProfileHeaderProps {
  name: string;
  email: string;
  profileImage?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  profileImage,
}) => {
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
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1">
          <div className="flex flex-col justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{name}</h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center mt-3 text-gray-600 text-sm">
            {email && (
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {email}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
