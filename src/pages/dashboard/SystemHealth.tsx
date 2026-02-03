import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import monitoringApi from '../../services/monitoringApi';

const Container = styled.div`
  max-width: 1400px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 30px;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const RefreshButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const ServiceCard = styled.div<{ status: 'healthy' | 'unhealthy' | 'error' }>`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => 
    props.status === 'healthy' ? '#27ae60' : 
    props.status === 'unhealthy' ? '#e74c3c' : '#f39c12'
  };
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ServiceName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

const StatusBadge = styled.div<{ status: 'healthy' | 'unhealthy' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.status === 'healthy' ? '#d4edda' : 
    props.status === 'unhealthy' ? '#f8d7da' : '#fff3cd'
  };
  color: ${props => 
    props.status === 'healthy' ? '#155724' : 
    props.status === 'unhealthy' ? '#721c24' : '#856404'
  };
`;

const ServiceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const DetailLabel = styled.span`
  color: #7f8c8d;
`;

const DetailValue = styled.span`
  color: #2c3e50;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c0392b;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-top: 12px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 16px;
  color: #7f8c8d;
`;

const OverallStatus = styled.div<{ healthy: boolean }>`
  background: ${props => props.healthy ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'};
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 600;
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: #95a5a6;
  text-align: right;
  margin-top: 20px;
`;

interface ServiceHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'error';
  response_time?: string;
  data?: any;
  error?: string;
}

const SystemHealth: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    checkServicesHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkServicesHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkServicesHealth = async () => {
    try {
      setLoading(true);
      const healthData = await monitoringApi.system.checkAllServicesHealth();
      setServices(healthData as ServiceHealth[]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to check services health:', error);
    } finally {
      setLoading(false);
    }
  };

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const totalCount = services.length;
  const allHealthy = healthyCount === totalCount;

  if (loading && services.length === 0) {
    return <LoadingMessage>Checking system health...</LoadingMessage>;
  }

  return (
    <Container>
      <HeaderActions>
        <div>
          <PageTitle>System Health Monitor</PageTitle>
          <PageSubtitle>Real-time health status of all microservices</PageSubtitle>
        </div>
        <RefreshButton onClick={checkServicesHealth} disabled={loading}>
          <FiRefreshCw style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </RefreshButton>
      </HeaderActions>

      <OverallStatus healthy={allHealthy}>
        {allHealthy ? <FiCheckCircle size={32} /> : <FiAlertCircle size={32} />}
        <div>
          {allHealthy 
            ? 'All Systems Operational' 
            : `${healthyCount} of ${totalCount} services healthy`
          }
        </div>
      </OverallStatus>

      <ServicesGrid>
        {services.map((service) => (
          <ServiceCard key={service.service} status={service.status}>
            <ServiceHeader>
              <ServiceName>{service.service} Service</ServiceName>
              <StatusBadge status={service.status}>
                {service.status === 'healthy' && <FiCheckCircle />}
                {service.status === 'unhealthy' && <FiXCircle />}
                {service.status === 'error' && <FiAlertCircle />}
                {service.status.toUpperCase()}
              </StatusBadge>
            </ServiceHeader>

            <ServiceDetails>
              {service.response_time && (
                <DetailRow>
                  <DetailLabel>Response Time:</DetailLabel>
                  <DetailValue>{service.response_time}</DetailValue>
                </DetailRow>
              )}
              
              {service.data && (
                <>
                  {service.data.status && (
                    <DetailRow>
                      <DetailLabel>Status:</DetailLabel>
                      <DetailValue>{service.data.status}</DetailValue>
                    </DetailRow>
                  )}
                  {service.data.version && (
                    <DetailRow>
                      <DetailLabel>Version:</DetailLabel>
                      <DetailValue>{service.data.version}</DetailValue>
                    </DetailRow>
                  )}
                  {service.data.uptime && (
                    <DetailRow>
                      <DetailLabel>Uptime:</DetailLabel>
                      <DetailValue>{service.data.uptime}</DetailValue>
                    </DetailRow>
                  )}
                </>
              )}
            </ServiceDetails>

            {service.error && (
              <ErrorMessage>
                <strong>Error:</strong> {service.error}
              </ErrorMessage>
            )}
          </ServiceCard>
        ))}
      </ServicesGrid>

      <LastUpdated>
        Last updated: {lastUpdated.toLocaleString()}
      </LastUpdated>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default SystemHealth;
