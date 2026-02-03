import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { verifyResetCode } from '../../services/smsService';
import besewLogo from '../../assets/besew-logo.jpg';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 32px 28px;
  width: 350px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const Logo = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #232f3e;
  text-align: center;
  margin-bottom: 16px;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
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

const CodeInput = styled(Input)`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
`;

const Button = styled.button`
  width: 100%;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: #6c757d;
  
  &:hover {
    background: #545b62;
  }
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
  color: #232f3e;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 10px;
`;

const InfoMessage = styled.div`
  color: #007bff;
  font-size: 12px;
  margin-bottom: 16px;
  text-align: center;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  padding: 8px;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
`;

const Link = styled.span`
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleResendCode = async () => {
    // Redirect back to forgot password page
    navigate('/forgot-password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.verificationCode.trim()) {
      setError('Verification code is required');
      setLoading(false);
      return;
    }

    if (formData.verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      setLoading(false);
      return;
    }

    if (!formData.newPassword.trim()) {
      setError('New password is required');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Verify the code
      const verification = verifyResetCode(formData.verificationCode);
      
      if (!verification.isValid) {
        setError('Invalid or expired verification code. Please request a new code.');
        setLoading(false);
        return;
      }

      // Get and update signup data
      const signupDataString = localStorage.getItem('signupData');
      if (!signupDataString) {
        setError('Account data not found. Please sign up again.');
        setLoading(false);
        return;
      }

      const signupData = JSON.parse(signupDataString);
      
      // Update password
      const updatedSignupData = {
        ...signupData,
        password: formData.newPassword,
        lastPasswordReset: new Date().toISOString()
      };

      localStorage.setItem('signupData', JSON.stringify(updatedSignupData));
      
      // Clean up reset data
      localStorage.removeItem('passwordResetData');
      
      setSuccess('Password reset successful! Redirecting to dashboard...');
      
      // Auto redirect to dashboard after successful reset
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Logo onClick={() => navigate('/')}>
        <img src={besewLogo} alt="BESEW logo" style={{ height: 40 }} />
      </Logo>
      <FormWrapper>
        <Title>Reset Password</Title>
        <Description>
          Enter the 6-digit code sent to your phone and create a new password.
        </Description>
        
        <InfoMessage>
          📱 Check your SMS for the verification code
        </InfoMessage>
        
        <form onSubmit={handleResetPassword}>
          <Label htmlFor="verificationCode">Verification Code *</Label>
          <CodeInput
            id="verificationCode"
            name="verificationCode"
            type="text"
            placeholder="000000"
            value={formData.verificationCode}
            onChange={handleInputChange}
            maxLength={6}
            pattern="[0-9]{6}"
            required
          />
          
          <Label htmlFor="newPassword">New Password *</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
          />
          
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
          
          <SecondaryButton type="button" onClick={handleResendCode}>
            Didn't receive code? Resend
          </SecondaryButton>
        </form>
        
        <LinkText>
          Remember your password? <Link onClick={() => navigate('/signin')}>Sign In</Link>
        </LinkText>
      </FormWrapper>
    </Container>
  );
};

export default ResetPassword;