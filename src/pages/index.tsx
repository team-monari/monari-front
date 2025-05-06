import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/router";
import FilterSection from "../components/FilterSection";
import LessonCard from "../components/LessonCard";
import StudyCard from "../components/StudyCard";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { Region, regionToKorean } from "../utils/region";
import { generalLocationApi, GeneralLocation } from "../services/generalLocation";
import { locationApi, Location } from "../services/location";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChatBot from "../components/ChatBot";

// Add type declaration for react-slick
declare module "react-slick";

interface Study {
  id: number;
  title: string;
  description: string;
  subject: "MATH" | "ENGLISH" | "KOREAN" | "SCIENCE" | "SOCIETY";
  schoolLevel: "MIDDLE" | "HIGH";
  status: "ACTIVE" | "CLOSED";
  createdAt: string;
  studentPublicId: string;
  studentName: string;
  region: Region;
  generalLocationId: number | null;
  locationId: number | null;
  studyType: 'ONLINE' | 'OFFLINE';
}

interface Lesson {
  lessonId: number;
  locationId: number;
  teacherId: number;
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
  schoolLevel: string;
  subject: string;
  lessonType: "ONLINE" | "OFFLINE";
}

interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

const getSubjectLabel = (subject: Study["subject"]) => {
  switch (subject) {
    case "MATH":
      return "수학";
    case "ENGLISH":
      return "영어";
    case "KOREAN":
      return "국어";
    case "SCIENCE":
      return "과학";
    case "SOCIETY":
      return "사회";
    default:
      return subject;
  }
};

const getStatusLabel = (status: Study["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "모집중";
    case "CLOSED":
      return "모집완료";
    default:
      return status;
  }
};

