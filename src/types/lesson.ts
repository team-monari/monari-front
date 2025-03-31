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
  teacher: {
    name: string;
    image: string;
  };
  period: string;
  description: string;
  price: number;
  minStudents: number;
  maxStudents: number;
  location: string;
  currentStudents: number;
  educationLevel: string;
  subject: string;
  startDate: string;
  endDate: string;
  cancelPolicy?: {
    period: number;
    fee: number;
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

export interface PublicServiceResponse {
  list_total_count: number;
  RESULT: {
    CODE: string;
    MESSAGE: string;
  };
  row: PublicServiceLocation[];
}

export interface PublicServiceLocation {
  SVCID: string;
  PLACENM: string;
  AREANM: string;
  MINCLASSNM: string;
  MAXCLASSNM: string;
  SVCSTATNM: string;
  SVCNM: string;
  PAYATNM: string;
  USETGTINFO: string;
  SVCURL: string;
  X: string;
  Y: string;
  SVCOPNBGNDT: string;
  SVCOPNENDDT: string;
  RCPTBGNDT: string;
  RCPTENDDT: string;
  IMGURL: string;
  DTLCONT: string;
  TELNO: string;
  V_MIN: string;
  V_MAX: string;
  REVSTDDAYNM: string;
  REVSTDDAY: string;
} 