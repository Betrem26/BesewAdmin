import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

/**
 * Hook to handle admin role elevation for job service calls.
 * 
 * The job service expects 'user' or 'agency' roles, but admin users
 * should have access to all endpoints. This hook provides utilities
 * to check if the current user is an admin and can access job service.
 */
export const useJobServiceAuth = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  const isAgency = user?.role === 'agency';
  
  // Admin users should have access to all job service endpoints
  const canAccessJobService = isAdmin || isUser || isAgency;

  // Decode JWT to get full claims
  const getTokenClaims = () => {
    if (!accessToken) return null;
    try {
      const parts = accessToken.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch (e) {
      return null;
    }
  };

  const claims = getTokenClaims();

  return {
    isAdmin,
    isUser,
    isAgency,
    canAccessJobService,
    userRole: user?.role,
    claims,
    partyId: user?.party_id,
  };
};
