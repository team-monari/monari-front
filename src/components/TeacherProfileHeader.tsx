import React from "react";
import Image from "next/image";

interface TeacherProfileHeaderProps {
  name: string;
  job: string;
  email: string;
  phone: string;
  profileImage?: string;
}

const TeacherProfileHeader: React.FC<TeacherProfileHeaderProps> = ({
  name,
  job,
  email,
  phone,
  profileImage,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start p-8 max-w-4xl mx-auto">
      <div className="relative mb-6 md:mb-0 md:mr-8">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-lg flex items-center justify-center">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${name}의 프로필 이미지`}
              width={128}
              height={128}
              className="object-cover"
            />
          ) : (
            // 기본 프로필 이미지 대체
            <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-500 text-4xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-gray-600 mt-1 mb-4">{job}</p>

        <div className="flex flex-col md:flex-row md:items-center text-gray-600 text-sm mb-4">
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

export default TeacherProfileHeader;
