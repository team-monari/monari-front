import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import ConfirmationModal from '@/components/ConfirmationModal';

interface Enrollment {
  name: string;
  schoolName: string | null;
  schoolLevel: string | null;
  grade: number | null;
  status: 'REQUESTED' | 'COMPLETED' | 'REFUNDED' | 'PENDING';
  finalPrice: number;
  createDateTime: string;
  publicId: string;
}

const LessonPayments = () => {
  const router = useRouter();
  const { id } = router.query;
  const { accessToken } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    studentName: string;
    publicId: string;
    newStatus: Enrollment['status'];
  } | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!id || !accessToken) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('수강생 목록을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setEnrollments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [id, accessToken]);

  const handleStatusChange = async (publicId: string, newStatus: Enrollment['status']) => {
    if (!id || !accessToken || !publicId) {
      setToast({ message: '잘못된 요청입니다.', type: 'error' });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/${id}/${publicId}/${newStatus}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('상태 변경에 실패했습니다.');
      }

      // 상태 변경 후 목록 새로고침
      const updatedEnrollments = enrollments.map(enrollment => 
        enrollment.publicId === publicId 
          ? { ...enrollment, status: newStatus }
          : enrollment
      );
      setEnrollments(updatedEnrollments);
      setToast({ message: '상태가 성공적으로 변경되었습니다.', type: 'success' });
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.', 
        type: 'error' 
      });
    }
  };

  const getStatusColor = (status: Enrollment['status']) => {
    switch (status) {
      case 'REQUESTED':
        return 'bg-blue-100 text-blue-600';
      case 'COMPLETED':
        return 'bg-green-100 text-green-600';
      case 'REFUNDED':
        return 'bg-red-100 text-red-600';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: Enrollment['status']) => {
    switch (status) {
      case 'REQUESTED':
        return '신청됨';
      case 'COMPLETED':
        return '완료';
      case 'REFUNDED':
        return '환불됨';
      case 'PENDING':
        return '대기중';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B9AF5]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">수강생 관리</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                <span>신청됨</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-100"></div>
                <span>완료</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-100"></div>
                <span>환불됨</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
                <span>대기중</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.name} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{enrollment.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {enrollment.schoolName || '미입력'} {enrollment.grade ? `${enrollment.grade}학년` : ''}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.status)}`}>
                      {getStatusText(enrollment.status)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">수강료</span>
                      <span className="text-sm font-medium text-gray-900">
                        ₩{enrollment.finalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-500">신청 시간</span>
                      <span className="text-sm text-gray-500">
                        {new Date(enrollment.createDateTime).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태 변경</label>
                    <select
                      value={enrollment.status}
                      onChange={(e) => {
                        if (!enrollment.publicId) {
                          setToast({ message: '잘못된 요청입니다.', type: 'error' });
                          return;
                        }
                        setConfirmationModal({
                          isOpen: true,
                          studentName: enrollment.name,
                          publicId: enrollment.publicId,
                          newStatus: e.target.value as Enrollment['status']
                        });
                      }}
                      className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-[#1B9AF5] focus:border-[#1B9AF5]"
                    >
                      <option value="REQUESTED">신청됨</option>
                      <option value="COMPLETED">완료</option>
                      <option value="REFUNDED">환불됨</option>
                      <option value="PENDING">대기중</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {enrollments.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">수강생이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">아직 수강 신청한 학생이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          title="상태 변경 확인"
          message={`${confirmationModal.studentName} 학생의 상태를 "${getStatusText(confirmationModal.newStatus)}"로 변경하시겠습니까?`}
          onConfirm={() => {
            handleStatusChange(confirmationModal.publicId, confirmationModal.newStatus);
            setConfirmationModal(null);
          }}
          onCancel={() => setConfirmationModal(null)}
        />
      )}
    </div>
  );
};

export default LessonPayments; 