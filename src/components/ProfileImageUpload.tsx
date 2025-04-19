import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProfileImageUploadProps {
  currentImageUrl: string | null;
  onImageUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  onImageUpload,
  isLoading: externalLoading = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 현재 로딩 상태 (내부 상태 + 외부 props)
  const isCurrentlyLoading = isUploading || externalLoading;

  // currentImageUrl이 변경될 때 previewUrl도 업데이트
  useEffect(() => {
    console.log("ProfileImageUpload: currentImageUrl 변경", currentImageUrl);
    if (currentImageUrl !== previewUrl && !isUploading) {
      setPreviewUrl(currentImageUrl);
      setImageError(false); // 새 이미지 URL로 오류 상태 초기화
    }
  }, [currentImageUrl, isUploading, previewUrl]);

  // 컴포넌트 언마운트 시 Blob URL 정리
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 생성한 로컬 blob URL 정리
      if (
        previewUrl &&
        previewUrl.startsWith("blob:") &&
        previewUrl !== currentImageUrl
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, currentImageUrl]);

  const handleImageClick = () => {
    if (!isCurrentlyLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 파일 선택 직후 미리보기 이미지 생성 (사용자에게 즉시 피드백)
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      setImageError(false);

      // 업로드 중 상태로 변경
      setIsUploading(true);

      // 부모 컴포넌트의 업로드 함수 호출
      await onImageUpload(file);

      // 업로드 완료 후 상태 초기화
      setIsUploading(false);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setIsUploading(false);

      // 업로드 실패 시 원래 이미지로 복원
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(currentImageUrl);

      // 사용자에게 오류 알림은 상위 컴포넌트에서 처리
    } finally {
      // 파일 입력 초기화 (동일한 파일 재선택 허용)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 이미지 로드 오류 처리
  const handleImageError = () => {
    console.error("ProfileImageUpload: 이미지 로드 실패 - URL:", previewUrl);
    setImageError(true);
  };

  return (
    <div
      className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-lg cursor-pointer"
      onClick={handleImageClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isCurrentlyLoading}
      />

      {/* 이미지 또는 기본 아바타 표시 */}
      {previewUrl && !imageError ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={previewUrl}
            alt="프로필 이미지"
            fill
            className="object-cover"
            priority
            onError={handleImageError}
            unoptimized // Next.js 이미지 최적화 비활성화 (blob URL 사용 시 필요)
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}

      {/* 호버 시 오버레이 표시 */}
      {isHovering && !isCurrentlyLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      )}

      {/* 업로드 중 로딩 표시 */}
      {isCurrentlyLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
