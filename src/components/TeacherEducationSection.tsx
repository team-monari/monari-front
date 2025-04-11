import React from "react";

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  period: string;
}

interface TeacherEducationSectionProps {
  educations: EducationItem[];
  experiences: ExperienceItem[];
  university?: string;
  major?: string;
  career?: string;
}

const TeacherEducationSection: React.FC<TeacherEducationSectionProps> = ({
  educations,
  experiences,
  university,
  major,
  career,
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h2 className="text-xl font-bold mb-4">학력</h2>

        {/* API에서 받은 대학교/전공 정보 */}
        {university || major ? (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-medium">
                  {university || "대학교 미입력"}
                </h3>
              </div>
              <p className="text-gray-600">{major || "전공 미입력"}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic mb-4">학력 정보 미입력</p>
        )}

        {/* 기존 학력 정보 */}
        {educations.length > 0 ? (
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-medium">{edu.school}</h3>
                  <span className="text-sm text-gray-500">{edu.period}</span>
                </div>
                <p className="text-gray-600">{edu.degree}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">경력</h2>

        {/* API에서 받은 경력 정보 */}
        {career ? (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">{career}</p>
          </div>
        ) : (
          <p className="text-gray-400 italic mb-4">경력 정보 미입력</p>
        )}

        {/* 기존 경력 정보 */}
        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-medium">{exp.company}</h3>
                  <span className="text-sm text-gray-500">{exp.period}</span>
                </div>
                <p className="text-gray-600">{exp.position}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TeacherEducationSection;
