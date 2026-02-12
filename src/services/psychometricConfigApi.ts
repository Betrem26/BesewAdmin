import { psychometricApi } from './api';

export interface PsychometricConfiguration {
  _id?: string;
  version: string;
  lastModified: Date;
  modifiedBy: string;
  isActive: boolean;
  validity: ValidityConfiguration;
  interpretation: InterpretationConfiguration;
  reliability: ReliabilityConfiguration;
  normativeData: NormativeDataConfiguration;
  questionBank: QuestionBankConfiguration;
  scoring: ScoringConfiguration;
  reporting: ReportingConfiguration;
}

export interface ValidityConfiguration {
  minCompletionRate: number;
  minQuestionsPerTrait: number;
  validityScoreThresholds: {
    invalid: number;
    questionable: number;
    acceptable: number;
  };
  inconsistency: {
    enabled: boolean;
    maxStandardDeviation: number;
    minItemsForCheck: number;
  };
  acquiescence: {
    enabled: boolean;
    maxAgreeRate: number;
    minResponsesForCheck: number;
  };
  extremeResponse: {
    enabled: boolean;
    maxExtremeRate: number;
    minResponsesForCheck: number;
  };
  randomResponse: {
    enabled: boolean;
    maxAlternatingRate: number;
    maxSameResponseRate: number;
    minResponsesForCheck: number;
  };
  socialDesirability: {
    enabled: boolean;
    highScoreThreshold: number;
    traitsToCheck: string[];
  };
}

export interface InterpretationConfiguration {
  bands: {
    veryLow: { min: number; max: number; label: string };
    low: { min: number; max: number; label: string };
    average: { min: number; max: number; label: string };
    high: { min: number; max: number; label: string };
    veryHigh: { min: number; max: number; label: string };
  };
  percentiles: {
    enabled: boolean;
    displayFormat: 'percentile' | 'quintile' | 'decile' | 'quartile';
  };
  zScores: {
    enabled: boolean;
    displayInReports: boolean;
  };
  traitOverrides: Record<string, any>;
}

export interface ReliabilityConfiguration {
  cronbachAlpha: {
    enabled: boolean;
    minAcceptable: number;
    minGood: number;
    minExcellent: number;
  };
  standardError: {
    enabled: boolean;
    maxAcceptable: number;
  };
  confidenceIntervals: {
    enabled: boolean;
    defaultLevel: number;
    availableLevels: number[];
  };
  testRetest: {
    enabled: boolean;
    minCorrelation: number;
    maxDaysBetweenTests: number;
  };
}

export interface NormativeDataConfiguration {
  dataSource: {
    primary: 'ipip' | 'local' | 'research' | 'custom';
    fallback: 'ipip' | 'local' | 'research' | 'custom';
  };
  normType: 'local' | 'global' | 'hybrid';
  demographics: {
    enabled: boolean;
    adjustForAge: boolean;
    adjustForGender: boolean;
    adjustForEducation: boolean;
    adjustForCulture: boolean;
  };
  sampleSize: {
    minForLocalNorms: number;
    minForDemographicAdjustment: number;
  };
  refresh: {
    autoUpdate: boolean;
    updateIntervalDays: number;
    minNewSamples: number;
  };
}

