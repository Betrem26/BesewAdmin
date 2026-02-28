import React, { useState } from 'react';
import styled from 'styled-components';

interface Trait {
  name: string;
  displayName: string;
  description: string;
  facets: string[];
}

interface PsychometricModel {
  model: string;
  displayName: string;
  description: string;
  traits: Trait[];
  questionTypes: string[];
  difficulties: string[];
  scoringMethod: string;
}

interface ModelManagementProps {
  onModelCreated: (model: PsychometricModel) => void;
}

const ModelManagement: React.FC<ModelManagementProps> = ({ onModelCreated }) => {
  const [modelName, setModelName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [scoringMethod, setScoringMethod] = useState('ipip');
  const [traits, setTraits] = useState<Trait[]>([]);
  const [currentTrait, setCurrentTrait] = useState<Trait>({
    name: '',
    displayName: '',
    description: '',
    facets: [],
  });
  const [currentFacet, setCurrentFacet] = useState('');
  const questionTypes = ['trait', 'control', 'validity'];
  const difficulties = ['easy', 'medium', 'hard'];

  const handleAddFacet = () => {
    if (currentFacet.trim()) {
      setCurrentTrait({
        ...currentTrait,
        facets: [...currentTrait.facets, currentFacet.trim()],
      });
      setCurrentFacet('');
    }
  };

  const handleRemoveFacet = (index: number) => {
    setCurrentTrait({
      ...currentTrait,
      facets: currentTrait.facets.filter((_, i) => i !== index),
    });
  };

  const handleAddTrait = () => {
    if (currentTrait.name && currentTrait.displayName && currentTrait.description) {
      setTraits([...traits, currentTrait]);
      setCurrentTrait({
        name: '',
        displayName: '',
        description: '',
        facets: [],
      });
    }
  };

  const handleRemoveTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const handleCreateModel = () => {
    if (!modelName || !displayName || !description || traits.length === 0) {
      alert('Please fill in all required fields and add at least one trait');
      return;
    }

    const model: PsychometricModel = {
      model: modelName.toLowerCase().replace(/\s+/g, '-'),
      displayName,
      description,
      traits,
      questionTypes,
      difficulties,
      scoringMethod,
    };

    onModelCreated(model);

    // Reset form
    setModelName('');
    setDisplayName('');
    setDescription('');
    setTraits([]);
    setCurrentTrait({
      name: '',
      displayName: '',
      description: '',
      facets: [],
    });
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Create New Psychometric Model</SectionTitle>
        
        <SubsectionTitle>Model Information</SubsectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Model Name (Internal) *</Label>
            <Input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., disc, mbti, holland-codes"
            />
            <HelpText>Lowercase, use hyphens for spaces</HelpText>
          </FormGroup>

          <FormGroup>
            <Label>Display Name *</Label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., DISC Personality Assessment"
            />
            <HelpText>User-friendly name shown in UI</HelpText>
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the psychometric model..."
              rows={3}
            />
          </FormGroup>

          <FormGroup>
            <Label>Scoring Method</Label>
            <Select
              value={scoringMethod}
              onChange={(e) => setScoringMethod(e.target.value)}
            >
              <option value="ipip">IPIP Standard</option>
              <option value="irt">Item Response Theory (IRT)</option>
              <option value="classical">Classical Test Theory</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </FormGroup>
        </FormGrid>

        <SubsectionTitle>Traits Configuration</SubsectionTitle>
        <TraitForm>
          <FormGrid>
            <FormGroup>
              <Label>Trait Name (Internal) *</Label>
              <Input
                type="text"
                value={currentTrait.name}
                onChange={(e) => setCurrentTrait({ ...currentTrait, name: e.target.value })}
                placeholder="e.g., dominance, influence"
              />
              <HelpText>Lowercase, use underscores for spaces</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>Trait Display Name *</Label>
              <Input
                type="text"
                value={currentTrait.displayName}
                onChange={(e) => setCurrentTrait({ ...currentTrait, displayName: e.target.value })}
                placeholder="e.g., Dominance, Influence"
              />
            </FormGroup>

            <FormGroup>
              <Label>Trait Description *</Label>
              <TextArea
                value={currentTrait.description}
                onChange={(e) => setCurrentTrait({ ...currentTrait, description: e.target.value })}
                placeholder="Description of what this trait measures..."
                rows={2}
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label>Facets (Sub-dimensions)</Label>
            <FacetInputGroup>
              <Input
                type="text"
                value={currentFacet}
                onChange={(e) => setCurrentFacet(e.target.value)}
                placeholder="e.g., assertiveness, leadership"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFacet()}
              />
              <Button type="button" onClick={handleAddFacet} variant="secondary">
                Add Facet
              </Button>
            </FacetInputGroup>
            {currentTrait.facets.length > 0 && (
              <FacetList>
                {currentTrait.facets.map((facet, index) => (
                  <FacetTag key={index}>
                    {facet}
                    <RemoveButton onClick={() => handleRemoveFacet(index)}>×</RemoveButton>
                  </FacetTag>
                ))}
              </FacetList>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={handleAddTrait}>
              Add Trait to Model
            </Button>
          </ButtonGroup>
        </TraitForm>

        {traits.length > 0 && (
          <>
            <SubsectionTitle>Added Traits ({traits.length})</SubsectionTitle>
            <TraitList>
              {traits.map((trait, index) => (
                <TraitCard key={index}>
                  <TraitHeader>
                    <TraitTitle>{trait.displayName}</TraitTitle>
                    <RemoveButton onClick={() => handleRemoveTrait(index)}>Remove</RemoveButton>
                  </TraitHeader>
                  <TraitDescription>{trait.description}</TraitDescription>
                  {trait.facets.length > 0 && (
                    <FacetList>
                      {trait.facets.map((facet, fIndex) => (
                        <FacetTag key={fIndex}>{facet}</FacetTag>
                      ))}
                    </FacetList>
                  )}
                </TraitCard>
              ))}
            </TraitList>
          </>
        )}

        <ButtonGroup>
          <Button type="button" onClick={handleCreateModel}>
            Create Model & Generate Configuration
          </Button>
        </ButtonGroup>
      </Section>
    </Container>
  );
};

export default ModelManagement;

// Styled Components
const Container = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 24px;
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
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
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
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #718096;
  margin: 0;
`;

const TraitForm = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
`;

const FacetInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const FacetList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const FacetTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #ebf8ff;
  color: #2c5282;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 0;
  margin-left: 4px;
  transition: color 0.2s;

  &:hover {
    color: #c53030;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.variant === 'secondary' ? '#4a5568' : 'white')};
  background: ${(props) => (props.variant === 'secondary' ? '#e2e8f0' : '#3182ce')};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.variant === 'secondary' ? '#cbd5e0' : '#2c5282')};
  }
`;

const TraitList = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
`;

const TraitCard = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
`;

const TraitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TraitTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const TraitDescription = styled.p`
  font-size: 14px;
  color: #4a5568;
  margin: 8px 0;
`;
