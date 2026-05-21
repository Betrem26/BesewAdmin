/**
 * Menu Management Utilities
 * Helper functions for menu operations and formatting
 */

/**
 * Format enum values for display (e.g., 'job_seeker' -> 'Job Seeker')
 */
export const formatEnumValue = (value: string): string => {
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Validate menu data before submission
 */
export const validateMenuData = (data: any, isCreate: boolean): string[] => {
  const errors: string[] = [];
  
  if (isCreate && !data.menuId?.trim()) {
    errors.push('Menu ID is required');
  }
  if (!data.label?.trim()) {
    errors.push('Label is required');
  }
  if (!data.path?.trim()) {
    errors.push('Path is required');
  }
  
  return errors;
};

/**
 * Prepare menu data for API submission
 * Converts enum values to UPPERCASE and ensures all required fields are present
 * isUpdate: true for PUT requests (excludes menuId), false for POST requests (includes menuId)
 */
export const prepareMenuData = (data: any, isUpdate: boolean = false): any => {
  // Process arrays - convert to lowercase (matching what backend stores)
  const processArray = (arr: any[]): string[] => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr
      .map((t: any) => String(t).trim().toLowerCase())
      .filter((t: string) => t && t.length > 0);
  };

  const prepared: any = {
    label: String(data.label || '').trim(),
    path: String(data.path || '').trim(),
    isActive: data.isActive === true,
    minTrustScore: parseInt(data.minTrustScore) || 0,
    order: parseInt(data.order) || 0,
    // Always include these arrays in UPPERCASE - backend requires them
    allowedUserTypes: processArray(data.allowedUserTypes || []),
    allowedWorkerTypes: processArray(data.allowedWorkerTypes || []),
    allowedSubscriptionTiers: processArray(data.allowedSubscriptionTiers || [])
  };

  // Only add optional fields if they have non-empty values
  // Don't send null/undefined — backend validation rejects them
  if (data.icon && String(data.icon).trim()) {
    prepared.icon = String(data.icon).trim();
  }
  if (data.description && String(data.description).trim()) {
    prepared.description = String(data.description).trim();
  }
  if (data.badge && String(data.badge).trim()) {
    prepared.badge = String(data.badge).trim().toUpperCase();
  }
  if (data.parentMenuId && String(data.parentMenuId).trim()) {
    prepared.parentMenuId = String(data.parentMenuId).trim();
  }

  // Only include menuId for CREATE operations (POST requests)
  if (!isUpdate) {
    prepared.menuId = String(data.menuId || '').trim();
  }

  return prepared;
};

/**
 * Get menu hierarchy level (for indentation in UI)
 */
export const getMenuLevel = (
  menuId: string,
  menuMap: Map<string, any>,
  visited = new Set<string>()
): number => {
  if (visited.has(menuId)) return 0; // Prevent infinite loops
  visited.add(menuId);
  
  const item = menuMap.get(menuId);
  if (!item?.parentMenuId) return 0;
  
  return 1 + getMenuLevel(item.parentMenuId, menuMap, visited);
};

/**
 * Sort menu items by hierarchy level and order
 */
export const sortMenuItems = (items: any[]): any[] => {
  const menuMap = new Map(items.map(item => [item.menuId, item]));
  
  return [...items].sort((a, b) => {
    const levelA = getMenuLevel(a.menuId, menuMap);
    const levelB = getMenuLevel(b.menuId, menuMap);
    if (levelA !== levelB) return levelA - levelB;
    return (a.order || 0) - (b.order || 0);
  });
};

/**
 * Check if a menu can be a parent (prevent circular references)
 */
export const canBeParent = (
  menuId: string,
  potentialParentId: string,
  menuMap: Map<string, any>
): boolean => {
  if (menuId === potentialParentId) return false;
  
  let current = menuMap.get(potentialParentId);
  const visited = new Set<string>();
  
  while (current?.parentMenuId) {
    if (visited.has(current.menuId)) break; // Prevent infinite loops
    visited.add(current.menuId);
    
    if (current.parentMenuId === menuId) return false; // Would create circular reference
    current = menuMap.get(current.parentMenuId);
  }
  
  return true;
};

/**
 * Format menu data for display
 */
export const formatMenuForDisplay = (menu: any) => {
  return {
    ...menu,
    userTypesDisplay: (menu.allowedUserTypes || [])
      .map((t: string) => formatEnumValue(t))
      .join(', ') || 'All',
    workerTypesDisplay: (menu.allowedWorkerTypes || [])
      .map((t: string) => formatEnumValue(t))
      .join(', ') || 'All',
    subscriptionTiersDisplay: (menu.allowedSubscriptionTiers || [])
      .map((t: string) => formatEnumValue(t))
      .join(', ') || 'All'
  };
};
