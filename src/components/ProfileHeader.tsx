import React from "react";
import Image from "next/image";

interface ProfileHeaderProps {
  name: string;
  school: string;
  email: string;
  phone: string;
  profileImage?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  school,
  email,
  phone,
  profileImage,
}) => {
  return (
    <div className="flex items-center p-6 border-b border-gray-200">
      <div className="relative mr-6">
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
            // 기본 프로필 이미지 대체
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-gray-600 mt-1">{school}</p>
          </div>
        </div>

        <div className="flex items-center mt-3 text-gray-600 text-sm">
          <div className="flex items-center mr-6">
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
          <div className="flex items-center">
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {phone}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
