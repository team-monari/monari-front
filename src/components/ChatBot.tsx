import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// 챗봇 메시지 타입 정의
interface ChatMessage {
  type: "bot" | "user";
  content: string;
  buttons?: { id: string; text: string }[];
  chartType?: "bar" | "line" | "pie";
  chartData?: any;
}

// 메인 메뉴 버튼 정의
const MAIN_MENU_BUTTONS = [
  { id: "overview", text: "1. 사교육비 전체 개요 보기" },
  { id: "school-level", text: "2. 학교급별 사교육비 보기" },
  { id: "region", text: "3. 지역별 사교육비 보기" },
  { id: "subject", text: "4. 과목별 사교육비 보기" },
  { id: "year-comparison", text: "5. 2023년 대비 2024년 변화 보기" },
];

// 학교급 버튼 정의
const SCHOOL_LEVEL_BUTTONS = [
  { id: "elementary", text: "초등학교" },
  { id: "middle", text: "중학교" },
  { id: "high", text: "고등학교" },
];

// 지역 버튼 정의
const REGION_BUTTONS = [
  { id: "seoul", text: "서울" },
  { id: "gyeonggi", text: "경기" },
  { id: "daegu", text: "대구" },
  { id: "busan", text: "부산" },
  { id: "metropolitan", text: "광역시(광주·대전 등)" },
  { id: "small-city", text: "중소도시" },
  { id: "rural", text: "읍면지역" },
];

