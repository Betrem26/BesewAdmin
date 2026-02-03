import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { generateQuestions, clearError, clearSuccessMessage } from '../../store/features/psychometricSlice';
import { toast } from 'react-toastify';

const Psychometric: React.FC = () => {
  const dispatch = useAppDispatch();
  const { generatedQuestions, loading, error, successMessage } = useAppSelector((state) => state.psychometric);
  const [formData, setFormData] = useState({
    model: 'openness',
    count: 10,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(generateQuestions({
      model: formData.model,
      count: formData.count,
      difficulty: formData.difficulty
    }));
  };

  return (
    <Container>
      <Header>
        <Title>Psychometric Question Management</Title>
        <Description>Generate and manage psychometric assessment questions using AI</Description>
      </Header>
      <Section>
        <SectionTitle>AI Question Generator</SectionTitle>
        <Form onSubmit={handleGenerate}>
          <FormGroup>
            <Label>Model/Trait</Label>
            <Select value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})}>
              <option value="big5">Big Five Personality</option>
              <option value="mbti">MBTI</option>
              <option value="disc">DISC</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Number of Questions</Label>
            <Input type="number" min="1" max="50" value={formData.count} onChange={(e) => setFormData({...formData, count: parseInt(e.target.value)})} />
          </FormGroup>
          <FormGroup>
            <Label>Difficulty Level</Label>
            <Select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </FormGroup>
          <Button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Questions'}</Button>
        </Form>
      </Section>
      {generatedQuestions && generatedQuestions.generatedQuestions && generatedQuestions.generatedQuestions.length > 0 && (
        <Section>
          <SectionTitle>Generated Questions ({generatedQuestions.generatedQuestions.length})</SectionTitle>
          <QuestionList>
            {generatedQuestions.generatedQuestions.map((q, idx) => (
              <QuestionCard key={idx}>
                <QuestionText>{q.questionText}</QuestionText>
                <QuestionMeta>Trait: {q.trait} | Difficulty: {q.difficulty}</QuestionMeta>
              </QuestionCard>
            ))}
          </QuestionList>
        </Section>
      )}
    </Container>
  );
};

export default Psychometric;

const Container = styled.div`padding: 24px;`;
const Header = styled.div`margin-bottom: 32px;`;
const Title = styled.h1`font-size: 28px; font-weight: 600; color: #1a202c; margin-bottom: 8px;`;
const Description = styled.p`font-size: 14px; color: #718096;`;
const Section = styled.div`background: white; border-radius: 8px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`;
const SectionTitle = styled.h2`font-size: 18px; font-weight: 600; color: #2d3748; margin-bottom: 16px;`;
const Form = styled.form`display: flex; flex-direction: column; gap: 16px;`;
const FormGroup = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const Label = styled.label`font-size: 14px; font-weight: 500; color: #4a5568;`;
const Input = styled.input`padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;`;
const Select = styled.select`padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;`;
const Button = styled.button`padding: 10px 24px; background: #3182ce; color: white; border: none; border-radius: 6px; cursor: pointer; &:hover { background: #2c5282; } &:disabled { background: #cbd5e0; cursor: not-allowed; }`;
const QuestionList = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const QuestionCard = styled.div`padding: 16px; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px;`;
const QuestionText = styled.p`font-size: 14px; color: #2d3748; margin-bottom: 8px;`;
const QuestionMeta = styled.p`font-size: 12px; color: #718096;`;
