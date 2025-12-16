import { apiClient } from './client';
import { LoginResponse, User } from '../types/api';

export const authApi = {
  login: async (lastName: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { lastName });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
