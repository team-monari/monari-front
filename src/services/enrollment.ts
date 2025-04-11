import axios from 'axios';

interface EnrollmentCreateRequest {
  lessonId: number;
}

export const createEnrollment = async (lessonId: number): Promise<string> => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1/enrollments',
      { lessonId },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating enrollment:', error);
    throw error;
  }
}; 