export interface Lesson {
  lessonId: number;
  locationId: number;
  teacherId: number;
  title: string;
  description: string;
  amount: number;
  minStudent: number;
  maxStudent: number;
  startDate: string;
  endDate: string;
  deadline: string;
  status: string;
  schoolLevel: string;
  subject: string;
  currentStudent: number;
}

export interface LessonResponse {
  content: Lesson[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const fetchLessons = async (page: number = 0, size: number = 6): Promise<LessonResponse> => {
  const response = await fetch(`http://localhost:8080/api/v1/lessons?pageNumber=${page}&pageSize=${size}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }
  return response.json();
};

export const fetchLessonById = async (lessonId: number): Promise<Lesson> => {
  const response = await fetch(`http://localhost:8080/api/v1/lessons/${lessonId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lesson details');
  }
  return response.json();
};

export const searchLessons = async (
  keyword: string,
  page: number = 0,
  size: number = 6,
  schoolLevel?: string,
  subject?: string
): Promise<LessonResponse> => {
  const params = new URLSearchParams();
  params.append('keyword', keyword);
  params.append('pageNumber', page.toString());
  params.append('pageSize', size.toString());
  
  if (schoolLevel) params.append('schoolLevel', schoolLevel);
  if (subject) params.append('subject', subject);

  const response = await fetch(`http://localhost:8080/api/v1/lessons/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to search lessons');
  }
  return response.json();
}; 