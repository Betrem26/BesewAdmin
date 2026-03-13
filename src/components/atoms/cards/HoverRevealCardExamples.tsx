import React from 'react';
import styled from 'styled-components';
import HoverRevealCard from './HoverRevealCard';

// Container for the examples
const ExamplesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  min-height: 100vh;
`;

const SectionTitle = styled.h2`
  grid-column: 1 / -1;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const SectionSubtitle = styled.p`
  grid-column: 1 / -1;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

// Sample card content components
const FrontIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 16px 0 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const CardDescription = styled.p`
  font-size: 13px;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const RevealContentWrapper = styled.div`
  text-align: center;
`;

const RevealTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const RevealList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

const RevealListItem = styled.li`
  font-size: 12px;
  color: #475569;
  padding: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  &::before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
  }
`;

const ActionButton = styled.button`
  margin-top: 16px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

// Example data
const cardData = [
  {
    id: 1,
    icon: '📊',
    title: 'Analytics',
    description: 'View detailed insights',
    revealTitle: 'Quick Actions',
    details: ['View Reports', 'Export Data', 'Set Alerts', 'Compare Periods'],
    animationType: 'slide' as const,
    revealDirection: 'bottom' as const,
  },
  {
    id: 2,
    icon: '👥',
    title: 'Users',
    description: 'Manage user access',
    revealTitle: 'User Management',
    details: ['Add User', 'Edit Roles', 'View Activity', 'Remove Access'],
    animationType: 'fade' as const,
    revealDirection: 'bottom' as const,
  },
  {
    id: 3,
    icon: '⚙️',
    title: 'Settings',
    description: 'Configure system',
    revealTitle: 'Configuration',
    details: ['General', 'Security', 'Notifications', 'Integrations'],
    animationType: 'scale' as const,
    revealDirection: 'bottom' as const,
  },
  {
    id: 4,
    icon: '📈',
    title: 'Growth',
    description: 'Track performance',
    revealTitle: 'Growth Metrics',
    details: ['Monthly View', 'Yearly Trend', 'Forecasts', 'Benchmarks'],
    animationType: 'shimmer' as const,
    revealDirection: 'bottom' as const,
  },
  {
    id: 5,
    icon: '🔔',
    title: 'Notifications',
    description: 'Stay updated',
    revealTitle: 'Alert Center',
    details: ['System Alerts', 'User Updates', 'Task Reminders', 'Messages'],
    animationType: 'slide' as const,
    revealDirection: 'left' as const,
  },
  {
    id: 6,
    icon: '🔒',
    title: 'Security',
    description: 'Protect your data',
    revealTitle: 'Security Options',
    details: ['2FA Settings', 'Audit Log', 'API Keys', 'Access Tokens'],
    animationType: 'slide' as const,
    revealDirection: 'right' as const,
  },
];

const HoverRevealCardExamples: React.FC = () => {
  return (
    <ExamplesContainer>
      <SectionTitle>Interactive Hover Cards</SectionTitle>
      <SectionSubtitle>
        Beautiful cards that reveal dynamic content on hover with smooth animations
      </SectionSubtitle>

      {cardData.map((card) => (
        <HoverRevealCard
          key={card.id}
          width="280px"
          height="180px"
          background="#ffffff"
          animationType={card.animationType}
          revealDirection={card.revealDirection}
          hoverBoxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"
          hoverBorder="1px solid rgba(102, 126, 234, 0.4)"
          frontContent={
            <div>
              <FrontIcon>{card.icon}</FrontIcon>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </div>
          }
          revealContent={
            <RevealContentWrapper>
              <RevealTitle>{card.revealTitle}</RevealTitle>
              <RevealList>
                {card.details.map((detail, index) => (
                  <RevealListItem key={index}>{detail}</RevealListItem>
                ))}
              </RevealList>
              <ActionButton>View All</ActionButton>
            </RevealContentWrapper>
          }
        />
      ))}
    </ExamplesContainer>
  );
};

export default HoverRevealCardExamples;
