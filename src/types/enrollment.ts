export enum EnrollmentStatus {
  REQUESTED = 'REQUESTED',           // 수강신청 → 결제 요청
  COMPLETED = 'COMPLETED',           // 수강 확정됨
  REFUND_REQUESTED = 'REFUND_REQUESTED',    // 환불 요청됨 (학생 또는 선생님 확인 대기)
  REFUNDED = 'REFUNDED',            // 환불 완료 처리됨
  CANCELLED = 'CANCELLED',           // 학생이 신청을 직접 취소함
  PENDING = 'PENDING'              // 신청은 했지만 아직 미결제 상태
}

export interface Enrollment {
  name: string;
  schoolName: string | null;
  schoolLevel: string | null;
  grade: number | null;
  status: EnrollmentStatus;
  finalPrice: number;
  createDateTime: string;
  publicId: string;
} 