import { Region } from '../utils/region';

export interface GeneralLocation {
  id: number;
  locationName: string;
  x: string;
  y: string;
  region: Region;
  serviceUrl: string;
}

export const generalLocationApi = {
  getLocation: async (id: number): Promise<GeneralLocation> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/general_locations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch general location');
    }
    return response.json();
  },
  getLocations: async (): Promise<GeneralLocation[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/general_locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch general locations');
    }
    return response.json();
  }
}; 