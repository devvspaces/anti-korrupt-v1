import { apiClient } from './client';
import {
  Video,
  Quiz,
  Flashcard,
  Slides,
  Infographic,
  Report,
  AudioFile,
  Game,
} from '../types/api';

export const resourcesApi = {
  getVideo: async (resourceId: number): Promise<Video> => {
    const response = await apiClient.get<Video>(`/resources/videos/${resourceId}`);
    return response.data;
  },

  getQuiz: async (resourceId: number): Promise<Quiz> => {
    const response = await apiClient.get<Quiz>(`/resources/quizzes/${resourceId}`);
    return response.data;
  },

  getFlashcards: async (resourceId: number): Promise<Flashcard[]> => {
    const response = await apiClient.get<Flashcard[]>(`/resources/flashcards/${resourceId}`);
    return response.data;
  },

  getSlides: async (resourceId: number): Promise<Slides> => {
    const response = await apiClient.get<Slides>(`/resources/slides/${resourceId}`);
    return response.data;
  },

  getInfographics: async (resourceId: number): Promise<Infographic[]> => {
    const response = await apiClient.get<Infographic[]>(`/resources/infographics/${resourceId}`);
    return response.data;
  },

  getReports: async (resourceId: number): Promise<Report[]> => {
    const response = await apiClient.get<Report[]>(`/resources/reports/${resourceId}`);
    return response.data;
  },

  getAudio: async (resourceId: number): Promise<AudioFile[]> => {
    const response = await apiClient.get<AudioFile[]>(`/resources/audio/${resourceId}`);
    return response.data;
  },

  getGame: async (resourceId: number): Promise<Game> => {
    const response = await apiClient.get<Game>(`/resources/games/${resourceId}`);
    return response.data;
  },
};
