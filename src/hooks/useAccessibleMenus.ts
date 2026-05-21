import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { getAccessibleMenus } from '../store/features/menuConfigSlice';
import { RootState } from '../store/store';

interface MenuFilters {
  userType?: string;
  workerType?: string;
  subscriptionTier?: string;
  trustScore?: number;
}

/**
 * Custom hook for fetching accessible menus based on user context
 * 
 * Usage:
 * const { menus, loading, error, fetchAccessibleMenus } = useAccessibleMenus();
 * 
 * // Fetch menus for a specific user
 * fetchAccessibleMenus({
 *   userType: 'job_seeker',
 *   workerType: 'freelancer',
 *   subscriptionTier: 'premium',
 *   trustScore: 75
 * });
 */
export const useAccessibleMenus = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.menuConfig);

  const fetchAccessibleMenus = useCallback(
    (filters?: MenuFilters) => {
      dispatch(getAccessibleMenus(filters) as any);
    },
    [dispatch]
  );

  return {
    menus: items,
    loading,
    error,
    fetchAccessibleMenus
  };
};
