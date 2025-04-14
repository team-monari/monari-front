import axios from 'axios';

export interface Location {
  id: number;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  cancellationDeadline: number;
  serviceUrl: string;
  serviceSubcategory: string;
  serviceStatus: string;
  paymentMethod: string;
  registrationStartDateTime?: string;
  registrationEndDateTime?: string;
  cancellationStartDateTime?: string;
  cancellationEndDateTime?: string;
  cancellationPolicyInfo?: string;
}

// API URL 설정
const API_BASE_URL = 'http://localhost:8080/api/v1';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const locationApi = {
  getLocations: async (): Promise<Location[]> => {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 서버에서 에러 응답을 받은 경우
          console.error('Server Error:', error.response.data);
          throw new Error('서버에서 장소 목록을 불러오는데 실패했습니다.');
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          console.error('Network Error:', error.request);
          throw new Error('서버와의 연결에 실패했습니다. 네트워크 상태를 확인해주세요.');
        }
      }
      console.error('Error:', error);
      throw new Error('장소 목록을 불러오는데 실패했습니다.');
    }
  },

  getLocation: async (id: number): Promise<Location> => {
    try {
      const response = await api.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          throw new Error('서버에서 장소 정보를 불러오는데 실패했습니다.');
        } else if (error.request) {
          console.error('Network Error:', error.request);
          throw new Error('서버와의 연결에 실패했습니다. 네트워크 상태를 확인해주세요.');
        }
      }
      console.error('Error:', error);
      throw new Error('장소 정보를 불러오는데 실패했습니다.');
    }
  }
};

export const fetchLocationById = async (locationId: number): Promise<Location> => {
  const response = await fetch(`http://localhost:8080/api/v1/locations/${locationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch location');
  }
  return response.json();
};

export const getLocationUrl = (location: Location): string => {
  return location.serviceUrl || `https://map.naver.com/v5/search/${encodeURIComponent(location.locationName)}`;
}; 