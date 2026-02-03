import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #232f3e;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 40px;
`;

const Section = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #232f3e;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #232f3e;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const Button = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 8px;
`;

const Security: React.FC = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!passwordData.currentPassword.trim()) {
      setError('Current password is required');
      setLoading(false);
      return;
    }

    if (!passwordData.newPassword.trim()) {
      setError('New password is required');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      // Get current signup data from localStorage
      const signupDataString = localStorage.getItem('signupData');
      
      if (!signupDataString) {
        setError('No account found. Please sign up first.');
        setLoading(false);
        return;
      }

      const signupData = JSON.parse(signupDataString);

      // Verify current password matches
      if (signupData.password !== passwordData.currentPassword) {
        setError('Current password is incorrect');
        setLoading(false);
        return;
      }

      // Update password in localStorage
      const updatedSignupData = {
        ...signupData,
        password: passwordData.newPassword,
        lastPasswordUpdate: new Date().toISOString()
      };

      localStorage.setItem('signupData', JSON.stringify(updatedSignupData));

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccess('Password updated successfully! You can now sign in with your new password.');

    } catch (error) {
      console.error('Password update error:', error);
      setError('An error occurred while updating password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Sign in & Security</Title>
      <Subtitle>Manage your account security and login preferences.</Subtitle>

      <Section>
        <SectionTitle>Change Password</SectionTitle>
        <form onSubmit={handleUpdatePassword}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </div>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Section>
    </Container>
  );
};

export default Security;