const getStatusColor = (status: Study["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "bg-yellow-100 text-yellow-600";
    case "CLOSED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Home = () => {
  const router = useRouter();
  const { accessToken, checkTokenValidity } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [locationDetails, setLocationDetails] = useState<Record<number, GeneralLocation>>({});
  const [studyLocations, setStudyLocations] = useState<Record<number, Location>>({});

  // 페이지 로드 시 토큰 유효성 검사
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (accessToken) {
          await checkTokenValidity();
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
      } finally {
        setTokenChecked(true);
      }
    };

    validateToken();
  }, [accessToken, checkTokenValidity]);

  const getLocationName = (study: Study): string | null => {
    if (study.generalLocationId && locationDetails[study.generalLocationId]) {
      return locationDetails[study.generalLocationId].locationName;
    }
    if (study.locationId && studyLocations[study.locationId]) {
      return studyLocations[study.locationId].locationName;
    }
    return null;
  };

  // API 호출 함수
  const fetchStudies = async () => {
    // 토큰 검사가 완료되지 않았으면 기다림
    if (accessToken && !tokenChecked) return;

    setIsLoading(true);
    setError(null);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/studies`);
      url.searchParams.append("pageSize", "6"); // 메인 페이지에는 6개 표시

      const headers: HeadersInit = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
        throw new Error("스터디 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setStudies(data.content);

      // Fetch location details for offline studies
      const locationPromises = data.content
        .filter((study: Study) => study.studyType === 'OFFLINE')
        .map(async (study: Study) => {
          if (study.generalLocationId && !locationDetails[study.generalLocationId]) {
            try {
              const location = await generalLocationApi.getLocation(study.generalLocationId);
              setLocationDetails(prev => ({
                ...prev,
                [study.generalLocationId!]: location
              }));
            } catch (err) {
              console.error('Failed to fetch general location details:', err);
            }
          } else if (study.locationId && !studyLocations[study.locationId]) {
            try {
              const location = await locationApi.getLocation(study.locationId);
              setStudyLocations(prev => ({
                ...prev,
                [study.locationId!]: location
              }));
            } catch (err) {
              console.error('Failed to fetch location details:', err);
            }
          }
        });

      await Promise.all(locationPromises);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "스터디 목록을 불러오는데 실패했습니다."
      );
      setStudies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 수업 목록 가져오기
  const fetchLessons = async () => {
    // 토큰 검사가 완료되지 않았으면 기다림
    if (accessToken && !tokenChecked) return;

    setIsLessonsLoading(true);
    setLessonsError(null);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons`);
      url.searchParams.append("pageSize", "10"); // 취소된 수업을 고려하여 더 많은 수업을 가져옴

      const headers: HeadersInit = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        headers,
      });

      if (!response.ok) {
        // 만약 401 에러가 발생하면 (토큰 만료 가능성)
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
        throw new Error("수업 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      // CANCELED 상태의 수업은 제외하고 최대 6개까지만 표시
      const filteredLessons = data.content
        .filter((lesson: Lesson) => lesson.status !== "CANCELED")
        .slice(0, 6);
      setLessons(filteredLessons);
    } catch (err) {
      setLessonsError(
        err instanceof Error
          ? err.message
          : "수업 목록을 불러오는데 실패했습니다."
      );
      setLessons([]);
    } finally {
      setIsLessonsLoading(false);
    }
  };

  useEffect(() => {
    // 토큰 검사가 완료되거나, 토큰이 없는 경우 API 호출
    if (tokenChecked || !accessToken) {
      fetchStudies();
      fetchLessons();
    }
  }, [tokenChecked, accessToken]);

  // 로그인 성공 확인 및 알림 표시
  useEffect(() => {
    // 로컬 스토리지에서 로그인 성공 플래그 확인
    const loginSuccess = localStorage.getItem("login_success");
    const userType = localStorage.getItem("login_user_type");

    if (loginSuccess === "true" && userType) {
      // 로그인 성공 알림 표시 - 작게, 중앙 상단에 표시
      Swal.fire({
        icon: "success",
        title: "로그인 성공",
        text: `${
          userType === "STUDENT" ? "학생" : "선생님"
        }으로 로그인되었습니다`,
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: "auto",
        padding: "0.5em",
        customClass: {
          container: "z-50",
          popup: "p-2",
          title: "text-sm font-medium",
          htmlContainer: "text-xs",
        },
      });

      // 플래그 제거 (중복 알림 방지)
      localStorage.removeItem("login_success");
      localStorage.removeItem("login_user_type");
    }
  }, []);

  const handleCreateLesson = () => {
    router.push("/create-lesson");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>모나리 - 공부의 문턱을 낮추다</title>
        <meta
          name="description"
          content="학생과 선생님을 위한 스터디 & 과외 매칭 서비스"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
        <section className="text-center mb-16">
          <br></br>
          <br></br>
          <h1 className="text-3xl font-bold mb-4">
            공부의 문턱을 낮추다, 모나리
          </h1>
          <p className="text-gray-600 mb-8">
            배움에 필요한 모든 것을 합리적인 가격으로 완성하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/lessons"
              className="bg-[#1B9AF5] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1B9AF5]/90"
            >
              수업 찾기
            </Link>
            <Link
              href="/aboutus"
              className="text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50"
            >
              더 알아보기
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">학생 모집</h2>
            <Link
              href="/lessons"
              className="flex items-center gap-1 text-[#1B9AF5] hover:text-[#1B9AF5]/80 transition-colors"
            >
              <span>더보기</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {isLessonsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AF5]"></div>
            </div>
          ) : lessonsError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {lessonsError}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.lessonId}
                  lessonId={lesson.lessonId}
                  title={lesson.title}
                  description={lesson.description}
                  subject={lesson.subject}
                  schoolLevel={lesson.schoolLevel}
                  minStudent={lesson.minStudent}
                  maxStudent={lesson.maxStudent}
                  currentStudent={lesson.currentStudent}
                  amount={lesson.amount}
                  startDate={lesson.startDate}
                  endDate={lesson.endDate}
                  status={lesson.status}
                  lessonType={lesson.lessonType}
                />
              ))}
            </div>
          )}
        </section>

        {/* Banner Slider Section */}
        <section className="mb-16">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={2}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            arrows={true}
            className="banner-slider"
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ]}
          >
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="relative h-[300px] px-3">
                <img
                  src={`/images/main/${num}.png`}
                  alt={`Banner ${num}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </Slider>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">스터디 팀원 모집</h2>
            <Link
              href="/studies"
              className="flex items-center gap-1 text-[#1B9AF5] hover:text-[#1B9AF5]/80 transition-colors"
            >
              <span>더보기</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AF5]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies.map((study) => (
                <StudyCard
                  key={study.id}
                  study={study}
                  locationName={getLocationName(study)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-8">WE MAKE POSSIBLE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-[#1B9AF5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1B9AF5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">팀 매칭</h3>
              <p className="text-gray-600">
                같은 목표를 가진 학습 동료를 쉽게 찾아보세요
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#1B9AF5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1B9AF5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">성장의 매칭</h3>
              <p className="text-gray-600">전문적인 선생님과 함께 성장하세요</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#1B9AF5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1B9AF5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">공간 대관</h3>
              <p className="text-gray-600">
                편리한 학습 공간을 합리적인 가격에 이용하세요
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-24 text-center text-sm text-gray-500">
          <p>© 2025 모나리. All rights reserved.</p>
          <p className="mt-2">이용약관 | 개인정보처리방침</p>
        </footer>
      </main>

      {/* 챗봇 컴포넌트 추가 */}
      <ChatBot />
    </div>
  );
};

export default Home;
