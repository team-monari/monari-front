import { Region } from '../utils/region';

export interface Study {
  id: number;
  title: string;
  description: string;
  subject: 'MATH' | 'ENGLISH' | 'KOREAN' | 'SCIENCE' | 'SOCIETY';
  schoolLevel: 'MIDDLE' | 'HIGH';
  status: 'ACTIVE' | 'CLOSED' | 'IN_PROGRESS';
  createdAt: string;
  studyType: 'ONLINE' | 'OFFLINE';
  locationId: number | null;
  generalLocationId: number | null;
  studentPublicId: string;
  studentName: string;
  region: Region;
  locationName?: string;
  locationServiceUrl?: string;
} 