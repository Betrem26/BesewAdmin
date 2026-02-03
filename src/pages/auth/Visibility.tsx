import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface VisibilitySettings {
  profileVisibility: 'public' | 'private' | 'hidden';
  jobSearchStatus: 'actively_looking' | 'open_to_offers' | 'not_looking' | 'stealth_mode';
  showEmail: 'everyone' | 'connections_only' | 'nobody';
  showPhone: 'everyone' | 'connections_only' | 'nobody';
  showSocialMedia: boolean;
  showWhenViewing: boolean;
  showOnlineStatus: boolean;
  showRecentActivity: boolean;
  hideLastSeen: boolean;
  showApplicationStatus: boolean;
  hideRejectedApplications: boolean;
  anonymousApplications: boolean;
  showConnections: boolean;
  hideFollowerCount: boolean;
  showMutualConnections: boolean;
}

export default function Visibility() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    profileVisibility: 'public',
    jobSearchStatus: 'open_to_offers',
    showEmail: 'connections_only',
    showPhone: 'nobody',
    showSocialMedia: true,
    showWhenViewing: true,
    showOnlineStatus: true,
    showRecentActivity: false,
    hideLastSeen: false,
    showApplicationStatus: true,
    hideRejectedApplications: true,
    anonymousApplications: false,
    showConnections: true,
    hideFollowerCount: false,
    showMutualConnections: true
  });

  const loadVisibilitySettings = async () => {
    try {
      // Mock API call - replace with real API
      console.log('Loading visibility settings...');
    } catch (error) {
      console.error('Failed to load visibility settings:', error);
    }
  };

  useEffect(() => {
    loadVisibilitySettings();
  }, []);

  const handleRadioChange = (field: keyof VisibilitySettings, value: string) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleToggleChange = (field: keyof VisibilitySettings) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving visibility settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    loadVisibilitySettings();
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
        <h1 className="text-2xl font-semibold text-gray-900">Visibility</h1>
        <p className="text-gray-600 mt-2">Control who can see your profile and activity.</p>
      </div>

      {/* Profile Discovery */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Profile Discovery</h2>
        </div>
        <p className="text-gray-600 mb-6">Choose who can find and view your profile.</p>

        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="public"
              checked={visibilitySettings.profileVisibility === 'public'}
              onChange={(e) => handleRadioChange('profileVisibility', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Public Profile</div>
              <div className="text-sm text-gray-600">Your profile is visible to everyone and appears in search results</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="private"
              checked={visibilitySettings.profileVisibility === 'private'}
              onChange={(e) => handleRadioChange('profileVisibility', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Private Profile</div>
              <div className="text-sm text-gray-600">Only your connections can view your full profile</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="hidden"
              checked={visibilitySettings.profileVisibility === 'hidden'}
              onChange={(e) => handleRadioChange('profileVisibility', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Hidden Profile</div>
              <div className="text-sm text-gray-600">Your profile doesn't appear in search results</div>
            </div>
          </label>
        </div>
      </div>

      {/* Job Search Visibility */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Job Search Visibility</h2>
        </div>
        <p className="text-gray-600 mb-6">Let recruiters know your availability status.</p>

        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="actively_looking"
              checked={visibilitySettings.jobSearchStatus === 'actively_looking'}
              onChange={(e) => handleRadioChange('jobSearchStatus', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Actively Looking</div>
              <div className="text-sm text-gray-600">Visible to all recruiters, prioritized in searches</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="open_to_offers"
              checked={visibilitySettings.jobSearchStatus === 'open_to_offers'}
              onChange={(e) => handleRadioChange('jobSearchStatus', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Open to Offers</div>
              <div className="text-sm text-gray-600">Available for opportunities but not actively searching</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="not_looking"
              checked={visibilitySettings.jobSearchStatus === 'not_looking'}
              onChange={(e) => handleRadioChange('jobSearchStatus', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Not Looking</div>
              <div className="text-sm text-gray-600">Hidden from recruiters and job recommendations</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="stealth_mode"
              checked={visibilitySettings.jobSearchStatus === 'stealth_mode'}
              onChange={(e) => handleRadioChange('jobSearchStatus', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Stealth Mode</div>
              <div className="text-sm text-gray-600">Browse jobs anonymously, current employer can't see activity</div>
            </div>
          </label>
        </div>
      </div>

      {/* Contact Information Privacy */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
        </div>
        <p className="text-gray-600 mb-6">Control who can see your contact details.</p>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Email Address Visibility</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="everyone"
                  checked={visibilitySettings.showEmail === 'everyone'}
                  onChange={(e) => handleRadioChange('showEmail', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Everyone</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="connections_only"
                  checked={visibilitySettings.showEmail === 'connections_only'}
                  onChange={(e) => handleRadioChange('showEmail', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Connections only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="nobody"
                  checked={visibilitySettings.showEmail === 'nobody'}
                  onChange={(e) => handleRadioChange('showEmail', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Nobody</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Phone Number Visibility</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="everyone"
                  checked={visibilitySettings.showPhone === 'everyone'}
                  onChange={(e) => handleRadioChange('showPhone', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Everyone</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="connections_only"
                  checked={visibilitySettings.showPhone === 'connections_only'}
                  onChange={(e) => handleRadioChange('showPhone', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Connections only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="nobody"
                  checked={visibilitySettings.showPhone === 'nobody'}
                  onChange={(e) => handleRadioChange('showPhone', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Nobody</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Social Media Profiles</h3>
              <p className="text-sm text-gray-600">Show links to your LinkedIn, GitHub, etc.</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.showSocialMedia}
              onChange={() => handleToggleChange('showSocialMedia')}
            />
          </div>
        </div>
      </div>

      {/* Browsing Privacy */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Browsing Privacy</h2>
        </div>
        <p className="text-gray-600 mb-6">Control your online presence and activity visibility.</p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Show When You View Profiles</h3>
              <p className="text-sm text-gray-600">Let others know when you've viewed their profile</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.showWhenViewing}
              onChange={() => handleToggleChange('showWhenViewing')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Show Online Status</h3>
              <p className="text-sm text-gray-600">Display when you're currently online</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.showOnlineStatus}
              onChange={() => handleToggleChange('showOnlineStatus')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Show Recent Activity</h3>
              <p className="text-sm text-gray-600">Display your recent profile updates and applications</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.showRecentActivity}
              onChange={() => handleToggleChange('showRecentActivity')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Hide Last Seen</h3>
              <p className="text-sm text-gray-600">Don't show when you were last active</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.hideLastSeen}
              onChange={() => handleToggleChange('hideLastSeen')}
            />
          </div>
        </div>
      </div>

      {/* Application Privacy */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Application Privacy</h2>
        </div>
        <p className="text-gray-600 mb-6">Control how your job applications are handled.</p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Show Application Status to Recruiters</h3>
              <p className="text-sm text-gray-600">Let recruiters see if you've applied to similar positions</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.showApplicationStatus}
              onChange={() => handleToggleChange('showApplicationStatus')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Hide Rejected Applications</h3>
              <p className="text-sm text-gray-600">Don't show applications that were declined</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.hideRejectedApplications}
              onChange={() => handleToggleChange('hideRejectedApplications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Anonymous Applications</h3>
              <p className="text-sm text-gray-600">Apply to jobs without revealing your identity initially</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.anonymousApplications}
              onChange={() => handleToggleChange('anonymousApplications')}
            />
          </div>
        </div>
      </div>

      {/* Network Privacy */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Network Privacy</h2>
        </div>
        <p className="text-gray-600 mb-6">Manage your professional network visibility.</p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Show Your Connections</h3>
              <p className="text-sm text-gray-600">Display your professional network to others</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.showConnections}
              onChange={() => handleToggleChange('showConnections')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Hide Follower Count</h3>
              <p className="text-sm text-gray-600">Don't display how many people follow you</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.hideFollowerCount}
              onChange={() => handleToggleChange('hideFollowerCount')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Show Mutual Connections</h3>
              <p className="text-sm text-gray-600">Display shared connections with other users</p>
            </div>
            <ToggleSwitch
              checked={visibilitySettings.showMutualConnections}
              onChange={() => handleToggleChange('showMutualConnections')}
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