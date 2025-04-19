import React from "react";
import Image from "next/image";

interface TeacherProfileHeaderProps {
  name: string;
  email: string;
  profileImageUrl: string | null;
}

const TeacherProfileHeader: React.FC<TeacherProfileHeaderProps> = ({
  name,
  email,
  profileImageUrl,
}) => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
                alt="프로필 이미지"
                fill
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
                  ></path>
            </svg>
              </div>
            )}
          </div>
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