export interface QuestionBankConfiguration {
  questionsPerAssessment: {
    min: number;
    max: number;
    default: number;
  };
  questionsPerTrait: {
    min: number;
    max: number;
    default: number;
  };
  difficulty: {
    enabled: boolean;
    distribution: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  adaptive: {
    enabled: boolean;
    startDifficulty: 'easy' | 'medium' | 'hard';
    adjustmentThreshold: number;
  };
  repetition: {
    preventRepetition: boolean;
    cooldownDays: number;
    maxRepetitionsPerYear: number;
  };
  aiGeneration: {
    enabled: boolean;
    autoGenerate: boolean;
    minQualityScore: number;
    reviewRequired: boolean;
  };
}

export interface ScoringConfiguration {
  method: 'ipip' | 'irt' | 'classical' | 'hybrid';
  rawScores: {
    method: 'sum' | 'average' | 'weighted';
    calculationMethod?: 'sum' | 'average' | 'weighted';
    reverseScoring: boolean;
  };
  normalization: {
    method: 'z-score' | 'percentile' | 't-score' | 'sten' | 'zScore' | 'stanine';
    scale: { min: number; max: number };
    targetScale?: { min: number; max: number };
  };
  weighted: {
    enabled: boolean;
    weights: Record<string, number>;
  };
  weightedScoring?: {
    enabled: boolean;
    method?: 'itemDiscrimination' | 'itemDifficulty' | 'factorLoading' | 'custom';
  };
  outliers: {
    enabled: boolean;
    method: 'iqr' | 'z-score' | 'mad' | 'zScore' | 'mahalanobis';
    threshold: number;
    action: 'flag' | 'remove' | 'winsorize' | 'exclude' | 'transform';
  };
  outlierDetection?: {
    enabled: boolean;
    method: 'iqr' | 'z-score' | 'mad' | 'zScore' | 'mahalanobis';
    threshold: number;
    action: 'flag' | 'remove' | 'winsorize' | 'exclude' | 'transform';
  };
  missingData: {
    method: 'mean-imputation' | 'median-imputation' | 'exclude' | 'pro-rate' | 'proRate' | 'meanImputation' | 'multipleImputation';
    maxMissingPerTrait: number;
    maxMissingOverall?: number;
  };
}

export interface ReportingConfiguration {
  sections: {
    executiveSummary: boolean;
    traitScores: boolean;
    traitDescriptions: boolean;
    strengthsWeaknesses: boolean;
    careerRecommendations: boolean;
    developmentSuggestions: boolean;
    validityInformation: boolean;
    confidenceIntervals: boolean;
    percentileRanks: boolean;
    comparisonToNorms: boolean;
    detailedAnalysis: boolean;
  };
  detailLevel: 'brief' | 'standard' | 'comprehensive';
  visualizations: {
    includeCharts: boolean;
    chartTypes: ('bar' | 'radar' | 'line' | 'percentile')[];
    colorScheme: 'default' | 'colorblind-friendly' | 'grayscale';
  };
  localization: {
    defaultLanguage: string;
    availableLanguages: string[];
    includeTranslations: boolean;
  };
  export: {
    availableFormats: ('pdf' | 'html' | 'json' | 'csv')[];
    defaultFormat: 'pdf' | 'html' | 'json' | 'csv';
  };
  privacy: {
    anonymizeData: boolean;
    includeRawScores: boolean;
    includeAnswerDetails: boolean;
    dataRetentionDays: number;
  };
}

const psychometricConfigApi = {
  // Get active configuration
  getActiveConfiguration: async (): Promise<PsychometricConfiguration> => {
    const response = await psychometricApi.get('/admin/psychometric/config');
    return response.data;
  },

  // Get all configurations
  getAllConfigurations: async (): Promise<PsychometricConfiguration[]> => {
    const response = await psychometricApi.get('/admin/psychometric/config/all');
    return response.data;
  },

  // Get configuration by ID
  getConfigurationById: async (id: string): Promise<PsychometricConfiguration> => {
    const response = await psychometricApi.get(`/admin/psychometric/config/${id}`);
    return response.data;
  },

  // Create new configuration
  createConfiguration: async (config: Partial<PsychometricConfiguration>): Promise<PsychometricConfiguration> => {
    const response = await psychometricApi.post('/admin/psychometric/config', config);
    return response.data;
  },

  // Update configuration
  updateConfiguration: async (id: string, updates: Partial<PsychometricConfiguration>): Promise<PsychometricConfiguration> => {
    const response = await psychometricApi.put(`/admin/psychometric/config/${id}`, updates);
    return response.data;
  },

  // Activate configuration
  activateConfiguration: async (id: string): Promise<PsychometricConfiguration> => {
    const response = await psychometricApi.put(`/admin/psychometric/config/${id}/activate`);
    return response.data;
  },

  // Delete configuration
  deleteConfiguration: async (id: string): Promise<void> => {
    await psychometricApi.delete(`/admin/psychometric/config/${id}`);
  },

  // Clear cache
  clearCache: async (): Promise<void> => {
    await psychometricApi.post('/admin/psychometric/config/cache/clear');
  },
};

export default psychometricConfigApi;
