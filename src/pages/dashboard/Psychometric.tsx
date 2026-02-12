import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  fetchAllConfigurations,
  // fetchActiveConfiguration,
  setSelectedConfiguration,
  createConfiguration,
  updateConfiguration,
  activateConfiguration,
  deleteConfiguration,
  clearConfigCache,
  clearError,
  clearSuccessMessage,
} from '../../store/features/psychometricSlice';
import { PsychometricConfiguration } from '../../services/psychometricConfigApi';
import { toast } from 'react-toastify';

type TabType = 'list' | 'validity' | 'interpretation' | 'reliability' | 'normative' | 'questionBank' | 'scoring' | 'reporting';

const Psychometric: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    configurations,
    // activeConfiguration,
    selectedConfiguration,
    configurationsLoading,
    savingConfiguration,
    activatingConfiguration,
    error,
    successMessage,
  } = useAppSelector((state) => state.psychometric);

  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [isCreating, setIsCreating] = useState(false);
  const [editedConfig, setEditedConfig] = useState<Partial<PsychometricConfiguration> | null>(null);

  useEffect(() => {
    dispatch(fetchAllConfigurations());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [error, successMessage, dispatch]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditedConfig({
      version: '1.0.0',
      modifiedBy: 'admin',
      isActive: false,
    });
    setActiveTab('validity');
  };

  const handleSelectConfig = (config: PsychometricConfiguration) => {
    dispatch(setSelectedConfiguration(config));
    setEditedConfig(config);
    setIsCreating(false);
    setActiveTab('validity');
  };

  const handleSaveConfiguration = async () => {
    if (!editedConfig) return;

    if (isCreating) {
      await dispatch(createConfiguration(editedConfig));
      setIsCreating(false);
    } else if (selectedConfiguration?._id) {
      await dispatch(updateConfiguration({
        id: selectedConfiguration._id,
        updates: editedConfig,
      }));
    }
    
    dispatch(fetchAllConfigurations());
    setActiveTab('list');
  };

  const handleActivateConfig = async (id: string) => {
    await dispatch(activateConfiguration(id));
    dispatch(fetchAllConfigurations());
  };

  const handleDeleteConfig = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      await dispatch(deleteConfiguration(id));
      dispatch(fetchAllConfigurations());
    }
  };

  const handleClearCache = async () => {
    await dispatch(clearConfigCache());
  };

  const updateConfigField = (path: string, value: any) => {
    if (!editedConfig) return;
    
    const keys = path.split('.');
    const newConfig = { ...editedConfig };
    let obj: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
    setEditedConfig(newConfig);
  };

  const renderConfigurationList = () => (
    <Section>
      <SectionHeader>
        <SectionTitle>Psychometric Configurations</SectionTitle>
        <ButtonGroup>
          <Button onClick={handleCreateNew}>Create New Configuration</Button>
          <Button onClick={handleClearCache} variant="secondary">Clear Cache</Button>
        </ButtonGroup>
      </SectionHeader>
      
      {configurationsLoading ? (
        <LoadingMessage>Loading configurations...</LoadingMessage>
      ) : configurations.length === 0 ? (
        <EmptyMessage>No configurations found. Create your first configuration to get started.</EmptyMessage>
      ) : (
        <ConfigList>
          {configurations.map((config) => (
            <ConfigCard key={config._id} isActive={config.isActive}>
              <ConfigHeader>
                <ConfigTitle>
                  Version {config.version}
                  {config.isActive && <ActiveBadge>ACTIVE</ActiveBadge>}
                </ConfigTitle>
                <ConfigMeta>
                  Modified: {new Date(config.lastModified).toLocaleDateString()} by {config.modifiedBy}
                </ConfigMeta>
              </ConfigHeader>
              <ConfigActions>
                <ActionButton onClick={() => handleSelectConfig(config)}>Edit</ActionButton>
                {!config.isActive && (
                  <ActionButton 
                    onClick={() => config._id && handleActivateConfig(config._id)}
                    disabled={activatingConfiguration}
                  >
                    Activate
                  </ActionButton>
                )}
                {!config.isActive && (
                  <ActionButton 
                    onClick={() => config._id && handleDeleteConfig(config._id)}
                    variant="danger"
                  >
                    Delete
                  </ActionButton>
                )}
              </ConfigActions>
            </ConfigCard>
          ))}
        </ConfigList>
      )}
    </Section>
  );

  const renderValidityTab = () => (
    <Section>
      <SectionTitle>Assessment Validity Configuration</SectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Minimum Completion Rate</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.validity?.minCompletionRate || 0.8}
            onChange={(e) => updateConfigField('validity.minCompletionRate', parseFloat(e.target.value))}
          />
          <HelpText>Minimum percentage of questions that must be answered (0-1 scale)</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Minimum Questions Per Trait</Label>
          <Input
            type="number"
            min="1"
            value={editedConfig?.validity?.minQuestionsPerTrait || 10}
            onChange={(e) => updateConfigField('validity.minQuestionsPerTrait', parseInt(e.target.value))}
          />
          <HelpText>Minimum number of questions required per trait for statistical reliability</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Invalid Threshold</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.validity?.validityScoreThresholds?.invalid || 0.5}
            onChange={(e) => updateConfigField('validity.validityScoreThresholds.invalid', parseFloat(e.target.value))}
          />
          <HelpText>Below this score, assessment is considered invalid</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Questionable Threshold</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.validity?.validityScoreThresholds?.questionable || 0.7}
            onChange={(e) => updateConfigField('validity.validityScoreThresholds.questionable', parseFloat(e.target.value))}
          />
          <HelpText>Below this score, assessment validity is questionable</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Acceptable Threshold</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.validity?.validityScoreThresholds?.acceptable || 0.7}
            onChange={(e) => updateConfigField('validity.validityScoreThresholds.acceptable', parseFloat(e.target.value))}
          />
          <HelpText>Above this score, assessment is considered acceptable</HelpText>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Bias Detection Settings</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.validity?.inconsistency?.enabled || false}
            onChange={(e) => updateConfigField('validity.inconsistency.enabled', e.target.checked)}
          />
          <Label>Enable Inconsistency Detection</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.validity?.acquiescence?.enabled || false}
            onChange={(e) => updateConfigField('validity.acquiescence.enabled', e.target.checked)}
          />
          <Label>Enable Acquiescence Bias Detection</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.validity?.extremeResponse?.enabled || false}
            onChange={(e) => updateConfigField('validity.extremeResponse.enabled', e.target.checked)}
          />
          <Label>Enable Extreme Response Detection</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.validity?.randomResponse?.enabled || false}
            onChange={(e) => updateConfigField('validity.randomResponse.enabled', e.target.checked)}
          />
          <Label>Enable Random Response Detection</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.validity?.socialDesirability?.enabled || false}
            onChange={(e) => updateConfigField('validity.socialDesirability.enabled', e.target.checked)}
          />
          <Label>Enable Social Desirability Detection</Label>
        </CheckboxGroup>
      </FormGrid>
    </Section>
  );

  const renderInterpretationTab = () => (
    <Section>
      <SectionTitle>Score Interpretation Configuration</SectionTitle>
      <SubsectionTitle>Score Bands (0-100 scale)</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Very Low Range</Label>
          <RangeInputGroup>
            <Input
              type="number"
              placeholder="Min"
              value={editedConfig?.interpretation?.bands?.veryLow?.min || 0}
              onChange={(e) => updateConfigField('interpretation.bands.veryLow.min', parseInt(e.target.value))}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={editedConfig?.interpretation?.bands?.veryLow?.max || 20}
              onChange={(e) => updateConfigField('interpretation.bands.veryLow.max', parseInt(e.target.value))}
            />
          </RangeInputGroup>
        </FormGroup>

        <FormGroup>
          <Label>Low Range</Label>
          <RangeInputGroup>
            <Input
              type="number"
              placeholder="Min"
              value={editedConfig?.interpretation?.bands?.low?.min || 20}
              onChange={(e) => updateConfigField('interpretation.bands.low.min', parseInt(e.target.value))}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={editedConfig?.interpretation?.bands?.low?.max || 40}
              onChange={(e) => updateConfigField('interpretation.bands.low.max', parseInt(e.target.value))}
            />
          </RangeInputGroup>
        </FormGroup>

        <FormGroup>
          <Label>Average Range</Label>
          <RangeInputGroup>
            <Input
              type="number"
              placeholder="Min"
              value={editedConfig?.interpretation?.bands?.average?.min || 40}
              onChange={(e) => updateConfigField('interpretation.bands.average.min', parseInt(e.target.value))}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={editedConfig?.interpretation?.bands?.average?.max || 60}
              onChange={(e) => updateConfigField('interpretation.bands.average.max', parseInt(e.target.value))}
            />
          </RangeInputGroup>
        </FormGroup>

        <FormGroup>
          <Label>High Range</Label>
          <RangeInputGroup>
            <Input
              type="number"
              placeholder="Min"
              value={editedConfig?.interpretation?.bands?.high?.min || 60}
              onChange={(e) => updateConfigField('interpretation.bands.high.min', parseInt(e.target.value))}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={editedConfig?.interpretation?.bands?.high?.max || 80}
              onChange={(e) => updateConfigField('interpretation.bands.high.max', parseInt(e.target.value))}
            />
          </RangeInputGroup>
        </FormGroup>

        <FormGroup>
          <Label>Very High Range</Label>
          <RangeInputGroup>
            <Input
              type="number"
              placeholder="Min"
              value={editedConfig?.interpretation?.bands?.veryHigh?.min || 80}
              onChange={(e) => updateConfigField('interpretation.bands.veryHigh.min', parseInt(e.target.value))}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={editedConfig?.interpretation?.bands?.veryHigh?.max || 100}
              onChange={(e) => updateConfigField('interpretation.bands.veryHigh.max', parseInt(e.target.value))}
            />
          </RangeInputGroup>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Display Options</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.interpretation?.percentiles?.enabled || false}
            onChange={(e) => updateConfigField('interpretation.percentiles.enabled', e.target.checked)}
          />
          <Label>Enable Percentile Display</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Percentile Display Format</Label>
          <Select
            value={editedConfig?.interpretation?.percentiles?.displayFormat || 'percentile'}
            onChange={(e) => updateConfigField('interpretation.percentiles.displayFormat', e.target.value)}
          >
            <option value="percentile">Percentile (0-100)</option>
            <option value="quintile">Quintile (1-5)</option>
            <option value="decile">Decile (1-10)</option>
            <option value="quartile">Quartile (1-4)</option>
          </Select>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.interpretation?.zScores?.enabled || false}
            onChange={(e) => updateConfigField('interpretation.zScores.enabled', e.target.checked)}
          />
          <Label>Enable Z-Score Calculation</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.interpretation?.zScores?.displayInReports || false}
            onChange={(e) => updateConfigField('interpretation.zScores.displayInReports', e.target.checked)}
          />
          <Label>Display Z-Scores in Reports</Label>
        </CheckboxGroup>
      </FormGrid>
    </Section>
  );

  const renderReliabilityTab = () => (
    <Section>
      <SectionTitle>Reliability Metrics Configuration</SectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reliability?.cronbachAlpha?.enabled || false}
            onChange={(e) => updateConfigField('reliability.cronbachAlpha.enabled', e.target.checked)}
          />
          <Label>Enable Cronbach's Alpha Calculation</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Minimum Acceptable Alpha</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.reliability?.cronbachAlpha?.minAcceptable || 0.7}
            onChange={(e) => updateConfigField('reliability.cronbachAlpha.minAcceptable', parseFloat(e.target.value))}
          />
          <HelpText>Minimum alpha value for acceptable reliability (typically 0.7)</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Minimum Good Alpha</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.reliability?.cronbachAlpha?.minGood || 0.8}
            onChange={(e) => updateConfigField('reliability.cronbachAlpha.minGood', parseFloat(e.target.value))}
          />
          <HelpText>Minimum alpha value for good reliability (typically 0.8)</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Minimum Excellent Alpha</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.reliability?.cronbachAlpha?.minExcellent || 0.9}
            onChange={(e) => updateConfigField('reliability.cronbachAlpha.minExcellent', parseFloat(e.target.value))}
          />
          <HelpText>Minimum alpha value for excellent reliability (typically 0.9)</HelpText>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reliability?.standardError?.enabled || false}
            onChange={(e) => updateConfigField('reliability.standardError.enabled', e.target.checked)}
          />
          <Label>Enable Standard Error of Measurement</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Maximum Acceptable SEM</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={editedConfig?.reliability?.standardError?.maxAcceptable || 5.0}
            onChange={(e) => updateConfigField('reliability.standardError.maxAcceptable', parseFloat(e.target.value))}
          />
          <HelpText>Maximum standard error on 0-100 scale (typically 5.0)</HelpText>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reliability?.confidenceIntervals?.enabled || false}
            onChange={(e) => updateConfigField('reliability.confidenceIntervals.enabled', e.target.checked)}
          />
          <Label>Enable Confidence Intervals</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Default Confidence Level</Label>
          <Select
            value={editedConfig?.reliability?.confidenceIntervals?.defaultLevel || 0.95}
            onChange={(e) => updateConfigField('reliability.confidenceIntervals.defaultLevel', parseFloat(e.target.value))}
          >
            <option value="0.90">90%</option>
            <option value="0.95">95%</option>
            <option value="0.99">99%</option>
          </Select>
        </FormGroup>
      </FormGrid>
    </Section>
  );

  const renderNormativeDataTab = () => (
    <Section>
      <SectionTitle>Normative Data Configuration</SectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Primary Data Source</Label>
          <Select
            value={editedConfig?.normativeData?.dataSource?.primary || 'ipip'}
            onChange={(e) => updateConfigField('normativeData.dataSource.primary', e.target.value)}
          >
            <option value="ipip">IPIP Big Five Dataset (307,312 samples)</option>
            <option value="local">Local Normative Data</option>
            <option value="research">Research Database</option>
            <option value="custom">Custom Dataset</option>
          </Select>
          <HelpText>Primary source for normative comparisons</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Fallback Data Source</Label>
          <Select
            value={editedConfig?.normativeData?.dataSource?.fallback || 'research'}
            onChange={(e) => updateConfigField('normativeData.dataSource.fallback', e.target.value)}
          >
            <option value="ipip">IPIP Big Five Dataset</option>
            <option value="local">Local Normative Data</option>
            <option value="research">Research Database</option>
            <option value="custom">Custom Dataset</option>
          </Select>
          <HelpText>Fallback source if primary is unavailable</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Norm Type</Label>
          <Select
            value={editedConfig?.normativeData?.normType || 'local'}
            onChange={(e) => updateConfigField('normativeData.normType', e.target.value)}
          >
            <option value="local">Local Norms (Recommended by IPIP)</option>
            <option value="global">Global Norms</option>
            <option value="hybrid">Hybrid (Local + Global)</option>
          </Select>
          <HelpText>IPIP recommends local norms over universal norms</HelpText>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.normativeData?.demographics?.enabled || false}
            onChange={(e) => updateConfigField('normativeData.demographics.enabled', e.target.checked)}
          />
          <Label>Enable Demographic Adjustments</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.normativeData?.demographics?.adjustForAge || false}
            onChange={(e) => updateConfigField('normativeData.demographics.adjustForAge', e.target.checked)}
          />
          <Label>Adjust for Age</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.normativeData?.demographics?.adjustForGender || false}
            onChange={(e) => updateConfigField('normativeData.demographics.adjustForGender', e.target.checked)}
          />
          <Label>Adjust for Gender</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.normativeData?.demographics?.adjustForEducation || false}
            onChange={(e) => updateConfigField('normativeData.demographics.adjustForEducation', e.target.checked)}
          />
          <Label>Adjust for Education Level</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.normativeData?.demographics?.adjustForCulture || false}
            onChange={(e) => updateConfigField('normativeData.demographics.adjustForCulture', e.target.checked)}
          />
          <Label>Adjust for Cultural Background</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Minimum Sample Size for Local Norms</Label>
          <Input
            type="number"
            min="10"
            value={editedConfig?.normativeData?.sampleSize?.minForLocalNorms || 100}
            onChange={(e) => updateConfigField('normativeData.sampleSize.minForLocalNorms', parseInt(e.target.value))}
          />
          <HelpText>Minimum samples required to use local norms</HelpText>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.normativeData?.refresh?.autoUpdate || false}
            onChange={(e) => updateConfigField('normativeData.refresh.autoUpdate', e.target.checked)}
          />
          <Label>Auto-Update Normative Data</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Update Interval (Days)</Label>
          <Input
            type="number"
            min="1"
            value={editedConfig?.normativeData?.refresh?.updateIntervalDays || 90}
            onChange={(e) => updateConfigField('normativeData.refresh.updateIntervalDays', parseInt(e.target.value))}
          />
          <HelpText>How often to refresh normative statistics</HelpText>
        </FormGroup>
      </FormGrid>
    </Section>
  );

  const renderQuestionBankTab = () => (
    <Section>
      <SectionTitle>Question Bank Configuration</SectionTitle>
      <SubsectionTitle>Questions Per Assessment</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Minimum Questions</Label>
          <Input
            type="number"
            min="5"
            value={editedConfig?.questionBank?.questionsPerAssessment?.min || 15}
            onChange={(e) => updateConfigField('questionBank.questionsPerAssessment.min', parseInt(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Maximum Questions</Label>
          <Input
            type="number"
            min="10"
            value={editedConfig?.questionBank?.questionsPerAssessment?.max || 50}
            onChange={(e) => updateConfigField('questionBank.questionsPerAssessment.max', parseInt(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Default Questions</Label>
          <Input
            type="number"
            min="5"
            value={editedConfig?.questionBank?.questionsPerAssessment?.default || 25}
            onChange={(e) => updateConfigField('questionBank.questionsPerAssessment.default', parseInt(e.target.value))}
          />
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Questions Per Trait</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Minimum Per Trait</Label>
          <Input
            type="number"
            min="1"
            value={editedConfig?.questionBank?.questionsPerTrait?.min || 3}
            onChange={(e) => updateConfigField('questionBank.questionsPerTrait.min', parseInt(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Maximum Per Trait</Label>
          <Input
            type="number"
            min="3"
            value={editedConfig?.questionBank?.questionsPerTrait?.max || 15}
            onChange={(e) => updateConfigField('questionBank.questionsPerTrait.max', parseInt(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Default Per Trait</Label>
          <Input
            type="number"
            min="1"
            value={editedConfig?.questionBank?.questionsPerTrait?.default || 5}
            onChange={(e) => updateConfigField('questionBank.questionsPerTrait.default', parseInt(e.target.value))}
          />
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Difficulty Distribution</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.questionBank?.difficulty?.enabled || false}
            onChange={(e) => updateConfigField('questionBank.difficulty.enabled', e.target.checked)}
          />
          <Label>Enable Difficulty-Based Selection</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Easy Questions (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={(editedConfig?.questionBank?.difficulty?.distribution?.easy || 0.3) * 100}
            onChange={(e) => updateConfigField('questionBank.difficulty.distribution.easy', parseFloat(e.target.value) / 100)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Medium Questions (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={(editedConfig?.questionBank?.difficulty?.distribution?.medium || 0.5) * 100}
            onChange={(e) => updateConfigField('questionBank.difficulty.distribution.medium', parseFloat(e.target.value) / 100)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Hard Questions (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={(editedConfig?.questionBank?.difficulty?.distribution?.hard || 0.2) * 100}
            onChange={(e) => updateConfigField('questionBank.difficulty.distribution.hard', parseFloat(e.target.value) / 100)}
          />
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>AI Question Generation</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.questionBank?.aiGeneration?.enabled || false}
            onChange={(e) => updateConfigField('questionBank.aiGeneration.enabled', e.target.checked)}
          />
          <Label>Enable AI Question Generation</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.questionBank?.aiGeneration?.autoGenerate || false}
            onChange={(e) => updateConfigField('questionBank.aiGeneration.autoGenerate', e.target.checked)}
          />
          <Label>Auto-Generate Questions When Needed</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Minimum Quality Score</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={editedConfig?.questionBank?.aiGeneration?.minQualityScore || 0.8}
            onChange={(e) => updateConfigField('questionBank.aiGeneration.minQualityScore', parseFloat(e.target.value))}
          />
          <HelpText>Minimum quality threshold for AI-generated questions</HelpText>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.questionBank?.aiGeneration?.reviewRequired || false}
            onChange={(e) => updateConfigField('questionBank.aiGeneration.reviewRequired', e.target.checked)}
          />
          <Label>Require Human Review Before Use</Label>
        </CheckboxGroup>
      </FormGrid>
    </Section>
  );

  const renderScoringTab = () => (
    <Section>
      <SectionTitle>Scoring Algorithm Configuration</SectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Scoring Method</Label>
          <Select
            value={editedConfig?.scoring?.method || 'ipip'}
            onChange={(e) => updateConfigField('scoring.method', e.target.value)}
          >
            <option value="ipip">IPIP Standard</option>
            <option value="irt">Item Response Theory (IRT)</option>
            <option value="classical">Classical Test Theory</option>
            <option value="hybrid">Hybrid (IPIP + IRT)</option>
          </Select>
          <HelpText>Algorithm used for score calculation</HelpText>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Raw Score Calculation</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Calculation Method</Label>
          <Select
            value={editedConfig?.scoring?.rawScores?.calculationMethod || 'sum'}
            onChange={(e) => updateConfigField('scoring.rawScores.calculationMethod', e.target.value)}
          >
            <option value="sum">Sum of Responses</option>
            <option value="average">Average of Responses</option>
            <option value="weighted">Weighted Sum</option>
          </Select>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.scoring?.rawScores?.reverseScoring || false}
            onChange={(e) => updateConfigField('scoring.rawScores.reverseScoring', e.target.checked)}
          />
          <Label>Enable Reverse Scoring for Negative Items</Label>
        </CheckboxGroup>
      </FormGrid>

      <SubsectionTitle>Normalization</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Normalization Method</Label>
          <Select
            value={editedConfig?.scoring?.normalization?.method || 'zScore'}
            onChange={(e) => updateConfigField('scoring.normalization.method', e.target.value)}
          >
            <option value="zScore">Z-Score Transformation</option>
            <option value="percentile">Percentile Rank</option>
            <option value="tScore">T-Score (Mean=50, SD=10)</option>
            <option value="stanine">Stanine (1-9 scale)</option>
            <option value="sten">Sten (1-10 scale)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Target Scale Minimum</Label>
          <Input
            type="number"
            value={editedConfig?.scoring?.normalization?.targetScale?.min || 0}
            onChange={(e) => updateConfigField('scoring.normalization.targetScale.min', parseInt(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Target Scale Maximum</Label>
          <Input
            type="number"
            value={editedConfig?.scoring?.normalization?.targetScale?.max || 100}
            onChange={(e) => updateConfigField('scoring.normalization.targetScale.max', parseInt(e.target.value))}
          />
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Weighted Scoring</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.scoring?.weightedScoring?.enabled || false}
            onChange={(e) => updateConfigField('scoring.weightedScoring.enabled', e.target.checked)}
          />
          <Label>Enable Weighted Scoring</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Weighting Method</Label>
          <Select
            value={editedConfig?.scoring?.weightedScoring?.method || 'itemDiscrimination'}
            onChange={(e) => updateConfigField('scoring.weightedScoring.method', e.target.value)}
            disabled={!editedConfig?.scoring?.weightedScoring?.enabled}
          >
            <option value="itemDiscrimination">Item Discrimination</option>
            <option value="itemDifficulty">Item Difficulty</option>
            <option value="factorLoading">Factor Loading</option>
            <option value="custom">Custom Weights</option>
          </Select>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Outlier Detection</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.scoring?.outlierDetection?.enabled || false}
            onChange={(e) => updateConfigField('scoring.outlierDetection.enabled', e.target.checked)}
          />
          <Label>Enable Outlier Detection</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Detection Method</Label>
          <Select
            value={editedConfig?.scoring?.outlierDetection?.method || 'zScore'}
            onChange={(e) => updateConfigField('scoring.outlierDetection.method', e.target.value)}
            disabled={!editedConfig?.scoring?.outlierDetection?.enabled}
          >
            <option value="zScore">Z-Score Method</option>
            <option value="iqr">Interquartile Range (IQR)</option>
            <option value="mahalanobis">Mahalanobis Distance</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Z-Score Threshold</Label>
          <Input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={editedConfig?.scoring?.outlierDetection?.threshold || 3.0}
            onChange={(e) => updateConfigField('scoring.outlierDetection.threshold', parseFloat(e.target.value))}
            disabled={!editedConfig?.scoring?.outlierDetection?.enabled}
          />
          <HelpText>Standard deviations from mean (typically 3.0)</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Action on Outlier</Label>
          <Select
            value={editedConfig?.scoring?.outlierDetection?.action || 'flag'}
            onChange={(e) => updateConfigField('scoring.outlierDetection.action', e.target.value)}
            disabled={!editedConfig?.scoring?.outlierDetection?.enabled}
          >
            <option value="flag">Flag for Review</option>
            <option value="winsorize">Winsorize (Cap at threshold)</option>
            <option value="exclude">Exclude from Analysis</option>
            <option value="transform">Apply Transformation</option>
          </Select>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Missing Data Handling</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Missing Data Method</Label>
          <Select
            value={editedConfig?.scoring?.missingData?.method || 'proRate'}
            onChange={(e) => updateConfigField('scoring.missingData.method', e.target.value)}
          >
            <option value="proRate">Pro-Rate (Scale Up)</option>
            <option value="meanImputation">Mean Imputation</option>
            <option value="exclude">Exclude Incomplete</option>
            <option value="multipleImputation">Multiple Imputation</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Maximum Missing Per Trait (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={(editedConfig?.scoring?.missingData?.maxMissingPerTrait || 0.2) * 100}
            onChange={(e) => updateConfigField('scoring.missingData.maxMissingPerTrait', parseFloat(e.target.value) / 100)}
          />
          <HelpText>Maximum percentage of missing responses allowed per trait</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>Maximum Missing Overall (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={(editedConfig?.scoring?.missingData?.maxMissingOverall || 0.1) * 100}
            onChange={(e) => updateConfigField('scoring.missingData.maxMissingOverall', parseFloat(e.target.value) / 100)}
          />
          <HelpText>Maximum percentage of missing responses allowed overall</HelpText>
        </FormGroup>
      </FormGrid>
    </Section>
  );

  const renderReportingTab = () => (
    <Section>
      <SectionTitle>Report Generation Configuration</SectionTitle>
      <SubsectionTitle>Report Sections</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.sections?.summary || false}
            onChange={(e) => updateConfigField('reporting.sections.summary', e.target.checked)}
          />
          <Label>Executive Summary</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.sections?.traitScores || false}
            onChange={(e) => updateConfigField('reporting.sections.traitScores', e.target.checked)}
          />
          <Label>Trait Scores</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.sections?.interpretation || false}
            onChange={(e) => updateConfigField('reporting.sections.interpretation', e.target.checked)}
          />
          <Label>Score Interpretation</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.sections?.comparisons || false}
            onChange={(e) => updateConfigField('reporting.sections.comparisons', e.target.checked)}
          />
          <Label>Normative Comparisons</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.sections?.recommendations || false}
            onChange={(e) => updateConfigField('reporting.sections.recommendations', e.target.checked)}
          />
          <Label>Career Recommendations</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.sections?.detailedAnalysis || false}
            onChange={(e) => updateConfigField('reporting.sections.detailedAnalysis', e.target.checked)}
          />
          <Label>Detailed Analysis</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.sections?.validityIndicators || false}
            onChange={(e) => updateConfigField('reporting.sections.validityIndicators', e.target.checked)}
          />
          <Label>Validity Indicators</Label>
        </CheckboxGroup>
      </FormGrid>

      <SubsectionTitle>Detail Level</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Report Detail Level</Label>
          <Select
            value={editedConfig?.reporting?.detailLevel || 'standard'}
            onChange={(e) => updateConfigField('reporting.detailLevel', e.target.value)}
          >
            <option value="brief">Brief (1-2 pages)</option>
            <option value="standard">Standard (3-5 pages)</option>
            <option value="comprehensive">Comprehensive (6-10 pages)</option>
            <option value="detailed">Detailed (10+ pages)</option>
          </Select>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Visualizations</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.visualizations?.barCharts || false}
            onChange={(e) => updateConfigField('reporting.visualizations.barCharts', e.target.checked)}
          />
          <Label>Bar Charts</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.visualizations?.radarCharts || false}
            onChange={(e) => updateConfigField('reporting.visualizations.radarCharts', e.target.checked)}
          />
          <Label>Radar/Spider Charts</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.visualizations?.percentileCharts || false}
            onChange={(e) => updateConfigField('reporting.visualizations.percentileCharts', e.target.checked)}
          />
          <Label>Percentile Charts</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.visualizations?.distributionCurves || false}
            onChange={(e) => updateConfigField('reporting.visualizations.distributionCurves', e.target.checked)}
          />
          <Label>Distribution Curves</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Color Scheme</Label>
          <Select
            value={editedConfig?.reporting?.visualizations?.colorScheme || 'default'}
            onChange={(e) => updateConfigField('reporting.visualizations.colorScheme', e.target.value)}
          >
            <option value="default">Default (Blue/Green)</option>
            <option value="professional">Professional (Gray/Blue)</option>
            <option value="vibrant">Vibrant (Multi-color)</option>
            <option value="accessible">Accessible (High Contrast)</option>
            <option value="monochrome">Monochrome (Grayscale)</option>
          </Select>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Localization</SubsectionTitle>
      <FormGrid>
        <FormGroup>
          <Label>Default Language</Label>
          <Select
            value={editedConfig?.reporting?.localization?.defaultLanguage || 'en'}
            onChange={(e) => updateConfigField('reporting.localization.defaultLanguage', e.target.value)}
          >
            <option value="en">English</option>
            <option value="am">Amharic (አማርኛ)</option>
            <option value="om">Oromo (Afaan Oromoo)</option>
            <option value="ti">Tigrinya (ትግርኛ)</option>
          </Select>
        </FormGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.localization?.multiLanguageSupport || false}
            onChange={(e) => updateConfigField('reporting.localization.multiLanguageSupport', e.target.checked)}
          />
          <Label>Enable Multi-Language Support</Label>
        </CheckboxGroup>
      </FormGrid>

      <SubsectionTitle>Export Formats</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.exportFormats?.pdf || false}
            onChange={(e) => updateConfigField('reporting.exportFormats.pdf', e.target.checked)}
          />
          <Label>PDF Export</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.exportFormats?.html || false}
            onChange={(e) => updateConfigField('reporting.exportFormats.html', e.target.checked)}
          />
          <Label>HTML Export</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.exportFormats?.json || false}
            onChange={(e) => updateConfigField('reporting.exportFormats.json', e.target.checked)}
          />
          <Label>JSON Export (API)</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.exportFormats?.csv || false}
            onChange={(e) => updateConfigField('reporting.exportFormats.csv', e.target.checked)}
          />
          <Label>CSV Export (Data Only)</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Default Export Format</Label>
          <Select
            value={editedConfig?.reporting?.exportFormats?.default || 'pdf'}
            onChange={(e) => updateConfigField('reporting.exportFormats.default', e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </Select>
        </FormGroup>
      </FormGrid>

      <SubsectionTitle>Privacy & Data Retention</SubsectionTitle>
      <FormGrid>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.privacy?.includeRawScores || false}
            onChange={(e) => updateConfigField('reporting.privacy.includeRawScores', e.target.checked)}
          />
          <Label>Include Raw Scores in Reports</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.privacy?.includeAnswerDetails || false}
            onChange={(e) => updateConfigField('reporting.privacy.includeAnswerDetails', e.target.checked)}
          />
          <Label>Include Individual Answer Details</Label>
        </CheckboxGroup>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={editedConfig?.reporting?.privacy?.anonymizeData || false}
            onChange={(e) => updateConfigField('reporting.privacy.anonymizeData', e.target.checked)}
          />
          <Label>Anonymize Personal Data in Exports</Label>
        </CheckboxGroup>

        <FormGroup>
          <Label>Data Retention Period (Days)</Label>
          <Input
            type="number"
            min="30"
            max="3650"
            value={editedConfig?.reporting?.privacy?.dataRetentionDays || 365}
            onChange={(e) => updateConfigField('reporting.privacy.dataRetentionDays', parseInt(e.target.value))}
          />
          <HelpText>How long to retain assessment data (30-3650 days)</HelpText>
        </FormGroup>
      </FormGrid>
    </Section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'list':
        return renderConfigurationList();
      case 'validity':
        return renderValidityTab();
      case 'interpretation':
        return renderInterpretationTab();
      case 'reliability':
        return renderReliabilityTab();
      case 'normative':
        return renderNormativeDataTab();
      case 'questionBank':
        return renderQuestionBankTab();
      case 'scoring':
        return renderScoringTab();
      case 'reporting':
        return renderReportingTab();
      default:
        return renderConfigurationList();
    }
  };

  return (
    <Container>
      <Header>
        <Title>Psychometric Configuration</Title>
        {activeTab !== 'list' && (
          <ButtonGroup>
            <Button onClick={() => setActiveTab('list')} variant="secondary">
              Back to List
            </Button>
            <Button onClick={handleSaveConfiguration} disabled={savingConfiguration}>
              {savingConfiguration ? 'Saving...' : isCreating ? 'Create Configuration' : 'Save Changes'}
            </Button>
          </ButtonGroup>
        )}
      </Header>

      {activeTab !== 'list' && (
        <TabContainer>
          <TabButton active={activeTab === 'validity'} onClick={() => setActiveTab('validity')}>
            Validity
          </TabButton>
          <TabButton active={activeTab === 'interpretation'} onClick={() => setActiveTab('interpretation')}>
            Interpretation
          </TabButton>
          <TabButton active={activeTab === 'reliability'} onClick={() => setActiveTab('reliability')}>
            Reliability
          </TabButton>
          <TabButton active={activeTab === 'normative'} onClick={() => setActiveTab('normative')}>
            Normative Data
          </TabButton>
          <TabButton active={activeTab === 'questionBank'} onClick={() => setActiveTab('questionBank')}>
            Question Bank
          </TabButton>
          <TabButton active={activeTab === 'scoring'} onClick={() => setActiveTab('scoring')}>
            Scoring
          </TabButton>
          <TabButton active={activeTab === 'reporting'} onClick={() => setActiveTab('reporting')}>
            Reporting
          </TabButton>
        </TabContainer>
      )}

      <Content>{renderTabContent()}</Content>
    </Container>
  );
};

