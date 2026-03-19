import React, { useState } from 'react';
import styled from 'styled-components';
import { jobCommonApi } from '../../services/jobCommonApi';
import { jobVacanciesApi } from '../../services/jobVacanciesApi';
import { jobPostsApi } from '../../services/jobPostsApi';
import { vacancyTemplateApi } from '../../services/vacancyTemplateApi';
import { scheduledPostsApi } from '../../services/scheduledPostsApi';
import { vacancyStatusApi } from '../../services/vacancyStatusApi';
import { appliedJobsApi } from '../../services/appliedJobsApi';
import { applicantJobTransfersApi } from '../../services/applicantJobTransfersApi';
import { accountApi } from '../../services/api';
import { FiActivity, FiBriefcase, FiSend, FiSearch, FiFileText, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 20px;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'success' | 'info' }>`
  background: ${props => props.variant === 'danger' ? '#fff5f5' : props.variant === 'success' ? '#f0fff4' : '#f8f9fa'};
  border: 1px solid ${props => props.variant === 'danger' ? '#feb2b2' : props.variant === 'success' ? '#9ae6b4' : '#dee2e6'};
  padding: 12px;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#fed7d7' : props.variant === 'success' ? '#c6f6d5' : '#e9ecef'};
    transform: translateY(-2px);
  }

  span:first-child {
    font-weight: 600;
    font-size: 14px;
    color: #495057;
  }

  span:last-child {
    font-size: 11px;
    color: #6c757d;
  }
`;

const ResponseView = styled.pre`
  background: #2d3436;
  color: #dfe6e9;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
  max-height: 400px;
  font-size: 12px;
  margin-top: 20px;
`;

const DiagnosticLog = styled.div`
  background: #fffaf0;
  border: 1px solid #fbd38d;
  color: #c05621;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 1.5;
`;

