import { apiClient } from './client';
import { QuizQuestion, QuizAttemptRequest, QuizAttemptResponse } from '../types/api';

export const quizApi = {
  getQuestions: async (quizId: number): Promise<QuizQuestion[]> => {
    const response = await apiClient.get<QuizQuestion[]>(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  submitAttempt: async (
    quizId: number,
    answers: QuizAttemptRequest
  ): Promise<QuizAttemptResponse> => {
    const response = await apiClient.post<QuizAttemptResponse>(
      `/quizzes/${quizId}/attempts`,
      answers
    );
    return response.data;
  },

  getAttempts: async (quizId: number): Promise<any[]> => {
    const response = await apiClient.get(`/quizzes/${quizId}/attempts`);
    return response.data;
  },
};
