import React from "react";
import Image from "next/image";

interface TeacherProfileHeaderProps {
  name: string;
  email: string;
  profileImageUrl?: string | null;
  publicID?: string;
}

const TeacherProfileHeader: React.FC<TeacherProfileHeaderProps> = ({
  name,
  email,
  profileImageUrl,
  publicID,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start p-8 max-w-4xl mx-auto">
      <div className="relative mb-6 md:mb-0 md:mr-8">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-lg flex items-center justify-center">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
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

        <div className="flex flex-col md:flex-row md:items-center text-gray-600 text-sm mt-3 mb-4">
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
          {publicID && (
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
                ID: {publicID.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileHeader;
