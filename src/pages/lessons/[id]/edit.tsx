import React, { useState, useEffect, useRef } from 'react';
import Header from '../../../components/Header';
import { useRouter } from 'next/router';
import { locationApi, Location } from '../../../services/location';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { regions, getRegionText } from '../../../utils/region';
import { inputStyles } from '../../../utils/styles';
import { naverToKakao } from '../../../utils/coordinate';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FormData {
  title: string;
  description: string;
  price: string;
  minStudents: string;
  maxStudents: string;
  location: string;
  locationId: number | null;
  startDate: Date | null;
  endDate: Date | null;
  educationLevel: 'MIDDLE' | 'HIGH';
  subject: 'MATH' | 'SCIENCE';
  grade: 'FIRST' | 'SECOND' | 'THIRD';
  region: string;
  lessonType: 'OFFLINE' | 'ONLINE' | '';
}

interface FormErrors {
  title?: string;
  description?: string;
  amount?: string;
  minStudent?: string;
  maxStudent?: string;
  locationId?: string;
  region?: string;
  dateRange?: string;
}

const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
  '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
]; 

const EditLessonPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    minStudents: '',
    maxStudents: '',
    location: '',
    locationId: null,
    startDate: null,
    endDate: null,
    educationLevel: 'MIDDLE',
    subject: 'MATH',
    grade: 'FIRST',
    region: '',
    lessonType: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const locationListRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [lessonStatus, setLessonStatus] = useState<'ACTIVE' | 'CLOSED' | 'CANCELED'>('ACTIVE');
  const [showPreview, setShowPreview] = useState(false);

  const statusConfig = {
    ACTIVE: {
      label: '진행중',
      description: '현재 수업이 진행 중이며 학생들이 신청할 수 있습니다.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    CLOSED: {
      label: '모집완료',
      description: '수업 모집이 완료되어 더 이상 신청을 받지 않습니다.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    CANCELED: {
      label: '취소',
      description: '수업이 취소되어 더 이상 신청을 받지 않습니다.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  };

  // 수업 정보 가져오기
  const fetchLessonData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('수업 정보를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      
      // 날짜 문자열을 Date 객체로 변환
      const startDate = data.startDate ? new Date(data.startDate) : null;
      const endDate = data.endDate ? new Date(data.endDate) : null;

      let locationName = '온라인';
      let selectedLoc = null;
      if (data.lessonType === 'OFFLINE' && data.locationId !== null && data.locationId !== undefined) {
        // 장소 상세정보를 반드시 fetch
        try {
          const locationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/general_locations/${data.locationId}`);
          if (locationResponse.ok) {
            const locationData = await locationResponse.json();
            locationName = locationData.locationName || '';
            selectedLoc = locationData;
          }
        } catch (e) {
          // ignore
        }
      }
      console.log('fetchLessonData data:', data);
      console.log('fetchLessonData locationName:', locationName);
      console.log('fetchLessonData selectedLoc:', selectedLoc);
      setFormData({
        title: data.title,
        description: data.description,
        price: data.amount.toString(),
        minStudents: data.minStudent.toString(),
        maxStudents: data.maxStudent.toString(),
        location: data.lessonType === 'OFFLINE' ? locationName : '온라인',
        locationId: data.lessonType === 'OFFLINE' ? data.locationId : null,
        startDate,
        endDate,
        educationLevel: data.schoolLevel,
        subject: data.subject,
        grade: data.grade,
        region: data.lessonType === 'OFFLINE' ? data.region : '온라인',
        lessonType: data.lessonType,
      });
      console.log('setFormData:', {
        title: data.title,
        description: data.description,
        price: data.amount.toString(),
        minStudents: data.minStudent.toString(),
        maxStudents: data.maxStudent.toString(),
        location: data.lessonType === 'OFFLINE' ? locationName : '온라인',
        locationId: data.lessonType === 'OFFLINE' ? data.locationId : null,
        startDate,
        endDate,
        educationLevel: data.schoolLevel,
        subject: data.subject,
        grade: data.grade,
        region: data.lessonType === 'OFFLINE' ? data.region : '온라인',
        lessonType: data.lessonType,
      });
      if (selectedLoc) setSelectedLocation(selectedLoc);

      // Ensure the status is one of the allowed values
      const validStatus = ['ACTIVE', 'CLOSED', 'CANCELED'].includes(data.status) 
        ? data.status 
        : 'ACTIVE';
      setLessonStatus(validStatus as 'ACTIVE' | 'CLOSED' | 'CANCELED');
      setFormattedPrice(data.amount.toLocaleString());
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError(err instanceof Error ? err.message : '수업 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/general_locations`);
      if (!response.ok) {
        throw new Error('장소 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setAllLocations(data);
      setFilteredLocations(data);
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

  // 지역 선택 시 장소 필터링
  useEffect(() => {
    if (formData.region && formData.region !== '온라인') {
      const filtered = allLocations.filter(location => location.region === formData.region);
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(allLocations);
    }
  }, [formData.region, allLocations]);

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setFormData(prev => ({
      ...prev,
      startDate: dates[0],
      endDate: dates[1]
    }));
  };

  const handleChange = (field: keyof FormData, value: string | number | Date | null) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [field]: value === '' || value === null ? '' : value
      };
      
      // If lesson type is changed to ONLINE, reset location information and region
      if (field === 'lessonType' && value === 'ONLINE') {
        newFormData.location = '온라인';  // UI 표시용
        newFormData.locationId = null;    // 서버 전송용
        newFormData.region = '온라인';    // UI 표시용
        setSelectedLocation(null);
      }
      
      return newFormData;
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      const numberValue = parseInt(value, 10);
      setFormData(prev => ({ ...prev, price: numberValue.toString() }));
      setFormattedPrice(numberValue.toLocaleString());
    } else {
      setFormData(prev => ({ ...prev, price: '' }));
      setFormattedPrice('');
    }
  };

  const handleSelectLocation = async (location: Location) => {
    try {
      const currentScrollPosition = window.scrollY;
      
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/general_locations/${location.id}`);
      if (!response.ok) {
        throw new Error('장소 상세 정보를 불러오는데 실패했습니다.');
      }
      const detailedLocation = await response.json();
      
      // 상태 업데이트를 batch로 처리
      React.startTransition(() => {
        setSelectedLocation(detailedLocation);
        setFormData(prev => ({
          ...prev,
          location: formData.lessonType === 'ONLINE' ? '온라인' : `${location.locationName}`,
          locationId: location.id
        }));
        setShowLocationList(false);
      });
      
      // 다음 렌더링 사이클에서 스크롤 위치 복원
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollPosition);
      });
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('장소 상세 정보를 불러오는데 실패했습니다.');
      }
      console.error('Failed to fetch location details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLocationList = () => {
    if (!showLocationList) {
      scrollPositionRef.current = window.scrollY;
    }
    setShowLocationList(!showLocationList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const accessToken = localStorage.getItem('accessToken');
    const userType = localStorage.getItem('userType');

    if (!accessToken) {
      const result = await Swal.fire({
        title: '로그인 필요',
        text: '수업 수정은 선생님만이 사용할 수 있는 기능입니다. 로그인하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오',
        confirmButtonColor: '#1B9AF5',
        cancelButtonColor: '#6B7280',
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      if (result.isConfirmed) {
        router.push('/auth/login?role=TEACHER');
      }
      return;
    }

    if (userType !== 'TEACHER') {
      await Swal.fire({
        title: '접근 불가',
        text: '수업 수정은 선생님만이 사용할 수 있는 기능입니다.',
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: '#1B9AF5',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      router.push('/');
      return;
    }

    // 폼 검증
    const errors: FormErrors = {};
    let firstErrorField: string | null = null;

    if (!formData.title.trim()) {
      errors.title = '수업 제목을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'title';
    }

    if (!formData.description.trim()) {
      errors.description = '수업 설명을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'description';
    }

    if (!formData.price || formData.price === '0') {
      errors.amount = '수업 가격을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'amount';
    }

    if (!formData.minStudents || parseInt(formData.minStudents) < 1) {
      errors.minStudent = '최소 인원을 입력해주세요.';
      if (!firstErrorField) firstErrorField = 'minStudent';
    }

    if (!formData.maxStudents || parseInt(formData.maxStudents) < parseInt(formData.minStudents)) {
      errors.maxStudent = '최대 인원은 최소 인원보다 크거나 같아야 합니다.';
      if (!firstErrorField) firstErrorField = 'maxStudent';
    }

    // 오프라인 수업일 때만 장소와 지역 검증
    if (formData.lessonType === 'OFFLINE') {
      if (!formData.locationId) {
        errors.locationId = '수업 장소를 선택해주세요.';
        if (!firstErrorField) firstErrorField = 'locationId';
      }

      if (!formData.region) {
        errors.region = '지역을 선택해주세요.';
        if (!firstErrorField) firstErrorField = 'region';
      }
    }

    if (!formData.startDate || !formData.endDate) {
      errors.dateRange = '수업 기간을 선택해주세요.';
      if (!firstErrorField) firstErrorField = 'dateRange';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
      return;
    }

    try {
      const result = await Swal.fire({
        title: '수업 수정',
        html: `
          <div class="text-left">
            <p class="mb-4">수업을 수정하시겠습니까?</p>
            <div class="bg-yellow-50 p-4 rounded-lg mb-4">
              <p class="text-yellow-800 font-semibold mb-2">⚠️ 환불 정책 안내</p>
              <ul class="text-yellow-700 text-sm list-disc pl-4">
                <li>환불 정책은 선생님이 직접 명시합니다. <b>수업 설명에 반드시 환불 규정을 작성해 주세요.</b></li>
                <li>수업 취소는 모집 마감일(데드라인) 이전까지만 가능하며, 100% 환불됩니다.</li>
              </ul>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800 font-semibold mb-2">📅 수업 기간 안내</p>
              <ul class="text-blue-700 text-sm list-disc pl-4">
                <li>수업 시작일: ${formData.startDate ? formData.startDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '미정'}</li>
                <li>수업 종료일: ${formData.endDate ? formData.endDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '미정'}</li>
                <li>모집 마감일: ${formData.startDate ? new Date(formData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '미정'}</li>
              </ul>
            </div>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '수정하기',
        cancelButtonText: '취소',
        confirmButtonColor: '#1B9AF5',
        cancelButtonColor: '#6B7280',
      });

      if (result.isConfirmed) {
        const deadline = formData.startDate 
          ? new Date(formData.startDate)
          : new Date();
        deadline.setDate(deadline.getDate() - 7);

        const lessonData = {
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          schoolLevel: formData.educationLevel,
          minStudent: parseInt(formData.minStudents),
          maxStudent: parseInt(formData.maxStudents),
          amount: parseInt(formData.price),
          startDate: formData.startDate?.toISOString().split('T')[0],
          endDate: formData.endDate?.toISOString().split('T')[0],
          locationId: formData.lessonType === 'ONLINE' ? null : formData.locationId,
          grade: formData.grade,
          status: lessonStatus,
          deadline: deadline.toISOString().split('T')[0],
          region: formData.lessonType === 'ONLINE' ? null : formData.region,
          lessonType: formData.lessonType,
        };

        console.log('Sending lesson data:', lessonData); // 디버깅용 로그

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(lessonData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData); // 디버깅용 로그
          if (errorData.data) {
            setFormErrors(errorData.data);
            return;
          }
          throw new Error('수업 수정에 실패했습니다.');
        }

        await Swal.fire({
          title: '수업 수정 완료',
          text: '수업이 성공적으로 수정되었습니다.',
          icon: 'success',
          confirmButtonColor: '#1B9AF5',
        });

        router.push('/myclasses');
      }
    } catch (error) {
      console.error('수업 수정 중 오류 발생:', error);
      await Swal.fire({
        title: '오류 발생',
        text: '수업 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonColor: '#1B9AF5',
      });
    }
  };

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'CLOSED' | 'CANCELED') => {
    try {
      const result = await Swal.fire({
        title: '수업 상태 변경',
        html: `
          <div class="text-left">
            <p class="mb-4">수업 상태를 "${statusConfig[newStatus].label}"(으)로 변경하시겠습니까?</p>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <p class="text-yellow-800 font-semibold mb-2">⚠️ 주의사항</p>
              <ul class="text-yellow-700 text-sm list-disc pl-4">
                ${newStatus === 'ACTIVE' ? `
                  <li>진행중 상태로 변경하면 학생들이 다시 신청할 수 있습니다.</li>
                  <li>수업이 정상적으로 운영됩니다.</li>
                ` : newStatus === 'CLOSED' ? `
                  <li>모집완료로 변경하면 더 이상 신청을 받지 않습니다.</li>
                  <li>이미 신청한 학생들의 수업은 계속 진행됩니다.</li>
                ` : `
                  <li>취소 상태로 변경하면 수업이 즉시 중단됩니다.</li>
                  <li>신청한 학생들에게 취소 알림이 발송됩니다.</li>
                  <li>이 작업은 되돌릴 수 없습니다.</li>
                `}
              </ul>
            </div>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '변경하기',
        cancelButtonText: '취소',
        confirmButtonColor: '#1B9AF5',
        cancelButtonColor: '#6B7280',
      });

      if (result.isConfirmed) {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('로그인이 필요합니다.');
        }

        const deadline = formData.startDate 
          ? new Date(formData.startDate)
          : new Date();
        deadline.setDate(deadline.getDate() - 7);

        const lessonData = {
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          schoolLevel: formData.educationLevel,
          minStudent: parseInt(formData.minStudents),
          maxStudent: parseInt(formData.maxStudents),
          amount: parseInt(formData.price),
          startDate: formData.startDate?.toISOString().split('T')[0],
          endDate: formData.endDate?.toISOString().split('T')[0],
          locationId: formData.lessonType === 'ONLINE' ? null : formData.locationId,
          grade: formData.grade,
          status: newStatus,
          deadline: deadline.toISOString().split('T')[0],
          region: formData.lessonType === 'ONLINE' ? null : formData.region,
          lessonType: formData.lessonType,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(lessonData),
        });

        if (!response.ok) {
          throw new Error('수업 상태 변경에 실패했습니다.');
        }

        // Update status in state only after successful API call
        setLessonStatus(newStatus);
        
        await Swal.fire({
          title: '상태 변경 완료',
          text: `수업이 "${statusConfig[newStatus].label}" 상태로 변경되었습니다.`,
          icon: 'success',
          confirmButtonColor: '#1B9AF5',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error changing lesson status:', error);
      await Swal.fire({
        title: '오류 발생',
        text: error instanceof Error ? error.message : '수업 상태 변경 중 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonColor: '#1B9AF5',
      });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userType = localStorage.getItem('userType');

      if (!accessToken) {
        const result = await Swal.fire({
          title: '로그인 필요',
          text: '수업 수정은 선생님만이 사용할 수 있는 기능입니다. 로그인하시겠습니까?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
          confirmButtonColor: '#1B9AF5',
          cancelButtonColor: '#6B7280',
          allowOutsideClick: false,
          allowEscapeKey: false
        });

        if (result.isConfirmed) {
          router.push('/auth/login?role=TEACHER');
        } else {
          router.push('/');
        }
        return;
      }

      if (userType !== 'TEACHER') {
        await Swal.fire({
          title: '접근 불가',
          text: '수업 수정은 선생님만이 사용할 수 있는 기능입니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#1B9AF5',
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        router.push('/');
        return;
      }

      try {
        await fetchLocations();
        if (id) {
          await fetchLessonData();
        }
      } catch (error) {
        console.error('Error:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, id]);

  useEffect(() => {
    if (isMapLoaded && selectedLocation && window.kakao) {
      const container = document.getElementById('map');
      if (!container) return;

      try {
        // 서울시청 좌표 (기본값)
        const defaultCoords = {
          lat: 37.5665,
          lng: 126.9780
        };

        let coords;
        if (selectedLocation.x && selectedLocation.y) {
          // 네이버 좌표를 카카오 좌표로 변환
          const kakaoCoords = naverToKakao(
            parseFloat(selectedLocation.x),
            parseFloat(selectedLocation.y)
          );
          coords = new window.kakao.maps.LatLng(
            kakaoCoords.lat,
            kakaoCoords.lng
          );
        } else {
          // x, y 좌표가 없는 경우 서울시청 좌표 사용
          coords = new window.kakao.maps.LatLng(
            defaultCoords.lat,
            defaultCoords.lng
          );
          console.warn('Location coordinates not found, using default coordinates (Seoul City Hall)');
        }

        const options = {
          center: coords,
          level: 3
        };

        const newMap = new window.kakao.maps.Map(container, options);
        
        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: coords,
          map: newMap
        });

        // 인포윈도우로 장소에 대한 설명을 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">
            ${selectedLocation.locationName}
            ${!selectedLocation.x || !selectedLocation.y ? '<br><small style="color: #ff6b6b;">(좌표 정보 없음)</small>' : ''}
          </div>`
        });
        infowindow.open(newMap, marker);

        setMap(newMap);
        setMarker(marker);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }
  }, [isMapLoaded, selectedLocation]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_ID}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (isCheckingAuth) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-[1280px]">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B9AF5] mx-auto"></div>
            <p className="mt-3 text-gray-600">수업 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-[1280px]">
          <div className="text-center py-12 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>수업 수정 - 모나리</title>
        <meta name="description" content="모나리 수업 수정" />
      </Head>

      <Header />
      <main className="container mx-auto px-6 py-8 max-w-[1280px]">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">수업 수정</h1>
          </div>
          
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${statusConfig[lessonStatus].bgColor}`}>
                      {statusConfig[lessonStatus].icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">수업 상태</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {statusConfig[lessonStatus].description}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={lessonStatus}
                      onChange={(e) => handleStatusChange(e.target.value as 'ACTIVE' | 'CLOSED' | 'CANCELED')}
                      className={`appearance-none pl-3 pr-10 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B9AF5] cursor-pointer
                        ${statusConfig[lessonStatus].bgColor} ${statusConfig[lessonStatus].color} ${statusConfig[lessonStatus].hoverBg}`}
                    >
                      <option value="ACTIVE">진행중</option>
                      <option value="CLOSED">모집완료</option>
                      <option value="CANCELED">취소</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  수업 유형
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, lessonType: 'OFFLINE' });
                      Swal.fire({
                        title: '오프라인 수업 주의사항',
                        html: `
                          <div class="text-left space-y-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                              <h3 class="font-semibold text-blue-800 mb-2">📌 장소 준비</h3>
                              <ul class="list-disc pl-4 space-y-1 text-gray-700">
                                <li>수업 장소는 반드시 선생님이 준비해야 합니다.</li>
                                <li>장소는 조용하고 학습에 적합한 환경이어야 합니다.</li>
                                <li>필요한 교구나 시설을 미리 준비해주세요.</li>
                              </ul>
                            </div>
                            <div class="bg-yellow-50 p-4 rounded-lg">
                              <h3 class="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h3>
                              <ul class="list-disc pl-4 space-y-1 text-gray-700">
                                <li>수업 장소는 수업 시작 10분 전까지 준비되어야 합니다.</li>
                                <li>오프라인 수업의 최대 인원은 9명으로 제한됩니다. (<a href="https://dbedu.sen.go.kr/CMS/civilapp/civilapp02/civilapp0204/civilapp020403/index.html" target="_blank" class="text-blue-600 hover:underline">관련 내용</a>)</li>
                              </ul>
                            </div>
                          </div>
                        `,
                        icon: 'info',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#1B9AF5',
                      });
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.lessonType === 'OFFLINE'
                        ? 'border-[#1B9AF5] bg-[#1B9AF5]/5'
                        : 'border-gray-200 hover:border-[#1B9AF5]/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">오프라인 수업</span>
                      <span className="text-sm text-gray-500 text-center">선생님과 직접 만나서 진행하는 수업</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, lessonType: 'ONLINE' });
                      Swal.fire({
                        title: '온라인 수업 주의사항',
                        html: `
                          <div class="text-left space-y-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                              <h3 class="font-semibold text-blue-800 mb-2">📌 기술 준비</h3>
                              <ul class="list-disc pl-4 space-y-1 text-gray-700">
                                <li>안정적인 인터넷 연결이 필요합니다.</li>
                                <li>화상회의 소프트웨어(예: Zoom, Google Meet)를 준비해주세요.</li>
                                <li>마이크와 웹캠이 필요합니다.</li>
                              </ul>
                            </div>
                            <div class="bg-yellow-50 p-4 rounded-lg">
                              <h3 class="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h3>
                              <ul class="list-disc pl-4 space-y-1 text-gray-700">
                                <li>수업 시작 10분 전에 화상회의실을 개설해주세요.</li>
                                <li>수업 중 화면 공유와 채팅 기능을 활용할 수 있어야 합니다.</li>
                                <li>학생들의 개인정보 보호를 위해 녹화는 금지됩니다.</li>
                              </ul>
                            </div>
                          </div>
                        `,
                        icon: 'info',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#1B9AF5',
                      });
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.lessonType === 'ONLINE'
                        ? 'border-[#1B9AF5] bg-[#1B9AF5]/5'
                        : 'border-gray-200 hover:border-[#1B9AF5]/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">온라인 수업</span>
                      <span className="text-sm text-gray-500 text-center">화상회의로 진행하는 수업</span>
                    </div>
                  </button>
                </div>
                {!formData.lessonType && (
                  <p className="mt-2 text-sm text-red-500">수업 유형을 선택해주세요.</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  수업 제목
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border ${formErrors.title ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                  placeholder="수업 제목을 입력하세요"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-2">
                  수업 설명
                </label>
                <div className="border border-gray-200 rounded-xl">
                  <div className="border-b border-gray-200 p-2 bg-gray-50 flex justify-between items-center">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = formData.description;
                            const newText = text.substring(0, start) + '**' + text.substring(start, end) + '**' + text.substring(end);
                            handleChange('description', newText);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="굵게 (Ctrl+B)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = formData.description;
                            const newText = text.substring(0, start) + '*' + text.substring(start, end) + '*' + text.substring(end);
                            handleChange('description', newText);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="기울임 (Ctrl+I)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l-4 4-4-4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = formData.description;
                            const newText = text.substring(0, start) + '### ' + text.substring(start, end) + text.substring(end);
                            handleChange('description', newText);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="제목 (Ctrl+H)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = formData.description;
                            const newText = text.substring(0, start) + '- ' + text.substring(start, end) + text.substring(end);
                            handleChange('description', newText);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="목록 (Ctrl+L)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = formData.description;
                            const newText = text.substring(0, start) + '> ' + text.substring(start, end) + text.substring(end);
                            handleChange('description', newText);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="인용구 (Ctrl+Q)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = formData.description;
                            const newText = text.substring(0, start) + '```\n' + text.substring(start, end) + '\n```' + text.substring(end);
                            handleChange('description', newText);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="코드 블록 (Ctrl+K)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l-4 4-4-4" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">단축키 안내:</span>
                      <button
                        type="button"
                        onClick={() => {
                          Swal.fire({
                            title: '마크다운 단축키',
                            html: `
                              <div class="text-left space-y-2">
                                <p><kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + B</kbd> 굵게</p>
                                <p><kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + I</kbd> 기울임</p>
                                <p><kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + H</kbd> 제목</p>
                                <p><kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + L</kbd> 목록</p>
                                <p><kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + Q</kbd> 인용구</p>
                                <p><kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + K</kbd> 코드 블록</p>
                              </div>
                            `,
                            confirmButtonText: '확인',
                            confirmButtonColor: '#1B9AF5',
                          });
                        }}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="단축키 안내"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="미리보기 전환"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={showPreview ? 'hidden' : 'block'}>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.ctrlKey) {
                            const textarea = e.target as HTMLTextAreaElement;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = formData.description;
                            let newText = text;

                            switch (e.key.toLowerCase()) {
                              case 'b':
                                e.preventDefault();
                                newText = text.substring(0, start) + '**' + text.substring(start, end) + '**' + text.substring(end);
                                break;
                              case 'i':
                                e.preventDefault();
                                newText = text.substring(0, start) + '*' + text.substring(start, end) + '*' + text.substring(end);
                                break;
                              case 'h':
                                e.preventDefault();
                                newText = text.substring(0, start) + '### ' + text.substring(start, end) + text.substring(end);
                                break;
                              case 'l':
                                e.preventDefault();
                                newText = text.substring(0, start) + '- ' + text.substring(start, end) + text.substring(end);
                                break;
                              case 'q':
                                e.preventDefault();
                                newText = text.substring(0, start) + '> ' + text.substring(start, end) + text.substring(end);
                                break;
                              case 'k':
                                e.preventDefault();
                                newText = text.substring(0, start) + '```\n' + text.substring(start, end) + '\n```' + text.substring(end);
                                break;
                            }
                            handleChange('description', newText);
                          }
                        }}
                        placeholder="수업 설명을 입력하세요"
                        className="w-full h-[500px] p-4 focus:outline-none resize-none"
                      />
                    </div>
                    <div className={`border border-gray-200 rounded-xl p-4 bg-gray-50 ${showPreview ? 'col-span-2' : ''}`}>
                      <div className="prose max-w-none h-[500px] overflow-y-auto">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.description}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    수업 가격
                  </label>
                  <div className="relative">
                    <input
                      id="amount"
                      type="text"
                      value={formattedPrice}
                      onChange={handlePriceChange}
                      className={`w-full px-4 py-3 border ${formErrors.amount ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                      placeholder="수업 가격을 입력하세요"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">원</span>
                    {formErrors.amount && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-800">
                    모집 인원
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        id="minStudent"
                        type="number"
                        value={formData.minStudents}
                        onChange={(e) => handleChange('minStudents', e.target.value)}
                        max={formData.lessonType === 'OFFLINE' ? 9 : undefined}
                        className={`w-full px-4 py-3 border ${formErrors.minStudent ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                        placeholder="최소 인원"
                      />
                      {formErrors.minStudent && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.minStudent}</p>
                      )}
                    </div>
                    <div>
                      <input
                        id="maxStudent"
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => handleChange('maxStudents', e.target.value)}
                        min={formData.minStudents}
                        max={formData.lessonType === 'OFFLINE' ? 9 : undefined}
                        className={`w-full px-4 py-3 border ${formErrors.maxStudent ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all`}
                        placeholder="최대 인원"
                      />
                      {formErrors.maxStudent && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.maxStudent}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  교육 대상
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleChange('educationLevel', e.target.value as 'MIDDLE' | 'HIGH')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                >
                  <option value="MIDDLE">중학교</option>
                  <option value="HIGH">고등학교</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  학년
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value as 'FIRST' | 'SECOND' | 'THIRD')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                >
                  {formData.educationLevel === 'MIDDLE' ? (
                    <>
                      <option value="FIRST">1학년</option>
                      <option value="SECOND">2학년</option>
                      <option value="THIRD">3학년</option>
                    </>
                  ) : (
                    <>
                      <option value="FIRST">1학년</option>
                      <option value="SECOND">2학년</option>
                      <option value="THIRD">3학년</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  과목
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value as 'MATH' | 'SCIENCE')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                >
                  <option value="MATH">수학</option>
                  <option value="SCIENCE">과학</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  수업 기간
                </label>
                <div id="dateRange" className="w-full">
                  <div className="w-full">
                    <DatePicker
                      selectsRange={true}
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      onChange={handleDateRangeChange}
                      minDate={new Date()}
                      maxDate={formData.startDate ? new Date(formData.startDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="수업 기간을 선택하세요"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white"
                      required
                      wrapperClassName="w-full"
                    />
                  </div>
                  {formData.startDate && (
                    <div className="mt-2 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-700">
                        모집 마감일: {new Date(formData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-blue-600">
                          ※ 모집 마감일은 수업 시작일 7일 전으로 자동 설정됩니다.
                        </p>
                        <p className="text-xs text-blue-600">
                          ※ 수업 시작일 전까지는 수정이 가능하며, 시작일 이후에는 수정이 불가능합니다.
                        </p>
                        <p className="text-xs text-blue-600">
                          ※ 모집 마감일 전까지는 수업 취소가 가능합니다.
                        </p>
                        <p className="text-xs text-blue-600">
                          ※ 수업 기간은 최대 30일까지만 설정 가능합니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {formErrors.dateRange && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.dateRange}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  지역
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.lessonType === 'ONLINE' ? '온라인' : formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className={`${inputStyles.base} ${formData.lessonType === 'ONLINE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={formData.lessonType === 'ONLINE'}
                  required={formData.lessonType === 'OFFLINE'}
                >
                  <option value="">지역을 선택해주세요</option>
                  {formData.lessonType === 'ONLINE' ? (
                    <option value="온라인">온라인</option>
                  ) : (
                    Object.values(regions).map((region) => (
                      <option key={region} value={region}>
                        {getRegionText(region)}
                      </option>
                    ))
                  )}
                </select>
                {formErrors.region && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.region}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-800">
                  수업 장소
                </label>
                <div className="relative" ref={locationListRef}>
                  <button
                    id="locationId"
                    type="button"
                    onClick={handleToggleLocationList}
                    disabled={formData.lessonType === 'ONLINE'}
                    className={`w-full px-4 py-3 text-left border ${formErrors.locationId ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B9AF5] focus:border-transparent transition-all bg-white ${
                      formData.lessonType === 'ONLINE' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {formData.lessonType === 'ONLINE' ? '온라인' : formData.location || '장소를 선택하세요'}
                  </button>
                  {formErrors.locationId && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.locationId}</p>
                  )}
                  {showLocationList && formData.lessonType !== 'ONLINE' && (
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
                      ) : filteredLocations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          {formData.region ? '선택한 지역에 등록된 장소가 없습니다' : '장소 목록이 없습니다'}
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {filteredLocations.map((location) => (
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
                {selectedLocation && formData.lessonType !== 'ONLINE' && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-xl">
                    <div className="space-y-4">
                      <div id="map" className="w-full h-[300px] rounded-lg shadow-md" style={{ background: '#f8f9fa' }}></div>
                      <div className="flex items-center gap-4 bg-white p-4 rounded-lg">
                        <span className="text-base font-semibold text-gray-800 whitespace-nowrap">장소명 :</span>
                        <span className="text-base font-medium text-gray-900 truncate">{selectedLocation.locationName}</span>
                        {selectedLocation.serviceUrl && (
                          <a
                            href={selectedLocation.serviceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center px-4 py-2 bg-[#1B9AF5] text-white rounded-lg hover:bg-[#1B9AF5]/90 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            서비스 바로가기
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-[#1B9AF5] rounded-xl hover:bg-[#1B9AF5]/90 transition-colors"
              >
                수업 수정하기
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditLessonPage; 