// 과목 버튼 정의
const SUBJECT_BUTTONS = [
  { id: "math", text: "수학" },
  { id: "english", text: "영어" },
  { id: "korean", text: "국어" },
  { id: "social-science", text: "사회·과학" },
  { id: "art-hobby", text: "예체능·취미교양" },
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentState, setCurrentState] = useState<string>("initial");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 챗봇 토글 함수
  const toggleChatBot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // 첫 열기일 경우 초기 인사말 표시
      showInitialGreeting();
    }
  };

  // 스크롤을 항상 아래로 유지
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 초기 인사말 표시
  const showInitialGreeting = () => {
    setMessages([
      {
        type: "bot",
        content:
          "안녕하세요! 사교육비 데이터 가이드 챗봇입니다.\n\n궁금한 항목을 선택해 주세요.",
        buttons: MAIN_MENU_BUTTONS,
      },
    ]);
    setCurrentState("main-menu");
  };

  // 메시지 추가 함수
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  // 버튼 클릭 처리 함수
  const handleButtonClick = (buttonId: string) => {
    // 사용자 선택 메시지 추가
    const selectedButton = findButtonById(buttonId);
    if (selectedButton) {
      addMessage({
        type: "user",
        content: selectedButton.text,
      });
    }

    // "메인 메뉴로 돌아가기" 버튼은 상태와 관계없이 항상 처리
    if (buttonId === "main-menu") {
      showMainMenu();
      return;
    }

    // "다른 학교급 보기" 버튼은 상태와 관계없이 항상 처리
    if (buttonId === "other-school") {
      showSchoolLevelOptions();
      return;
    }

    // "다른 지역 보기" 버튼은 상태와 관계없이 항상 처리
    if (buttonId === "other-region") {
      showRegionOptions();
      return;
    }

    // "다른 과목 보기" 버튼은 상태와 관계없이 항상 처리
    if (buttonId === "other-subject") {
      showSubjectOptions();
      return;
    }

    // 현재 상태에 따라 다른 응답 처리
    switch (currentState) {
      case "main-menu":
        handleMainMenuSelection(buttonId);
        break;
      case "school-level":
        handleSchoolLevelSelection(buttonId);
        break;
      case "region":
        handleRegionSelection(buttonId);
        break;
      case "subject":
        handleSubjectSelection(buttonId);
        break;
      case "subject-school":
        handleSubjectSchoolSelection(buttonId);
        break;
      default:
        // 여기에는 특별한 처리가 필요없음 (모든 네비게이션 버튼이 위에서 처리됨)
        break;
    }
  };

  // 버튼 ID로 버튼 찾기
  const findButtonById = (buttonId: string) => {
    const allButtons = [
      ...MAIN_MENU_BUTTONS,
      ...SCHOOL_LEVEL_BUTTONS,
      ...REGION_BUTTONS,
      ...SUBJECT_BUTTONS,
      { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      { id: "other-school", text: "다른 학교급 보기" },
      { id: "other-region", text: "다른 지역 보기" },
      { id: "other-subject", text: "다른 과목 보기" },
    ];
    return allButtons.find((button) => button.id === buttonId);
  };

  // 메인 메뉴 선택 처리
  const handleMainMenuSelection = (buttonId: string) => {
    switch (buttonId) {
      case "overview":
        showOverview();
        break;
      case "school-level":
        showSchoolLevelOptions();
        break;
      case "region":
        showRegionOptions();
        break;
      case "subject":
        showSubjectOptions();
        break;
      case "year-comparison":
        showYearComparison();
        break;
    }
  };

  // 학교급 선택 처리
  const handleSchoolLevelSelection = (buttonId: string) => {
    switch (buttonId) {
      case "elementary":
        showElementarySchoolInfo();
        break;
      case "middle":
        showMiddleSchoolInfo();
        break;
      case "high":
        showHighSchoolInfo();
        break;
    }
  };

  // 지역 선택 처리
  const handleRegionSelection = (buttonId: string) => {
    switch (buttonId) {
      case "seoul":
        showSeoulInfo();
        break;
      // 다른 지역도 비슷한 방식으로 처리
      default:
        showGenericRegionInfo(buttonId);
        break;
    }
  };

  // 과목 선택 처리
  const handleSubjectSelection = (buttonId: string) => {
    setSelectedSubject(buttonId);
    setCurrentState("subject-school");
    addMessage({
      type: "bot",
      content: "학교급을 선택해 주세요.",
      buttons: SCHOOL_LEVEL_BUTTONS,
    });
  };

  // 과목-학교급 선택 처리
  const handleSubjectSchoolSelection = (buttonId: string) => {
    switch (selectedSubject) {
      case "math":
        showMathInfo(buttonId);
        break;
      case "english":
        showEnglishInfo(buttonId);
        break;
      case "korean":
        showKoreanInfo(buttonId);
        break;
      case "social-science":
        showSocialScienceInfo(buttonId);
        break;
      case "art-hobby":
        showArtHobbyInfo(buttonId);
        break;
    }
  };

  // 메인 메뉴 표시
  const showMainMenu = () => {
    addMessage({
      type: "bot",
      content:
        "안녕하세요! 사교육비 데이터 가이드 챗봇입니다.\n\n궁금한 항목을 선택해 주세요.",
      buttons: MAIN_MENU_BUTTONS,
    });
    setCurrentState("main-menu");
  };

  // 전체 개요 표시
  const showOverview = () => {
    addMessage({
      type: "bot",
      content: `전체 사교육비 현황을 안내해 드립니다.

- 2024년 전체 사교육비 총액: 29조 1,919억원
- 2024년 전체학생 1인당 월평균 사교육비: 47.4만원
- 2023년 대비 증가: +4.0만원 (증감률: 약 9.2%)`,
    });

    // 그래프 데이터 추가
    addMessage({
      type: "bot",
      content: "전체 사교육비 연도별 변동 그래프",
      chartType: "line",
      chartData: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        datasets: [
          {
            label: "1인당 월평균 사교육비(만원)",
            data: [32.1, 28.9, 35.3, 40.5, 43.4, 47.4],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
            fill: false,
          },
        ],
      },
      buttons: [{ id: "main-menu", text: "메인 메뉴로 돌아가기" }],
    });
  };

  // 학교급 옵션 표시
  const showSchoolLevelOptions = () => {
    addMessage({
      type: "bot",
      content: "학교급을 선택해 주세요.",
      buttons: SCHOOL_LEVEL_BUTTONS,
    });
    setCurrentState("school-level");
  };

  // 초등학교 정보 표시
  const showElementarySchoolInfo = () => {
    addMessage({
      type: "bot",
      content: `초등학교 전체 사교육비 현황입니다.

- 1인당 월평균 사교육비: 44.2만원
- 전체 초등학생 사교육비 총액: 13조 2,256억원

학년별 사교육비

- 초1: 37.7만원
- 초2: 43.1만원
- 초3: 46.6만원
- 초4: 46.2만원
- 초5: 47.7만원
- 초6: 42.8만원`,
    });

    // 그래프 데이터 추가
    addMessage({
      type: "bot",
      content: "📊 학년별 사교육비 그래프",
      chartType: "bar",
      chartData: {
        labels: ["초1", "초2", "초3", "초4", "초5", "초6"],
        datasets: [
          {
            label: "월평균 사교육비(만원)",
            data: [37.7, 43.1, 46.6, 46.2, 47.7, 42.8],
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderWidth: 1,
          },
        ],
      },
      buttons: [
        { id: "other-school", text: "다른 학교급 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 중학교 정보 표시
  const showMiddleSchoolInfo = () => {
    addMessage({
      type: "bot",
      content: `중학교 전체 사교육비 현황입니다.

- 1인당 월평균 사교육비: 49.0만원
- 전체 중학생 사교육비 총액: 8조 3,821억원

학년별 사교육비

- 중1: 46.2만원
- 중2: 49.5만원
- 중3: 51.3만원`,
    });

    // 그래프 데이터 추가
    addMessage({
      type: "bot",
      content: "📊 학년별 사교육비 그래프",
      chartType: "bar",
      chartData: {
        labels: ["중1", "중2", "중3"],
        datasets: [
          {
            label: "월평균 사교육비(만원)",
            data: [46.2, 49.5, 51.3],
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderWidth: 1,
          },
        ],
      },
      buttons: [
        { id: "other-school", text: "다른 학교급 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 고등학교 정보 표시
  const showHighSchoolInfo = () => {
    addMessage({
      type: "bot",
      content: `고등학교 전체 사교육비 현황입니다.

- 1인당 월평균 사교육비: 52.0만원
- 전체 고등학생 사교육비 총액: 7조 5,842억원

학년별 사교육비

- 고1: 49.8만원
- 고2: 51.2만원
- 고3: 55.0만원`,
    });

    // 그래프 데이터 추가
    addMessage({
      type: "bot",
      content: "📊 학년별 사교육비 그래프",
      chartType: "bar",
      chartData: {
        labels: ["고1", "고2", "고3"],
        datasets: [
          {
            label: "월평균 사교육비(만원)",
            data: [49.8, 51.2, 55.0],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderWidth: 1,
          },
        ],
      },
      buttons: [
        { id: "other-school", text: "다른 학교급 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 지역 옵션 표시
  const showRegionOptions = () => {
    addMessage({
      type: "bot",
      content: "지역을 선택해 주세요.",
      buttons: REGION_BUTTONS,
    });
    setCurrentState("region");
  };

  // 서울 정보 표시
  const showSeoulInfo = () => {
    addMessage({
      type: "bot",
      content: `서울 지역 사교육비 현황입니다.

- 초등학교: 60.9만원
- 중학교: 69.1만원
- 고등학교: 69.6만원

특이사항

- 전국 평균 대비 약 +22만원 높은 수준`,
    });

    // 그래프 데이터 추가
    addMessage({
      type: "bot",
      content: "서울 vs 전국 비교 그래프",
      chartType: "bar",
      chartData: {
        labels: ["초등학교", "중학교", "고등학교"],
        datasets: [
          {
            label: "서울 (만원)",
            data: [60.9, 69.1, 69.6],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "전국 평균 (만원)",
            data: [44.2, 49.0, 52.0],
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
        ],
      },
      buttons: [
        { id: "other-region", text: "다른 지역 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 다른 지역 정보 표시 (일반적인 형태)
  const showGenericRegionInfo = (regionId: string) => {
    // 지역명 가져오기
    const regionButton = REGION_BUTTONS.find((btn) => btn.id === regionId);
    const regionName = regionButton ? regionButton.text : "선택된 지역";

    // 지역별 데이터 (예시 데이터)
    const regionData: { [key: string]: number[] } = {
      gyeonggi: [50.3, 55.8, 58.2],
      daegu: [40.1, 45.5, 47.8],
      busan: [38.9, 44.2, 46.5],
      metropolitan: [39.8, 44.9, 48.1],
      "small-city": [35.2, 41.5, 43.9],
      rural: [29.8, 35.7, 38.2],
    };

    // 선택된 지역의 데이터 또는 기본 데이터
    const data = regionData[regionId] || [42.1, 46.2, 48.3];

    addMessage({
      type: "bot",
      content: `${regionName} 지역 사교육비 현황입니다.

- 초등학교: ${data[0]}만원
- 중학교: ${data[1]}만원
- 고등학교: ${data[2]}만원

특이사항

- 전국 평균 대비 약 ${((data[0] + data[1] + data[2]) / 3 - 47.4).toFixed(
        1
      )}만원 ${
        (data[0] + data[1] + data[2]) / 3 > 47.4 ? "높은" : "낮은"
      } 수준`,
    });

    // 그래프 데이터 추가
    addMessage({
      type: "bot",
      content: `📊 ${regionName} vs 전국 비교 그래프`,
      chartType: "bar",
      chartData: {
        labels: ["초등학교", "중학교", "고등학교"],
        datasets: [
          {
            label: `${regionName} (만원)`,
            data: data,
            backgroundColor: "rgba(255, 159, 64, 0.5)",
          },
          {
            label: "전국 평균 (만원)",
            data: [44.2, 49.0, 52.0],
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
        ],
      },
      buttons: [
        { id: "other-region", text: "다른 지역 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 과목 옵션 표시
  const showSubjectOptions = () => {
    addMessage({
      type: "bot",
      content: "과목을 선택해 주세요.",
      buttons: SUBJECT_BUTTONS,
    });
    setCurrentState("subject");
  };

  // 수학 정보 표시
  const showMathInfo = (schoolLevel: string) => {
    if (schoolLevel === "middle") {
      addMessage({
        type: "bot",
        content: `중학교 수학 사교육비 현황입니다.

- 중1: 17.3만원
- 중2: 18.8만원
- 중3: 19.4만원`,
      });

      // 그래프 데이터 추가
      addMessage({
        type: "bot",
        content: "학년별 수학 사교육비 그래프",
        chartType: "bar",
        chartData: {
          labels: ["중1", "중2", "중3"],
          datasets: [
            {
              label: "월평균 사교육비(만원)",
              data: [17.3, 18.8, 19.4],
              backgroundColor: "rgba(153, 102, 255, 0.5)",
            },
          ],
        },
        buttons: [
          { id: "other-subject", text: "다른 과목 보기" },
          { id: "main-menu", text: "메인 메뉴로 돌아가기" },
        ],
      });
    } else if (schoolLevel === "elementary") {
      addMessage({
        type: "bot",
        content: `초등학교 수학 사교육비 현황입니다.

- 초1: 12.1만원
- 초2: 13.6만원
- 초3: 14.8만원
- 초4: 15.2만원
- 초5: 16.1만원
- 초6: 16.5만원`,
      });

      // 그래프 데이터 추가
      addMessage({
        type: "bot",
        content: "학년별 수학 사교육비 그래프",
        chartType: "bar",
        chartData: {
          labels: ["초1", "초2", "초3", "초4", "초5", "초6"],
          datasets: [
            {
              label: "월평균 사교육비(만원)",
              data: [12.1, 13.6, 14.8, 15.2, 16.1, 16.5],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
          ],
        },
        buttons: [
          { id: "other-subject", text: "다른 과목 보기" },
          { id: "main-menu", text: "메인 메뉴로 돌아가기" },
        ],
      });
    } else {
      addMessage({
        type: "bot",
        content: `고등학교 수학 사교육비 현황입니다.

- 고1: 20.1만원
- 고2: 21.3만원
- 고3: 23.5만원`,
      });

      // 그래프 데이터 추가
      addMessage({
        type: "bot",
        content: "학년별 수학 사교육비 그래프",
        chartType: "bar",
        chartData: {
          labels: ["고1", "고2", "고3"],
          datasets: [
            {
              label: "월평균 사교육비(만원)",
              data: [20.1, 21.3, 23.5],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        },
        buttons: [
          { id: "other-subject", text: "다른 과목 보기" },
          { id: "main-menu", text: "메인 메뉴로 돌아가기" },
        ],
      });
    }
  };

  // 영어 정보 표시
  const showEnglishInfo = (schoolLevel: string) => {
    // 영어 데이터 표시 (수학과 유사한 방식)
    addMessage({
      type: "bot",
      content: `${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 영어 사교육비 현황입니다.
      
- ${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 평균: 15.7만원
- 전년 대비 증가율: +2.9만원

📊 학년별 영어 사교육비 그래프 제공`,
      buttons: [
        { id: "other-subject", text: "다른 과목 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 국어 정보 표시
  const showKoreanInfo = (schoolLevel: string) => {
    // 국어 데이터 표시
    addMessage({
      type: "bot",
      content: `${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 국어 사교육비 현황입니다.
      
- ${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 평균: 10.2만원
- 전년 대비 증가율: +3.6만원

📊 학년별 국어 사교육비 그래프 제공`,
      buttons: [
        { id: "other-subject", text: "다른 과목 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 사회과학 정보 표시
  const showSocialScienceInfo = (schoolLevel: string) => {
    // 사회과학 데이터 표시
    addMessage({
      type: "bot",
      content: `${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 사회·과학 사교육비 현황입니다.
      
- ${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 평균: 9.8만원
- 전년 대비 증가율: +2.3만원

📊 학년별 사회·과학 사교육비 그래프 제공`,
      buttons: [
        { id: "other-subject", text: "다른 과목 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 예체능 정보 표시
  const showArtHobbyInfo = (schoolLevel: string) => {
    // 예체능 데이터 표시
    addMessage({
      type: "bot",
      content: `${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 예체능·취미교양 사교육비 현황입니다.
      
- ${
        schoolLevel === "elementary"
          ? "초등학교"
          : schoolLevel === "middle"
          ? "중학교"
          : "고등학교"
      } 평균: 12.5만원
- 전년 대비 증가율: +1.8만원

📊 학년별 예체능·취미교양 사교육비 그래프 제공`,
      buttons: [
        { id: "other-subject", text: "다른 과목 보기" },
        { id: "main-menu", text: "메인 메뉴로 돌아가기" },
      ],
    });
  };

  // 연간 비교 표시
  const showYearComparison = () => {
    addMessage({
      type: "bot",
      content: `2023년 대비 2024년 사교육비 변화를 안내해 드립니다.

- 전체 1인당 사교육비 증가: +4.0만원 (43.4 → 47.4만원)
- 초등학교: +4.4만원 증가 (39.8 → 44.2만원)
- 중학교: +4.1만원 증가 (44.9 → 49.0만원)
- 고등학교: +2.9만원 증가 (49.1 → 52.0만원)

과목별 변화

- 수학: +5.1만원
- 영어: +2.9만원
- 국어: +3.6만원`,
    });

    // 그래프 데이터 추가
    addMessage({
      type: "bot",
      content: "📊 2023–2024 비교 그래프",
      chartType: "bar",
      chartData: {
        labels: ["전체", "초등학교", "중학교", "고등학교"],
        datasets: [
          {
            label: "2023년 (만원)",
            data: [43.4, 39.8, 44.9, 49.1],
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "2024년 (만원)",
            data: [47.4, 44.2, 49.0, 52.0],
            backgroundColor: "rgba(153, 102, 255, 0.5)",
          },
        ],
      },
      buttons: [{ id: "main-menu", text: "메인 메뉴로 돌아가기" }],
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 챗봇 아이콘 */}
      <button
        onClick={toggleChatBot}
        className="bg-[#1B9AF5] p-3 rounded-full shadow-lg hover:bg-[#1B9AF5]/90 transition-colors focus:outline-none"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* 챗봇 창 */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* 챗봇 헤더 */}
          <div className="bg-[#1B9AF5] text-white p-4 rounded-t-lg">
            <h3 className="font-bold">사교육비 데이터 가이드</h3>
            <p className="text-xs opacity-80">
              최신 사교육비 통계 정보를 안내해 드립니다.
            </p>
          </div>

          {/* 챗봇 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-[#1B9AF5] text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>

                  {/* 차트 표시 영역 */}
                  {message.chartType && message.chartData && (
                    <div className="mt-3 bg-white p-2 rounded">
                      {message.chartType === "bar" && (
                        <Bar
                          data={message.chartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: "top" as const,
                              },
                            },
                          }}
                        />
                      )}
                      {message.chartType === "line" && (
                        <Line
                          data={message.chartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: "top" as const,
                              },
                            },
                          }}
                        />
                      )}
                      {message.chartType === "pie" && (
                        <Pie
                          data={message.chartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: "top" as const,
                              },
                            },
                          }}
                        />
                      )}
                    </div>
                  )}

                  {message.buttons && (
                    <div className="mt-3 space-y-2">
                      {message.buttons.map((button) => (
                        <button
                          key={button.id}
                          onClick={() => handleButtonClick(button.id)}
                          className="block w-full text-left px-3 py-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm transition-colors"
                        >
                          {button.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 챗봇 푸터 */}
          <div className="p-3 border-t border-gray-200 text-center text-xs text-gray-500">
            사교육비 데이터는 통계청 자료 기준입니다. (2024년)
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