const JobTest: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<any>(null);

  const handleAction = async (name: string, apiCall: () => Promise<any>) => {
    setLoading(true);
    setResponse(null);
    setLastError(null);
    console.log(`[JobTest] Executing ${name}...`);
    try {
      toast.info(`Calling ${name}...`);
      const data = await apiCall();
      setResponse(data);
      toast.success(`${name} Success!`);
    } catch (error: any) {
      console.error(`[JobTest] ${name} Failed:`, error);
      setLastError(error);
      setResponse({ 
        error: error.message,
        details: 'Check browser console (F12) for Network/CORS errors'
      });
      toast.error(`${name} Failed!`);
    } finally {
      setLoading(false);
    }
  };

  const checkConnectivity = async () => {
    handleAction('Ping Account Service', async () => {
        const res = await accountApi.get('/health');
        return { message: 'Account Service is Reachable!', data: res.data };
    });
  };

  return (
    <Container>
      <h1>Job API Implementation Test Dashboard</h1>
      <p style={{ marginBottom: '30px', color: '#636e72' }}>
        Use this page to manually trigger and verify the endpoints from the recent implementations.
      </p>

      {lastError && (
        <DiagnosticLog>
          <strong><FiAlertTriangle /> Diagnostic Info:</strong><br />
          If you see "No response from server", it often means:<br />
          1. The Job API domain (<strong>https://jobs.besewonline.com</strong>) is down or unreachable.<br />
          2. The browser is blocking the request due to <strong>CORS</strong> (check F12 Console).<br />
          3. We might need to prepend <strong>/api</strong> to the base URL in src/services/api.ts.
        </DiagnosticLog>
      )}

      {/* Diagnostics Section */}
      <Section>
        <SectionTitle><FiActivity /> Diagnostics</SectionTitle>
        <ButtonGrid>
          <ActionButton variant="success" onClick={checkConnectivity}>
            <span>Ping Account Service</span>
            <span>Verify if account.besewonline.com is up</span>
          </ActionButton>
          <ActionButton variant="danger" onClick={() => handleAction('Ping Job Service Health', () => accountApi.get('https://jobs.besewonline.com/health'))}>
            <span>Ping Job Service Health</span>
            <span>Direct check to jobs.besewonline.com/health</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Job Common Section */}
      <Section>
        <SectionTitle><FiBriefcase /> Job Common APIs</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get All Common Jobs', () => jobCommonApi.getAllCommonJobs())}>
            <span>Get All Common Jobs</span>
            <span>GET /job-common</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Get Categories by Language', () => jobCommonApi.getCategoryByLanguage({ lang: 'en' }))}>
            <span>Categories (Language: EN)</span>
            <span>GET /job-common/catagory-by-language</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Get Jobs Added by Admin', () => jobCommonApi.getJobsAddedByAdmin())}>
            <span>Jobs Added by Admin</span>
            <span>POST /job-common/added-by-admin</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Vacancies Section */}
      <Section>
        <SectionTitle><FiSearch /> Job Vacancies APIs</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get Public List', () => jobVacanciesApi.getPublicVacancies())}>
            <span>Public Vacancy List</span>
            <span>GET /vacancies/public/list</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Get My Vacancies', () => jobVacanciesApi.getMyVacancies())}>
            <span>My Vacancies</span>
            <span>GET /vacancies/my-vacancies</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Background Health', () => jobVacanciesApi.checkBackgroundServicesHealth())}>
            <span>Check Background Health</span>
            <span>GET /vacancies/health/background-services</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Job Posts Section */}
      <Section>
        <SectionTitle><FiSend /> Job Posts APIs</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get All Posts', () => jobPostsApi.getAllPosts())}>
            <span>Get All Posts</span>
            <span>GET /posts</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Get Startup Posts', () => jobPostsApi.getStartupPosts())}>
            <span>Get Startup Oportunities</span>
            <span>GET /posts/startupposts</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Get Active Posts', () => jobPostsApi.getActivePosts())}>
            <span>Get All Active Posts</span>
            <span>GET /posts/active</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('My Unexpired Jobs', () => jobPostsApi.getMyUnexpiredJobs())}>
            <span>My Unexpired Jobs</span>
            <span>GET /posts/my-unexpired-jobs</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Vacancy Templates Section */}
      <Section>
        <SectionTitle><FiFileText /> Vacancy Templates</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get All Templates', () => vacancyTemplateApi.getAllTemplates())}>
            <span>Get All Templates</span>
            <span>GET /vacancy-template</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Scheduled Posts Section */}
      <Section>
        <SectionTitle><FiActivity /> Scheduled Posts</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get Scheduled Posts', () => scheduledPostsApi.getAllScheduledPosts())}>
            <span>Get All Scheduled Posts</span>
            <span>GET /scheduled-posts</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Scheduled Count (March)', () => scheduledPostsApi.getScheduledPostsCount('March'))}>
            <span>Scheduled Count (March)</span>
            <span>GET /scheduled-posts/count/March</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Schedule by Vacancy ID', () => scheduledPostsApi.getScheduleByVacancyId('test-id'))}>
            <span>Get Schedule by Vacancy ID</span>
            <span>GET /scheduled-posts/schedule-by-vacancyid/...</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Vacancy Lifecycle Section */}
      <Section>
        <SectionTitle><FiShield /> Vacancy Lifecycle (Statuses)</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get All Statuses', () => vacancyStatusApi.getAllStatuses())}>
            <span>Get All Statuses</span>
            <span>GET /vacancy-statuses</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Get Jobs Status', () => vacancyStatusApi.getJobsStatus())}>
            <span>Get Jobs Status</span>
            <span>GET /vacancy-statuses/jobs-status</span>
          </ActionButton>
          <ActionButton variant="info" onClick={() => handleAction('Verify Vacancy', () => vacancyStatusApi.verifyVacancy('test-id'))}>
            <span>Verify Vacancy</span>
            <span>POST /vacancy-statuses/.../verify</span>
          </ActionButton>
          <ActionButton variant="danger" onClick={() => handleAction('Revoke Vacancy', () => vacancyStatusApi.revokeVacancy('test-id', { reason: 'Policy violation' }))}>
            <span>Revoke Vacancy (Admin)</span>
            <span>POST /vacancy-statuses/.../revoke</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Applied Jobs Section */}
      <Section>
        <SectionTitle><FiActivity /> Job Applications (Applied Jobs)</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get All Applications', () => appliedJobsApi.getAllApplications())}>
            <span>Get All Applications</span>
            <span>GET /applied-jobs</span>
          </ActionButton>
          <ActionButton variant="success" onClick={() => handleAction('Apply to Job', () => appliedJobsApi.applyToJob({ jobId: 'test-job' }))}>
            <span>Apply to Job</span>
            <span>POST /applied-jobs</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Applicants Status', () => appliedJobsApi.getJobApplicantsStatus())}>
            <span>Job Applicants Status</span>
            <span>GET /applied-jobs/job-applicants-status</span>
          </ActionButton>
          <ActionButton onClick={() => handleAction('Shortlisted Candidates', () => appliedJobsApi.getShortlistedCandidates('test-vacancy'))}>
            <span>Shortlisted Candidates</span>
            <span>GET /applied-jobs/get-shortlisted-candidates/...</span>
          </ActionButton>
          <ActionButton variant="info" onClick={() => handleAction('Update App Status', () => appliedJobsApi.updateApplicationStatus('test-id', 'Shortlisted'))}>
            <span>Shortlist Candidate</span>
            <span>PATCH /applied-jobs/.../status</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {/* Applicant Transfers Section */}
      <Section>
        <SectionTitle><FiSend /> Applicant Job Transfers</SectionTitle>
        <ButtonGrid>
          <ActionButton onClick={() => handleAction('Get All Transfers', () => applicantJobTransfersApi.getAllTransfers())}>
            <span>Get All Transfers</span>
            <span>GET /applicant-job-transfers</span>
          </ActionButton>
          <ActionButton variant="success" onClick={() => handleAction('Create Transfer', () => applicantJobTransfersApi.createTransfer({ vacancyId: 'test' }))}>
            <span>Create Transfer</span>
            <span>POST /applicant-job-transfers</span>
          </ActionButton>
        </ButtonGrid>
      </Section>

      {loading && <p>Processing... Please wait.</p>}
      
      {response && (
        <Section>
          <SectionTitle><FiFileText /> API Response</SectionTitle>
          <ResponseView>
            {JSON.stringify(response, null, 2)}
          </ResponseView>
        </Section>
      )}
    </Container>
  );
};

export default JobTest;
