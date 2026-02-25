// Psychometric API Service
import { psychometricApi, handleApiError } from './api';

export interface GenerateQuestionsDto {
  model: string;
  count?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface PsychometricQuestion {
  _id: string;
  questionText: string;
  trait: string;
  difficulty: string;
  factorLoading?: number;
  culturalSensitivity?: string;
  biasRisk?: string;
  validatedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalystReviewDto {
  questionId: string;
  analystId: string;
  factorLoading?: number;
  culturalSensitivity?: string;
  biasRisk?: string;
}

export interface GenerateQuestionsResponse {
  message: string;
  generatedQuestions?: PsychometricQuestion[];
}

export const psychometricAdminApi = {
  /**
   * Generate new psychometric questions using AI (Admin only)
   */
  generateQuestions: async (data: GenerateQuestionsDto): Promise<GenerateQuestionsResponse> => {
    try {
      const response = await psychometricApi.post<GenerateQuestionsResponse>(
        '/api/admin/ai/generate-questions',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Review and validate a psychometric question (Admin only)
   */
  reviewQuestion: async (data: AnalystReviewDto): Promise<{ status: string }> => {
    try {
      const response = await psychometricApi.post<{ status: string }>(
        '/api/admin/questions/review',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get available traits/models for question generation
   */
  getAvailableTraits: (): string[] => {
    return [
      'openness',
      'conscientiousness',
      'extraversion',
      'agreeableness',
      'neuroticism',
      'emotional_intelligence',
      'leadership',
      'teamwork',
      'problem_solving',
      'creativity',
      'adaptability',
      'communication',
    ];
  },

  /**
   * Get difficulty levels
   */
  getDifficultyLevels: (): Array<{ value: string; label: string }> => {
    return [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' },
    ];
  },
};
