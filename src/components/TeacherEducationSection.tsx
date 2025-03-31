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
}

const TeacherEducationSection: React.FC<TeacherEducationSectionProps> = ({
  educations,
  experiences,
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h2 className="text-xl font-bold mb-4">학력</h2>
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
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">경력</h2>
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
      </div>
    </div>
  );
};

export default TeacherEducationSection;
