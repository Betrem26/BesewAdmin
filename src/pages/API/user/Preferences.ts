export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface NotificationPreferences {
    jobAlerts: boolean;
    applicationUpdates: boolean;
    weeklyDigest: boolean;
    marketingCommunications: boolean;
  }
  
  export interface UserPreferences {
    personalInfo: PersonalInfo;
    notifications: NotificationPreferences;
  }
  
  const STORAGE_KEY = 'userPreferences';
  
  class PreferencesService {
    // Get user preferences from localStorage
    async getUserPreferences(): Promise<UserPreferences> {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
        // Return default values if nothing stored
        return this.getDefaultPreferences();
      } catch (error) {
        console.error('Error loading preferences:', error);
        return this.getDefaultPreferences();
      }
    }
  
    // Save user preferences to localStorage
    async updateUserPreferences(preferences: UserPreferences): Promise<void> {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving preferences:', error);
        throw error;
      }
    }
  
    // Get default preferences (replace with your actual user data)
    private getDefaultPreferences(): UserPreferences {
      return {
        personalInfo: {
          firstName: 'Your First Name', // Replace with actual user data
          lastName: 'Your Last Name',   // Replace with actual user data
          email: 'your.email@example.com', // Replace with actual user data
          phoneNumber: '+1234567890'    // Replace with actual user data
        },
        notifications: {
          jobAlerts: true,
          applicationUpdates: true,
          weeklyDigest: false,
          marketingCommunications: false
        }
      };
    }
  
    // Keep mock methods for backward compatibility
    async getMockUserPreferences(): Promise<UserPreferences> {
      return this.getUserPreferences();
    }
  
    async mockUpdateUserPreferences(preferences: UserPreferences): Promise<void> {
      return this.updateUserPreferences(preferences);
    }
  }
  
  export const preferencesService = new PreferencesService();