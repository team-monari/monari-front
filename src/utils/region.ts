export type Region =
  | 'GANGNAM_GU'
  | 'GANGDONG_GU'
  | 'GANGBUK_GU'
  | 'GANGSEO_GU'
  | 'GWANAK_GU'
  | 'GWANGJIN_GU'
  | 'GURO_GU'
  | 'GEUMCHEON_GU'
  | 'NOWON_GU'
  | 'DOBONG_GU'
  | 'DONGDAEMUN_GU'
  | 'DONGJAK_GU'
  | 'MAPO_GU'
  | 'SEODAEMUN_GU'
  | 'SEOCHO_GU'
  | 'SEONGDONG_GU'
  | 'SEONGBUK_GU'
  | 'SONGPA_GU'
  | 'YANGCHEON_GU'
  | 'YEONGDEUNGPO_GU'
  | 'YONGSAN_GU'
  | 'EUNPYEONG_GU'
  | 'JONGNO_GU'
  | 'JUNG_GU'
  | 'JUNGRANG_GU';

export const regionToKorean: Record<Region, string> = {
  GANGNAM_GU: '강남구',
  GANGDONG_GU: '강동구',
  GANGBUK_GU: '강북구',
  GANGSEO_GU: '강서구',
  GWANAK_GU: '관악구',
  GWANGJIN_GU: '광진구',
  GURO_GU: '구로구',
  GEUMCHEON_GU: '금천구',
  NOWON_GU: '노원구',
  DOBONG_GU: '도봉구',
  DONGDAEMUN_GU: '동대문구',
  DONGJAK_GU: '동작구',
  MAPO_GU: '마포구',
  SEODAEMUN_GU: '서대문구',
  SEOCHO_GU: '서초구',
  SEONGDONG_GU: '성동구',
  SEONGBUK_GU: '성북구',
  SONGPA_GU: '송파구',
  YANGCHEON_GU: '양천구',
  YEONGDEUNGPO_GU: '영등포구',
  YONGSAN_GU: '용산구',
  EUNPYEONG_GU: '은평구',
  JONGNO_GU: '종로구',
  JUNG_GU: '중구',
  JUNGRANG_GU: '중랑구'
};

export const getRegionText = (region: Region): string => {
  return regionToKorean[region] || region;
};

export const regions: Region[] = [
  'GANGNAM_GU',
  'GANGDONG_GU',
  'GANGBUK_GU',
  'GANGSEO_GU',
  'GWANAK_GU',
  'GWANGJIN_GU',
  'GURO_GU',
  'GEUMCHEON_GU',
  'NOWON_GU',
  'DOBONG_GU',
  'DONGDAEMUN_GU',
  'DONGJAK_GU',
  'MAPO_GU',
  'SEODAEMUN_GU',
  'SEOCHO_GU',
  'SEONGDONG_GU',
  'SEONGBUK_GU',
  'SONGPA_GU',
  'YANGCHEON_GU',
  'YEONGDEUNGPO_GU',
  'YONGSAN_GU',
  'EUNPYEONG_GU',
  'JONGNO_GU',
  'JUNG_GU',
  'JUNGRANG_GU'
]; 