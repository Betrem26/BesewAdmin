import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TwoFactorSetup() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'sms' | 'email' | 'authenticator'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'select' | 'verify' | 'complete'>('select');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 1500);
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    // Mock verification
    setTimeout(() => {
      setIsLoading(false);
      if (verificationCode === '123456') {
        setStep('complete');
      } else {
        alert('Invalid code. Try 123456');
      }
    }, 1500);
  };

  const handleComplete = () => {
    navigate('/signin-security');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate('/signin-security')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Security
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Two-Factor Authentication Setup</h1>
        <p className="text-gray-600 mt-2">Add an extra layer of security to your account</p>
      </div>

      {step === 'select' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Choose your preferred method:</h2>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="sms"
                  checked={method === 'sms'}
                  onChange={(e) => setMethod(e.target.value as 'sms')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">SMS Text Message</div>
                  <div className="text-sm text-gray-600">Receive codes via text message</div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="email"
                  checked={method === 'email'}
                  onChange={(e) => setMethod(e.target.value as 'email')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-600">Receive codes via email</div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="authenticator"
                  checked={method === 'authenticator'}
                  onChange={(e) => setMethod(e.target.value as 'authenticator')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Authenticator App</div>
                  <div className="text-sm text-gray-600">Use Google Authenticator or similar app</div>
                </div>
              </label>
            </div>
          </div>

          {method === 'sms' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {method === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {method === 'authenticator' && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Setup Instructions:</h3>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Download Google Authenticator or Authy</li>
                <li>2. Scan the QR code that will appear</li>
                <li>3. Enter the 6-digit code from your app</li>
              </ol>
            </div>
          )}

          <button
            onClick={handleSendCode}
            disabled={isLoading || (method === 'sms' && !phoneNumber) || (method === 'email' && !email)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up...' : 'Continue'}
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium mb-2">Verification Code Sent</h2>
            <p className="text-gray-600 mb-6">
              {method === 'sms' && `We sent a code to ${phoneNumber}`}
              {method === 'email' && `We sent a code to ${email}`}
              {method === 'authenticator' && 'Enter the code from your authenticator app'}
            </p>
          </div>

          {method === 'authenticator' && (
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code Here</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Scan with your authenticator app</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
            />
            <p className="text-sm text-gray-500 mt-2">Use code: 123456 (for demo)</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('select')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          <button
            onClick={handleSendCode}
            className="w-full text-blue-600 hover:text-blue-800 text-sm"
          >
            Resend Code
          </button>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Two-Factor Authentication Enabled!</h2>
            <p className="text-gray-600">Your account is now more secure with 2FA enabled.</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Important:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Save your backup codes safely</li>
              <li>• Keep your {method} device accessible</li>
              <li>• You'll need a code to sign in from now on</li>
            </ul>
          </div>
          <button
            onClick={handleComplete}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete Setup
          </button>
        </div>
      )}
    </div>
  );
}