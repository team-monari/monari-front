import React from "react";

export interface ClassData {
  id: number;
  title: string;
  period: string;
  students: string;
  status: "진행중" | "모집중" | "완료";
}

interface ClassCardProps {
  classData: ClassData;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData }) => {
  // 상태에 따른 배지 색상 결정
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "모집중":
        return "bg-green-100 text-green-800";
      case "진행중":
        return "bg-blue-100 text-blue-800";
      case "완료":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const badgeColorClass = getBadgeColor(classData.status);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium">{classData.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColorClass}`}>
          {classData.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span>{classData.period}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <span>{classData.students}</span>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
