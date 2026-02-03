import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdvertisingDataSettings {
  personalizedAds: boolean;
  profileForAds: boolean;
  activityForAds: boolean;
  thirdPartyData: boolean;
  demographicData: boolean;
  interestCategories: string[];
  adPersonalization: 'full' | 'limited' | 'none';
  dataRetention: '1_year' | '2_years' | '5_years' | 'indefinite';
  crossDeviceTracking: boolean;
  locationBasedAds: boolean;
  socialInteractionAds: boolean;
  purchaseHistoryAds: boolean;
}

export default function AdvertisingData() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [adSettings, setAdSettings] = useState<AdvertisingDataSettings>({
    personalizedAds: true,
    profileForAds: true,
    activityForAds: false,
    thirdPartyData: false,
    demographicData: true,
    interestCategories: ['Technology', 'Business', 'Career Development'],
    adPersonalization: 'limited',
    dataRetention: '2_years',
    crossDeviceTracking: false,
    locationBasedAds: false,
    socialInteractionAds: true,
    purchaseHistoryAds: false
  });

  const availableInterests = [
    'Technology', 'Business', 'Career Development', 'Healthcare', 'Education',
    'Finance', 'Marketing', 'Sales', 'Design', 'Engineering', 'Consulting',
    'Real Estate', 'Legal', 'Non-profit', 'Government', 'Retail'
  ];

  const loadAdSettings = async () => {
    try {
      console.log('Loading advertising data settings...');
    } catch (error) {
      console.error('Failed to load advertising settings:', error);
    }
  };

  useEffect(() => {
    loadAdSettings();
  }, []);

  const handleToggleChange = (field: keyof AdvertisingDataSettings) => {
    setAdSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setIsSaved(false);
  };

  const handleRadioChange = (field: keyof AdvertisingDataSettings, value: string) => {
    setAdSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleInterestToggle = (interest: string) => {
    setAdSettings(prev => ({
      ...prev,
      interestCategories: prev.interestCategories.includes(interest)
        ? prev.interestCategories.filter(cat => cat !== interest)
        : [...prev.interestCategories, interest]
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving advertising settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    loadAdSettings();
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
        <h1 className="text-2xl font-semibold text-gray-900">Advertising Data</h1>
        <p className="text-gray-600 mt-2">Control how your data is used for advertising purposes.</p>
      </div>

      {/* Ad Personalization */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Ad Personalization Level</h2>
        </div>
        <p className="text-gray-600 mb-6">Choose how personalized you want your advertisements to be.</p>

        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="full"
              checked={adSettings.adPersonalization === 'full'}
              onChange={(e) => handleRadioChange('adPersonalization', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Full Personalization</div>
              <div className="text-sm text-gray-600">Show highly relevant ads based on all available data</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="limited"
              checked={adSettings.adPersonalization === 'limited'}
              onChange={(e) => handleRadioChange('adPersonalization', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Limited Personalization</div>
              <div className="text-sm text-gray-600">Show ads based on basic profile information only</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="none"
              checked={adSettings.adPersonalization === 'none'}
              onChange={(e) => handleRadioChange('adPersonalization', e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">No Personalization</div>
              <div className="text-sm text-gray-600">Show generic ads not based on your data</div>
            </div>
          </label>
        </div>
      </div>

      {/* Data Usage for Ads */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Data Usage</h2>
        </div>
        <p className="text-gray-600 mb-6">Choose what data can be used for advertising.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Use profile information for ads</div>
              <div className="text-sm text-gray-600">Job title, industry, skills, and experience level</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adSettings.profileForAds}
                onChange={() => handleToggleChange('profileForAds')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Use activity data for ads</div>
              <div className="text-sm text-gray-600">Page views, searches, and engagement patterns</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adSettings.activityForAds}
                onChange={() => handleToggleChange('activityForAds')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Use demographic data</div>
              <div className="text-sm text-gray-600">Age, location, and other demographic information</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adSettings.demographicData}
                onChange={() => handleToggleChange('demographicData')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Allow third-party data</div>
              <div className="text-sm text-gray-600">Data from partner websites and services</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adSettings.thirdPartyData}
                onChange={() => handleToggleChange('thirdPartyData')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Interest Categories */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Interest Categories</h2>
        </div>
        <p className="text-gray-600 mb-6">Select the topics you're interested in seeing ads about.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableInterests.map((interest) => (
            <label key={interest} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={adSettings.interestCategories.includes(interest)}
                onChange={() => handleInterestToggle(interest)}
                className="mr-2"
              />
              <span className="text-sm">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Advanced Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Cross-device tracking</div>
              <div className="text-sm text-gray-600">Connect your activity across different devices</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adSettings.crossDeviceTracking}
                onChange={() => handleToggleChange('crossDeviceTracking')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Location-based ads</div>
              <div className="text-sm text-gray-600">Show ads relevant to your current location</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adSettings.locationBasedAds}
                onChange={() => handleToggleChange('locationBasedAds')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Social interaction ads</div>
              <div className="text-sm text-gray-600">Ads based on connections' activities and interests</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adSettings.socialInteractionAds}
                onChange={() => handleToggleChange('socialInteractionAds')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Data Retention */}
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-3">Data Retention Period</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="1_year"
                checked={adSettings.dataRetention === '1_year'}
                onChange={(e) => handleRadioChange('dataRetention', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">1 year</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="2_years"
                checked={adSettings.dataRetention === '2_years'}
                onChange={(e) => handleRadioChange('dataRetention', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">2 years</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="5_years"
                checked={adSettings.dataRetention === '5_years'}
                onChange={(e) => handleRadioChange('dataRetention', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">5 years</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="indefinite"
                checked={adSettings.dataRetention === 'indefinite'}
                onChange={(e) => handleRadioChange('dataRetention', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Keep indefinitely</span>
            </label>
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
          className={`px-6 py-2 rounded-md text-white ${
            isLoading
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