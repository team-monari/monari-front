import React from 'react';
import FilterSection from './FilterSection';

interface LessonSearchProps {
  filters: {
    subject: string;
    educationLevel: string;
    course: string;
    region: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    subject: string;
    educationLevel: string;
    course: string;
    region: string;
  }>>;
  lessons: Array<{
    id: number;
    title: string;
    teacher: string;
    period: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    location: string;
    progress: string;
  }>;
}

const LessonSearch: React.FC<LessonSearchProps> = ({ filters, setFilters, lessons }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <FilterSection filters={filters} setFilters={setFilters} />
        
        <div className="flex justify-between items-center mt-8 mb-6">
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-900 font-medium">최신순</button>
            <div className="w-px h-3 bg-gray-300"></div>
            <button className="text-sm text-gray-500">인기순</button>
          </div>
          <select
            className="h-[38px] appearance-none bg-white border border-gray-200 rounded pl-3 pr-8 text-sm text-gray-900 focus:outline-none"
          >
            <option value="최신순">최신순</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img src={`/teacher-${lesson.id}.jpg`} alt={lesson.teacher} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.teacher}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">{lesson.period}</div>
              
              <p className="text-sm text-gray-600 mb-6 line-clamp-2">{lesson.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₩{lesson.price.toLocaleString()}
                  </span>
                  {lesson.discount > 0 && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ₩{lesson.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-red-500 font-medium">
                        {lesson.discount}% 할인
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">모집 현황</span>
                  <div className="flex items-center gap-1">
                    <div className="w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          parseInt(lesson.progress.split('/')[0]) / parseInt(lesson.progress.split('/')[1]) >= 1
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${(parseInt(lesson.progress.split('/')[0]) / parseInt(lesson.progress.split('/')[1])) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{lesson.progress}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{lesson.location}</span>
              </div>

              <button className="w-full h-[44px] bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                참여하기
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-1 mt-10">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400">
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonSearch; 