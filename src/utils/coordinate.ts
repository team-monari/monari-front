/**
 * 네이버 지도 좌표를 카카오 지도 WGS84 좌표로 변환하는 함수
 * @param x 네이버 지도 X 좌표
 * @param y 네이버 지도 Y 좌표
 * @returns 카카오 지도 좌표 { lat: 위도, lng: 경도 }
 */
export const naverToKakao = (x: number, y: number): { lat: number; lng: number } => {
  // 네이버 좌표를 정규화
  const nX = parseFloat(String(x)) / 10000000;
  const nY = parseFloat(String(y)) / 10000000;

  return {
    lat: nY,
    lng: nX
  };
};

/**
 * 카카오 지도 WGS84 좌표를 네이버 지도 좌표로 변환하는 함수
 * @param lat 카카오 지도 위도
 * @param lng 카카오 지도 경도
 * @returns 네이버 지도 좌표 { x: X 좌표, y: Y 좌표 }
 */
export const kakaoToNaver = (lat: number, lng: number): { x: number; y: number } => {
  return {
    x: Math.round(lng * 10000000),
    y: Math.round(lat * 10000000)
  };
}; 