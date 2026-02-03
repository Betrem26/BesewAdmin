import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  preferencesService, 
  PersonalInfo, 
  NotificationPreferences, 
  UserPreferences 
} from '../API/user/Preferences';

export default function AccountPreferences() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    jobAlerts: true,
    applicationUpdates: true,
    weeklyDigest: false,
    marketingCommunications: false
  });

  const loadUserPreferences = async () => {
    try {
      const data = await preferencesService.getUserPreferences();
      setPersonalInfo(data.personalInfo);
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleNotificationChange = (field: keyof NotificationPreferences) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const preferences: UserPreferences = {
        personalInfo,
        notifications
      };

      await preferencesService.updateUserPreferences(preferences);
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    loadUserPreferences();
    setIsSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/settings')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Settings
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Account Preferences</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mt-2">Manage your personal information, job preferences, and account settings.</p>
      </div>

      {/* Personal Information Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
        </div>
        <p className="text-gray-600 mb-6">Update your basic profile information.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={personalInfo.phoneNumber}
              onChange={(e) => handlePersonalInfoChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h5l-5-5-5 5h5z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        </div>
        <p className="text-gray-600 mb-6">Choose how you want to be notified about job opportunities and updates.</p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Job Alerts</h3>
              <p className="text-sm text-gray-600">Receive notifications for matching job opportunities</p>
            </div>
            <ToggleSwitch
              checked={notifications.jobAlerts}
              onChange={() => handleNotificationChange('jobAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Application Updates</h3>
              <p className="text-sm text-gray-600">Get notified about application status changes</p>
            </div>
            <ToggleSwitch
              checked={notifications.applicationUpdates}
              onChange={() => handleNotificationChange('applicationUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Weekly Digest</h3>
              <p className="text-sm text-gray-600">Weekly summary of new opportunities and platform updates</p>
            </div>
            <ToggleSwitch
              checked={notifications.weeklyDigest}
              onChange={() => handleNotificationChange('weeklyDigest')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Marketing Communications</h3>
              <p className="text-sm text-gray-600">Product updates, career tips, and promotional content</p>
            </div>
            <ToggleSwitch
              checked={notifications.marketingCommunications}
              onChange={() => handleNotificationChange('marketingCommunications')}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white border-t border-gray-200 pt-6">
        <div className="flex items-center">
          {isSaved && (
            <div className="flex items-center text-green-600 mr-4">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              All changes saved
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};