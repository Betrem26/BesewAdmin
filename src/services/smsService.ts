// SMS Service - Real SMS to your phone
const SMS_API_URL = 'https://api.besew.com/api/v1/sms/send';
const API_KEY = 'your-real-api-key-here'; // REPLACE THIS WITH YOUR REAL API KEY

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationSMS = async (phoneNumber: string, code: string): Promise<boolean> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = `Your BESEW verification code is: ${code}. This code will expire in 10 minutes.`;
    
    console.log('🚀 Attempting to send SMS to:', formattedPhone);
    console.log('📱 Message:', message);
    console.log('🔑 Using API:', SMS_API_URL);
    
    const requestBody = {
      phonenumber: formattedPhone,
      message: message,
      data: {
        templateId: "OTP",
        purpose: "verification",
        platformName: "BESEW Portal"
      }
    };
    
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SMS SENT SUCCESSFULLY!', result);
      return true;
    } else {
      const errorData = await response.text();
      console.error('❌ SMS API Error:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ SMS Network Error:', error);
    return false;
  }
};

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  console.log('📞 Formatting phone:', phone, '→', cleaned);
  
  if (cleaned.startsWith('0')) {
    const formatted = `+251${cleaned.substring(1)}`;
    console.log('📞 Formatted (0-prefix):', formatted);
    return formatted;
  }
  
  if (cleaned.startsWith('251')) {
    const formatted = `+${cleaned}`;
    console.log('📞 Formatted (251-prefix):', formatted);
    return formatted;
  }
  
  const formatted = `+251${cleaned}`;
  console.log('📞 Formatted (default):', formatted);
  return formatted;
};

export const storeVerificationData = (phoneNumber: string, code: string) => {
  const verificationData = {
    phoneNumber: formatPhoneNumber(phoneNumber),
    code,
    timestamp: Date.now(),
    expiresAt: Date.now() + (10 * 60 * 1000)
  };
  
  localStorage.setItem('passwordResetData', JSON.stringify(verificationData));
  console.log('💾 Verification data stored:', verificationData);
};

export const verifyResetCode = (inputCode: string): { isValid: boolean; phoneNumber?: string } => {
  try {
    const resetDataString = localStorage.getItem('passwordResetData');
    if (!resetDataString) {
      console.log('❌ No reset data found');
      return { isValid: false };
    }

    const resetData = JSON.parse(resetDataString);
    console.log('🔍 Checking code:', inputCode, 'against stored:', resetData.code);
    
    if (Date.now() > resetData.expiresAt) {
      console.log('⏰ Code expired');
      localStorage.removeItem('passwordResetData');
      return { isValid: false };
    }

    if (resetData.code === inputCode) {
      console.log('✅ Code is valid!');
      return { isValid: true, phoneNumber: resetData.phoneNumber };
    }

    console.log('❌ Code is invalid');
    return { isValid: false };
  } catch (error) {
    console.error('❌ Verification error:', error);
    return { isValid: false };
  }
};