export default Psychometric;

// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a202c;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.active ? '#3182ce' : '#718096')};
  background: ${(props) => (props.active ? '#ebf8ff' : 'transparent')};
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? '#3182ce' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #3182ce;
    background: #ebf8ff;
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  padding: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
`;

const SubsectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #4a5568;
  margin: 24px 0 16px 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  &:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  &:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #718096;
  margin: 0;
`;

const RangeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #718096;
  }

  input {
    flex: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => {
    if (props.variant === 'secondary') return '#4a5568';
    if (props.variant === 'danger') return 'white';
    return 'white';
  }};
  background: ${(props) => {
    if (props.variant === 'secondary') return '#e2e8f0';
    if (props.variant === 'danger') return '#e53e3e';
    return '#3182ce';
  }};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => {
      if (props.variant === 'secondary') return '#cbd5e0';
      if (props.variant === 'danger') return '#c53030';
      return '#2c5282';
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfigList = styled.div`
  display: grid;
  gap: 16px;
`;

const ConfigCard = styled.div<{ isActive: boolean }>`
  padding: 20px;
  border: 2px solid ${(props) => (props.isActive ? '#3182ce' : '#e2e8f0')};
  border-radius: 8px;
  background: ${(props) => (props.isActive ? '#ebf8ff' : 'white')};
  transition: all 0.2s;

  &:hover {
    border-color: #3182ce;
    box-shadow: 0 2px 8px rgba(49, 130, 206, 0.1);
  }
`;

const ConfigHeader = styled.div`
  margin-bottom: 16px;
`;

const ConfigTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ActiveBadge = styled.span`
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: #38a169;
  border-radius: 12px;
`;

const ConfigMeta = styled.p`
  font-size: 14px;
  color: #718096;
  margin: 0;
`;

const ConfigActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant?: 'danger' }>`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.variant === 'danger' ? 'white' : '#3182ce')};
  background: ${(props) => (props.variant === 'danger' ? '#e53e3e' : 'transparent')};
  border: 1px solid ${(props) => (props.variant === 'danger' ? '#e53e3e' : '#3182ce')};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.variant === 'danger' ? '#c53030' : '#3182ce')};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #718096;
  font-size: 16px;
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #718096;
  font-size: 16px;
`;
