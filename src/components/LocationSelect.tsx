import React, { useState, useEffect, useRef } from 'react';
import { Location } from '../services/location';
import { locationApi } from '../services/location';

interface LocationSelectProps {
  onSelectLocation: (location: Location) => void;
  selectedLocation: Location | null;
  disabled?: boolean;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  onSelectLocation,
  selectedLocation,
  disabled = false,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locationListRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await locationApi.getLocations();
        setLocations(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('장소 목록을 불러오는데 실패했습니다.');
        }
        console.error('Failed to fetch locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationListRef.current && !locationListRef.current.contains(event.target as Node)) {
        setShowLocationList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectLocation = (location: Location) => {
    // 스크롤 위치 저장
    scrollPositionRef.current = window.scrollY;
    
    // 장소 선택 처리
    onSelectLocation(location);
    setShowLocationList(false);
    
    // 스크롤 위치 복원
    window.scrollTo(0, scrollPositionRef.current);
  };

  const handleToggleLocationList = () => {
    if (!disabled) {
      // 스크롤 위치 저장
      scrollPositionRef.current = window.scrollY;
      setShowLocationList(!showLocationList);
      // 스크롤 위치 복원
      window.scrollTo(0, scrollPositionRef.current);
    }
  };

  return (
    <div className="relative" ref={locationListRef}>
      <button
        type="button"
        onClick={handleToggleLocationList}
        disabled={disabled}
        className={`w-full px-4 py-3 text-left border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {selectedLocation ? selectedLocation.locationName : '장소를 선택하세요'}
      </button>
      {showLocationList && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B9AF5] mx-auto mb-2"></div>
              로딩 중...
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <div className="text-red-500 mb-2">{error}</div>
              <button
                onClick={() => {
                  scrollPositionRef.current = window.scrollY;
                  setShowLocationList(false);
                  window.scrollTo(0, scrollPositionRef.current);
                }}
                className="text-sm text-[#1B9AF5] hover:text-[#1B9AF5]/80"
              >
                닫기
              </button>
            </div>
          ) : locations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">장소 목록이 없습니다</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {locations.map((location) => (
                <li
                  key={location.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectLocation(location)}
                >
                  <div className="font-medium">{location.locationName}</div>
                  <div className="text-sm text-gray-500">{location.serviceSubcategory}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelect; 