import { apiClient } from './client';
import { UserProgress } from '../types/api';

export const progressApi = {
  getUserProgress: async (): Promise<UserProgress> => {
    const response = await apiClient.get<UserProgress>('/users/me/progress');
    return response.data;
  },
};
