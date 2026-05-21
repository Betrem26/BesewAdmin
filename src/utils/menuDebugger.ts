/**
 * Menu Configuration Debugger
 * Provides utilities for debugging menu management issues in the browser console
 * 
 * Usage in browser console:
 * window.__debugMenuConfig()
 */

export const setupMenuDebugger = () => {
  const menuDebugger = {
    // Get current menu state from Redux
    getMenuState: () => {
      try {
        const state = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?.();
        console.log('Menu State:', state);
        return state;
      } catch (err) {
        console.error('Could not access Redux state:', err);
        return null;
      }
    },

    // Validate menu data structure
    validateMenuData: (data: any) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Check required fields
      if (!data.label || typeof data.label !== 'string') {
        errors.push('label is required and must be a string');
      }
      if (!data.path || typeof data.path !== 'string') {
        errors.push('path is required and must be a string');
      }

      // Check optional fields
      if (data.icon && typeof data.icon !== 'string') {
        warnings.push('icon should be a string');
      }
      if (data.description && typeof data.description !== 'string') {
        warnings.push('description should be a string');
      }

      // Check boolean field
      if (typeof data.isActive !== 'boolean') {
        warnings.push('isActive should be a boolean');
      }

      // Check numeric fields
      if (data.minTrustScore !== undefined && typeof data.minTrustScore !== 'number') {
        warnings.push('minTrustScore should be a number');
      }
      if (data.order !== undefined && typeof data.order !== 'number') {
        warnings.push('order should be a number');
      }

      // Check array fields
      if (data.allowedUserTypes && !Array.isArray(data.allowedUserTypes)) {
        warnings.push('allowedUserTypes should be an array');
      }
      if (data.allowedWorkerTypes && !Array.isArray(data.allowedWorkerTypes)) {
        warnings.push('allowedWorkerTypes should be an array');
      }
      if (data.allowedSubscriptionTiers && !Array.isArray(data.allowedSubscriptionTiers)) {
        warnings.push('allowedSubscriptionTiers should be an array');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        summary: `${errors.length} errors, ${warnings.length} warnings`
      };
    },

    // Sanitize menu data (same as frontend function)
    sanitizeData: (data: any) => {
      // Helper to convert to lowercase
      const toLowerCase = (value: string): string => String(value).toLowerCase();
      
      // Helper to handle empty strings - convert to null
      const emptyToNull = (value: any): any => {
        if (value === '' || value === undefined) return null;
        return value;
      };

      return {
        menuId: String(data.menuId || '').trim(), // Include menuId in payload
        label: String(data.label || '').trim(),
        path: String(data.path || '').trim(),
        icon: emptyToNull(data.icon ? String(data.icon).trim() : ''),
        description: emptyToNull(data.description ? String(data.description).trim() : ''),
        badge: emptyToNull(data.badge ? String(data.badge).trim() : ''),
        isActive: data.isActive === true,
        minTrustScore: parseInt(data.minTrustScore) || 0,
        // Transform arrays to lowercase
        allowedUserTypes: Array.isArray(data.allowedUserTypes) 
          ? data.allowedUserTypes.map((t: any) => toLowerCase(t)).filter((t: string) => t)
          : [],
        allowedWorkerTypes: Array.isArray(data.allowedWorkerTypes)
          ? data.allowedWorkerTypes.map((t: any) => toLowerCase(t)).filter((t: string) => t)
          : [],
        allowedSubscriptionTiers: Array.isArray(data.allowedSubscriptionTiers)
          ? data.allowedSubscriptionTiers.map((t: any) => toLowerCase(t)).filter((t: string) => t)
          : [],
        order: parseInt(data.order) || 0,
        parentMenuId: emptyToNull(data.parentMenuId ? String(data.parentMenuId).trim() : '')
      };
    },

    // Compare original and sanitized data
    compareData: (original: any) => {
      const sanitized = menuDebugger.sanitizeData(original);
      const comparison = {
        original,
        sanitized,
        changes: {
          added: Object.keys(sanitized).filter(k => !(k in original)),
          removed: Object.keys(original).filter(k => !(k in sanitized)),
          modified: Object.keys(original).filter(k => {
            if (!(k in sanitized)) return false;
            return JSON.stringify(original[k]) !== JSON.stringify(sanitized[k]);
          })
        }
      };
      console.table(comparison);
      return comparison;
    },

    // Test API call
    testMenuUpdate: async (_menuId: string, data: any) => {
      try {
        const sanitized = menuDebugger.sanitizeData(data);
        console.log('Testing menu update with sanitized data:', sanitized);
        
        // This would need the actual API instance
        console.log('To test, use the actual API:');
        console.log('menuConfigApi.updateMenuConfig(_menuId, sanitized)');
        
        return { success: true, sanitized };
      } catch (err) {
        console.error('Test failed:', err);
        return { success: false, error: err };
      }
    },

    // Show help
    help: () => {
      console.log(`
Menu Configuration Debugger - Available Commands:

window.__debugMenuConfig.validateMenuData(data)
  - Validates menu data structure
  - Returns: { isValid, errors, warnings, summary }

window.__debugMenuConfig.sanitizeData(data)
  - Sanitizes menu data for API submission
  - Returns: sanitized data object

window.__debugMenuConfig.compareData(data)
  - Shows differences between original and sanitized data
  - Displays in console table

window.__debugMenuConfig.testMenuUpdate(menuId, data)
  - Tests menu update with sanitized data
  - Returns: { success, sanitized } or { success: false, error }

window.__debugMenuConfig.help()
  - Shows this help message

Example Usage:
  const testData = { label: 'Home', path: '/home', isActive: true };
  window.__debugMenuConfig.validateMenuData(testData);
  window.__debugMenuConfig.compareData(testData);
      `);
    }
  };

  return menuDebugger;
};

// Auto-setup on window
if (typeof window !== 'undefined') {
  (window as any).__debugMenuConfig = setupMenuDebugger();
}
