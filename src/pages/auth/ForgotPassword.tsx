import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { generateVerificationCode, sendVerificationSMS, storeVerificationData } from '../../services/smsService';
import besewLogo from '../../assets/besew-logo.jpg';

// All your styled components stay the same...
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

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 BUTTON CLICKED! Starting SMS process...');
    
    setLoading(true);
    setError('');
    setSuccess('');

    if (!phoneNumber.trim()) {
      console.log('❌ No phone number entered');
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    const phoneRegex = /^(\+251|251|0)?[97]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      console.log('❌ Invalid phone format');
      setError('Please enter a valid Ethiopian phone number');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Checking if phone exists in signup data...');
      const signupDataString = localStorage.getItem('signupData');
      
      if (!signupDataString) {
        console.log('❌ No signup data found');
        setError('No account found with this phone number. Please sign up first.');
        setLoading(false);
        return;
      }

      const signupData = JSON.parse(signupDataString);
      console.log('📋 Signup data:', signupData);

      const normalizePhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) return cleaned.substring(1);
        if (cleaned.startsWith('251')) return cleaned.substring(3);
        return cleaned;
      };

      const inputNormalized = normalizePhone(phoneNumber);
      const storedNormalized = normalizePhone(signupData.phonenumber);
      
      console.log('📞 Phone comparison:', inputNormalized, 'vs', storedNormalized);

      if (inputNormalized !== storedNormalized) {
        console.log('❌ Phone numbers do not match');
        setError('Phone number not found. Please check your phone number.');
        setLoading(false);
        return;
      }

      console.log('✅ Phone number found! Generating code...');
      const verificationCode = generateVerificationCode();
      console.log('🔢 Generated code:', verificationCode);
      
      console.log('📤 Calling sendVerificationSMS...');
      const smsSent = await sendVerificationSMS(phoneNumber, verificationCode);
      console.log('📥 SMS sent result:', smsSent);
      
      if (smsSent) {
        console.log('✅ SMS sent successfully!');
        storeVerificationData(phoneNumber, verificationCode);
        setSuccess('✅ SMS sent to your phone! Check your messages.');
        
        setTimeout(() => {
          console.log('🔄 Navigating to reset password...');
          navigate('/reset-password');
        }, 2000);
      } else {
        console.log('❌ SMS sending failed');
        setError('❌ Failed to send SMS. Please check your internet connection.');
      }

    } catch (error) {
      console.error('💥 Error in handleSendCode:', error);
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
        <Title>Forgot Password</Title>
        <Description>
          Enter your phone number to receive a verification code via SMS.
        </Description>
        
        <InfoMessage>
          📱 We'll send a 6-digit code to your phone number
        </InfoMessage>
        
        <form onSubmit={handleSendCode}>
          <Label htmlFor="phonenumber">Phone Number *</Label>
          <Input
            id="phonenumber"
            name="phonenumber"
            type="tel"
            placeholder="phone number"
            value={phoneNumber}
            onChange={handleInputChange}
            required
          />

          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending SMS...' : 'Send Verification Code'}
          </Button>
        </form>
        
        <LinkText>
          Remember your password? <Link onClick={() => navigate('/signin')}>Sign In</Link>
        </LinkText>
      </FormWrapper>
    </Container>
  );
};

export default ForgotPassword;