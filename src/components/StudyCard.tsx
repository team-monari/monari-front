import React from "react";

export interface StudyData {
  id: number;
  title: string;
  type: "모집중" | "진행중" | "완료";
  participants: string;
  location?: string;
  subject?: string;
  time?: string;
  status?: string;
}

interface StudyCardProps {
  study: StudyData;
  status?: "모집중" | "진행중" | "완료";
}

const StudyCard: React.FC<StudyCardProps> = ({ study, status }) => {
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

  const displayStatus = status || study.status || study.type;
  const badgeColorClass = getBadgeColor(displayStatus);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{study.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColorClass}`}>
          {displayStatus}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <div className="flex justify-between">
          <span>인원</span>
          <span className="text-gray-900">{study.participants}</span>
        </div>

        {study.location && (
          <div className="flex justify-between">
            <span>장소</span>
            <span className="text-gray-900">{study.location}</span>
          </div>
        )}

        {study.subject && (
          <div className="flex justify-between">
            <span>과목</span>
            <span className="text-gray-900">{study.subject}</span>
          </div>
        )}

        {study.time && (
          <div className="flex justify-between">
            <span>시간</span>
            <span className="text-gray-900">{study.time}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyCard;
