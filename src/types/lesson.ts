export interface Teacher {
  id: number;
  name: string;
  university: string;
  rating: number;
  experience: string;
  profileImage?: string;
}

export interface Lesson {
  id: number;
  title: string;
  teacher: Teacher;
  period: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  location: string;
  progress: number;
  educationLevel: string;
  subject: string;
  capacity: {
    current: number;
    max: number;
  };
  curriculum?: {
    goals: string[];
    schedule: string[];
    weeks: {
      title: string;
      details: string[];
    }[];
  };
}

export interface LessonFilters {
  subject: string;
  educationLevel: string;
  course: string;
  region: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 