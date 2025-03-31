import { PublicServiceResponse, PublicServiceLocation } from '../types/lesson';

const API_KEY = '676e4f796567776133304b6b444764';
const BASE_URL = 'http://openAPI.seoul.go.kr:8088';

export const publicServiceApi = {
  getLocations: async (startIndex: number, endIndex: number): Promise<PublicServiceLocation[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/${API_KEY}/xml/ListPublicReservationInstitution/${startIndex}/${endIndex}/강의실`
      );
      const text = await response.text();
      console.log('API Response:', text); // 디버깅을 위한 로그

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      // API 응답 코드 확인
      const result = xmlDoc.querySelector('RESULT');
      if (result) {
        const code = result.querySelector('CODE')?.textContent;
        const message = result.querySelector('MESSAGE')?.textContent;
        if (code === 'INFO-200') {
          console.log('No data found:', message);
          return [];
        }
      }

      const rows = xmlDoc.querySelectorAll('row');
      const locations: PublicServiceLocation[] = Array.from(rows).map(row => ({
        SVCID: row.querySelector('SVCID')?.textContent || '',
        PLACENM: row.querySelector('PLACENM')?.textContent || '',
        AREANM: row.querySelector('AREANM')?.textContent || '',
        MINCLASSNM: row.querySelector('MINCLASSNM')?.textContent || '',
        MAXCLASSNM: row.querySelector('MAXCLASSNM')?.textContent || '',
        SVCSTATNM: row.querySelector('SVCSTATNM')?.textContent || '',
        SVCNM: row.querySelector('SVCNM')?.textContent || '',
        PAYATNM: row.querySelector('PAYATNM')?.textContent || '',
        USETGTINFO: row.querySelector('USETGTINFO')?.textContent || '',
        SVCURL: row.querySelector('SVCURL')?.textContent || '',
        X: row.querySelector('X')?.textContent || '',
        Y: row.querySelector('Y')?.textContent || '',
        SVCOPNBGNDT: row.querySelector('SVCOPNBGNDT')?.textContent || '',
        SVCOPNENDDT: row.querySelector('SVCOPNENDDT')?.textContent || '',
        RCPTBGNDT: row.querySelector('RCPTBGNDT')?.textContent || '',
        RCPTENDDT: row.querySelector('RCPTENDDT')?.textContent || '',
        IMGURL: row.querySelector('IMGURL')?.textContent || '',
        DTLCONT: row.querySelector('DTLCONT')?.textContent || '',
        TELNO: row.querySelector('TELNO')?.textContent || '',
        V_MIN: row.querySelector('V_MIN')?.textContent || '',
        V_MAX: row.querySelector('V_MAX')?.textContent || '',
        REVSTDDAYNM: row.querySelector('REVSTDDAYNM')?.textContent || '',
        REVSTDDAY: row.querySelector('REVSTDDAY')?.textContent || ''
      }));
      
      console.log('Parsed locations:', locations); // 디버깅을 위한 로그
      return locations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  },

  getLocationById: async (id: string): Promise<PublicServiceLocation> => {
    try {
      const response = await fetch(
        `${BASE_URL}/${API_KEY}/xml/ListPublicReservationInstitution/1/1/${id}`
      );
      const text = await response.text();
      console.log('API Response for location:', text); // 디버깅을 위한 로그

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      // API 응답 코드 확인
      const result = xmlDoc.querySelector('RESULT');
      if (result) {
        const code = result.querySelector('CODE')?.textContent;
        const message = result.querySelector('MESSAGE')?.textContent;
        if (code === 'INFO-200') {
          throw new Error(message || '해당 장소 정보를 찾을 수 없습니다.');
        }
      }

      const row = xmlDoc.querySelector('row');
      if (!row) {
        throw new Error('해당 장소 정보를 찾을 수 없습니다.');
      }

      const location = {
        SVCID: row.querySelector('SVCID')?.textContent || '',
        PLACENM: row.querySelector('PLACENM')?.textContent || '',
        AREANM: row.querySelector('AREANM')?.textContent || '',
        MINCLASSNM: row.querySelector('MINCLASSNM')?.textContent || '',
        MAXCLASSNM: row.querySelector('MAXCLASSNM')?.textContent || '',
        SVCSTATNM: row.querySelector('SVCSTATNM')?.textContent || '',
        SVCNM: row.querySelector('SVCNM')?.textContent || '',
        PAYATNM: row.querySelector('PAYATNM')?.textContent || '',
        USETGTINFO: row.querySelector('USETGTINFO')?.textContent || '',
        SVCURL: row.querySelector('SVCURL')?.textContent || '',
        X: row.querySelector('X')?.textContent || '',
        Y: row.querySelector('Y')?.textContent || '',
        SVCOPNBGNDT: row.querySelector('SVCOPNBGNDT')?.textContent || '',
        SVCOPNENDDT: row.querySelector('SVCOPNENDDT')?.textContent || '',
        RCPTBGNDT: row.querySelector('RCPTBGNDT')?.textContent || '',
        RCPTENDDT: row.querySelector('RCPTENDDT')?.textContent || '',
        IMGURL: row.querySelector('IMGURL')?.textContent || '',
        DTLCONT: row.querySelector('DTLCONT')?.textContent || '',
        TELNO: row.querySelector('TELNO')?.textContent || '',
        V_MIN: row.querySelector('V_MIN')?.textContent || '',
        V_MAX: row.querySelector('V_MAX')?.textContent || '',
        REVSTDDAYNM: row.querySelector('REVSTDDAYNM')?.textContent || '',
        REVSTDDAY: row.querySelector('REVSTDDAY')?.textContent || ''
      };

      console.log('Parsed location:', location); // 디버깅을 위한 로그
      return location;
    } catch (error) {
      console.error('Error fetching location details:', error);
      throw error;
    }
  }
}; 