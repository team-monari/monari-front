export interface Teacher {
  id: number;
  name: string;
  university: string;
  rating: number;
  experience: string;
  profileImage?: string;
}

export interface Lesson {
  lessonId: number;
  locationId: number;
  title: string;
  currentStudent: number;
  description: string;
  amount: number;
  minStudent: number;
  maxStudent: number;
  startDate: string;
  endDate: string;
  deadline: string;
  status: string;
  region: string;
  schoolLevel: string;
  subject: string;
  name: string;
  university: string;
  major: string;
  career: string;
  profileImageUrl?: string;
  lessonType: string;
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

export enum SearchType {
  TITLE = 'TITLE',
  DESCRIPTION = 'DESCRIPTION',
  ALL = 'ALL'
}

export enum Subject {
  MATH = 'MATH',
  SCIENCE = 'SCIENCE',
  ENGLISH = 'ENGLISH',
  KOREAN = 'KOREAN',
  SOCIETY = 'SOCIETY'
}

export const getSubjectText = (subject: Subject): string => {
  switch (subject) {
    case Subject.MATH:
      return '수학';
    case Subject.SCIENCE:
      return '과학';
    case Subject.ENGLISH:
      return '영어';
    case Subject.KOREAN:
      return '국어';
    case Subject.SOCIETY:
      return '사회';
    default:
      return subject;
  }
}; 