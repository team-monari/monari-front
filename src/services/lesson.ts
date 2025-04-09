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
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const fetchLessons = async (page: number = 1, size: number = 6): Promise<LessonResponse> => {
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

export const searchLessons = async (keyword: string, page: number = 1, size: number = 6): Promise<LessonResponse> => {
  const response = await fetch(`http://localhost:8080/api/v1/lessons/search?keyword=${encodeURIComponent(keyword)}&pageNumber=${page}&pageSize=${size}`);
  if (!response.ok) {
    throw new Error('Failed to search lessons');
  }
  return response.json();
}; 