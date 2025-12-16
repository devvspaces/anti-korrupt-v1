import { apiClient } from './client';
import { Module, SearchResult } from '../types/api';

export const modulesApi = {
  getAll: async (): Promise<Module[]> => {
    const response = await apiClient.get<Module[]>('/modules');
    return response.data;
  },

  getById: async (id: number): Promise<Module> => {
    const response = await apiClient.get<Module>(`/modules/${id}`);
    return response.data;
  },

  search: async (moduleId: number, query: string): Promise<SearchResult[]> => {
    const response = await apiClient.get<SearchResult[]>(`/modules/${moduleId}/search`, {
      params: { q: query },
    });
    return response.data;
  },
};
