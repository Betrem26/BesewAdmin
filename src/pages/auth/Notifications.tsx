import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;

  // Job-related notifications
  jobAlerts: boolean;
  applicationUpdates: boolean;
  recruitersMessages: boolean;
  jobRecommendations: boolean;
  salaryInsights: boolean;

  // Network notifications
  connectionRequests: boolean;
  connectionAccepted: boolean;
  profileViews: boolean;
  endorsements: boolean;
  recommendations: boolean;

  // Content notifications
  postsFromConnections: boolean;
  commentsOnPosts: boolean;
  mentionsInPosts: boolean;
  industryNews: boolean;
  companyUpdates: boolean;

  // Account notifications
  securityAlerts: boolean;
  loginNotifications: boolean;
  passwordChanges: boolean;
  accountUpdates: boolean;

  // Marketing notifications
  productUpdates: boolean;
  promotionalEmails: boolean;
  eventInvitations: boolean;
  surveys: boolean;

  // Frequency settings
  emailFrequency: 'immediately' | 'daily' | 'weekly' | 'monthly';
  pushFrequency: 'immediately' | 'daily' | 'weekly' | 'never';
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,

    jobAlerts: true,
    applicationUpdates: true,
    recruitersMessages: true,
    jobRecommendations: false,
    salaryInsights: true,

    connectionRequests: true,
    connectionAccepted: true,
    profileViews: false,
    endorsements: true,
    recommendations: true,

    postsFromConnections: true,
    commentsOnPosts: true,
    mentionsInPosts: true,
    industryNews: false,
    companyUpdates: true,

    securityAlerts: true,
    loginNotifications: true,
    passwordChanges: true,
    accountUpdates: true,

    productUpdates: false,
    promotionalEmails: false,
    eventInvitations: true,
    surveys: false,

    emailFrequency: 'daily',
    pushFrequency: 'immediately',
    quietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const loadNotificationSettings = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('https://notify.besewonline.com/notification/settings', {
        headers: {
          // Add auth token if required
          // Authorization: `Bearer ${userToken}`,
        },
      });
      setNotificationSettings(res.data);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      alert('Failed to load notification settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const handleToggleChange = (field: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setIsSaved(false);
  };

  const handleSelectChange = (field: keyof NotificationSettings, value: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put('https://notify.besewonline.com/notification/settings', notificationSettings, {
        headers: {
          // Add auth token if required
          // Authorization: `Bearer ${userToken}`,
        },
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    loadNotificationSettings();
    setIsSaved(false);
  };

  const toggleAllNotifications = (enabled: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      emailNotifications: enabled,
      pushNotifications: enabled,
      jobAlerts: enabled,
      applicationUpdates: enabled,
      recruitersMessages: enabled,
      connectionRequests: enabled,
      connectionAccepted: enabled,
      postsFromConnections: enabled,
      commentsOnPosts: enabled,
      mentionsInPosts: enabled,
      endorsements: enabled,
      recommendations: enabled,
      companyUpdates: enabled,
      securityAlerts: true, // Always keep security alerts on
      loginNotifications: true,
      passwordChanges: true,
      accountUpdates: enabled
    }));
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
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">Manage how and when you receive notifications.</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Quick Actions</h3>
            <p className="text-sm text-blue-700">Enable or disable all notifications at once</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleAllNotifications(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Enable All
            </button>
            <button
              onClick={() => toggleAllNotifications(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Disable All
            </button>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Notification Channels</h2>
        </div>
        <p className="text-gray-600 mb-6">Choose how you want to receive notifications.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-600">Receive notifications via email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={() => handleToggleChange('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-gray-600">Receive notifications on your device</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={() => handleToggleChange('pushNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">SMS Notifications</div>
              <div className="text-sm text-gray-600">Receive important notifications via text message</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={() => handleToggleChange('smsNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Job & Career Notifications */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Job & Career</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Job Alerts</div>
              <div className="text-sm text-gray-600">New job postings matching your criteria</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.jobAlerts}
                onChange={() => handleToggleChange('jobAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Application Updates</div>
              <div className="text-sm text-gray-600">Status changes on your job applications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.applicationUpdates}
                onChange={() => handleToggleChange('applicationUpdates')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Recruiter Messages</div>
              <div className="text-sm text-gray-600">Messages from recruiters and hiring managers</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.recruitersMessages}
                onChange={() => handleToggleChange('recruitersMessages')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Job Recommendations</div>
              <div className="text-sm text-gray-600">Personalized job suggestions based on your profile</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.jobRecommendations}
                onChange={() => handleToggleChange('jobRecommendations')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Salary Insights</div>
              <div className="text-sm text-gray-600">Compensation trends and market insights</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.salaryInsights}
                onChange={() => handleToggleChange('salaryInsights')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Network Notifications */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Network & Connections</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Connection Requests</div>
              <div className="text-sm text-gray-600">New invitations to connect</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.connectionRequests}
                onChange={() => handleToggleChange('connectionRequests')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Connection Accepted</div>
              <div className="text-sm text-gray-600">When someone accepts your connection request</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.connectionAccepted}
                onChange={() => handleToggleChange('connectionAccepted')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Profile Views</div>
              <div className="text-sm text-gray-600">When someone views your profile</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.profileViews}
                onChange={() => handleToggleChange('profileViews')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Endorsements</div>
              <div className="text-sm text-gray-600">When someone endorses your skills</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.endorsements}
                onChange={() => handleToggleChange('endorsements')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Recommendations</div>
              <div className="text-sm text-gray-600">Requests for recommendations</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.recommendations}
                onChange={() => handleToggleChange('recommendations')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Frequency Settings */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Frequency & Timing</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Email Frequency</h3>
            <select
              value={notificationSettings.emailFrequency}
              onChange={(e) => handleSelectChange('emailFrequency', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="immediately">Immediately</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
              <option value="monthly">Monthly digest</option>
            </select>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Push Frequency</h3>
            <select
              value={notificationSettings.pushFrequency}
              onChange={(e) => handleSelectChange('pushFrequency', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="immediately">Immediately</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Quiet Hours</h3>
              <p className="text-sm text-gray-600">Disable push notifications during specific hours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.quietHours}
                onChange={() => handleToggleChange('quietHours')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {notificationSettings.quietHours && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={notificationSettings.quietHoursStart}
                  onChange={(e) => handleSelectChange('quietHoursStart', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={notificationSettings.quietHoursEnd}
                  onChange={(e) => handleSelectChange('quietHoursEnd', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Notifications */}
      <div className="bg-red-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="text-lg font-medium text-red-900">Security Notifications</h2>
        </div>
        <p className="text-red-700 mb-4">These notifications help protect your account and cannot be disabled.</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
            <div>
              <div className="font-medium text-gray-900">Security Alerts</div>
              <div className="text-sm text-gray-600">Suspicious activity and security warnings</div>
            </div>
            <div className="w-11 h-6 bg-red-600 rounded-full relative">
              <div className="absolute top-[2px] right-[2px] bg-white border border-red-300 rounded-full h-5 w-5"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
            <div>
              <div className="font-medium text-gray-900">Login Notifications</div>
              <div className="text-sm text-gray-600">New device or location sign-ins</div>
            </div>
            <div className="w-11 h-6 bg-red-600 rounded-full relative">
              <div className="absolute top-[2px] right-[2px] bg-white border border-red-300 rounded-full h-5 w-5"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
            <div>
              <div className="font-medium text-gray-900">Password Changes</div>
              <div className="text-sm text-gray-600">Confirmation of password updates</div>
            </div>
            <div className="w-11 h-6 bg-red-600 rounded-full relative">
              <div className="absolute top-[2px] right-[2px] bg-white border border-red-300 rounded-full h-5 w-5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`px-6 py-2 rounded-md text-white ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : isSaved
              ? 'bg-green-600'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoading ? 'Saving...' : isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}