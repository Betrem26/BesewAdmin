/**
 * Menu Management Usage Examples
 * 
 * This file demonstrates how to use the menu management system
 * in different scenarios.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllMenuConfigs, 
  createMenuConfig, 
  updateMenuConfig, 
  deleteMenuConfig,
  seedDefaultMenus 
} from '../store/features/menuConfigSlice';
import { useAccessibleMenus } from '../hooks';
import { prepareMenuData, validateMenuData } from '../utils/menuHelpers';
import { RootState } from '../store/store';
import { MenuConfig } from '../types/menu';

/**
 * Example 1: Fetch all menus
 */
export const FetchAllMenusExample = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.menuConfig);

  useEffect(() => {
    dispatch(fetchAllMenuConfigs() as any);
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>All Menus</h2>
      <ul>
        {items.map(menu => (
          <li key={menu.menuId}>{menu.label}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 2: Get accessible menus for a user
 */
export const GetAccessibleMenusExample = () => {
  const { menus, loading, error, fetchAccessibleMenus } = useAccessibleMenus();

  useEffect(() => {
    // Fetch menus for a job seeker with freelancer skills and premium subscription
    fetchAccessibleMenus({
      userType: 'job_seeker',
      workerType: 'freelancer',
      subscriptionTier: 'premium',
      trustScore: 75
    });
  }, [fetchAccessibleMenus]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Accessible Menus</h2>
      <ul>
        {menus.map(menu => (
          <li key={menu.menuId}>{menu.label}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 3: Create a new menu
 */
export const CreateMenuExample = () => {
  const dispatch = useDispatch();

  const handleCreateMenu = () => {
    const newMenu = {
      menuId: 'jobs',
      label: 'Find Jobs',
      path: '/jobs',
      icon: '💼',
      description: 'Browse and search job listings',
      badge: 'PREMIUM',
      isActive: true,
      allowedUserTypes: ['job_seeker'],
      allowedWorkerTypes: ['freelancer', 'both'],
      minTrustScore: 0,
      allowedSubscriptionTiers: ['free', 'premium'],
      order: 1,
      parentMenuId: null
    };

    // Validate before creating
    const errors = validateMenuData(newMenu, true);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return;
    }

    // Prepare data for API
    const preparedData = prepareMenuData(newMenu, false);

    // Dispatch create action
    dispatch(createMenuConfig(preparedData) as any);
  };

  return (
    <button onClick={handleCreateMenu}>
      Create Menu
    </button>
  );
};

/**
 * Example 4: Update a menu
 */
export const UpdateMenuExample = () => {
  const dispatch = useDispatch();

  const handleUpdateMenu = () => {
    const menuId = 'jobs';
    const updatedData = {
      label: 'Find Jobs - Updated',
      path: '/jobs',
      icon: '💼',
      description: 'Browse and search job listings - Updated',
      badge: 'PREMIUM',
      isActive: true,
      allowedUserTypes: ['job_seeker'],
      allowedWorkerTypes: ['freelancer', 'both'],
      minTrustScore: 0,
      allowedSubscriptionTiers: ['free', 'premium'],
      order: 1,
      parentMenuId: null
    };

    // Validate before updating
    const errors = validateMenuData(updatedData, false);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return;
    }

    // Prepare data for API (isUpdate=true)
    const preparedData = prepareMenuData(updatedData, true);

    // Dispatch update action
    dispatch(updateMenuConfig({ menuId, data: preparedData }) as any);
  };

  return (
    <button onClick={handleUpdateMenu}>
      Update Menu
    </button>
  );
};

/**
 * Example 5: Delete a menu
 */
export const DeleteMenuExample = () => {
  const dispatch = useDispatch();

  const handleDeleteMenu = () => {
    const menuId = 'jobs';
    
    if (window.confirm('Are you sure you want to delete this menu?')) {
      dispatch(deleteMenuConfig(menuId) as any);
    }
  };

  return (
    <button onClick={handleDeleteMenu}>
      Delete Menu
    </button>
  );
};

/**
 * Example 6: Seed default menus
 */
export const SeedDefaultMenusExample = () => {
  const dispatch = useDispatch();

  const handleSeedDefaults = () => {
    if (window.confirm('This will seed default menu configurations. Continue?')) {
      dispatch(seedDefaultMenus() as any);
    }
  };

  return (
    <button onClick={handleSeedDefaults}>
      Seed Default Menus
    </button>
  );
};

/**
 * Example 7: Complete menu management component
 */
export const CompleteMenuManagementExample = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.menuConfig);
  const [editingMenu, setEditingMenu] = React.useState<MenuConfig | null>(null);

  useEffect(() => {
    dispatch(fetchAllMenuConfigs() as any);
  }, [dispatch]);

  const handleEdit = (menu: MenuConfig) => {
    setEditingMenu(menu);
  };

  const handleSave = (menu: MenuConfig) => {
    const errors = validateMenuData(menu, false);
    if (errors.length > 0) {
      alert('Validation errors: ' + errors.join(', '));
      return;
    }

    const preparedData = prepareMenuData(menu, true);
    dispatch(updateMenuConfig({ menuId: menu.menuId, data: preparedData }) as any);
    setEditingMenu(null);
  };

  const handleDelete = (menuId: string) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteMenuConfig(menuId) as any);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Menu Management</h2>
      <table>
        <thead>
          <tr>
            <th>Menu ID</th>
            <th>Label</th>
            <th>Path</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(menu => (
            <tr key={menu.menuId}>
              <td>{menu.menuId}</td>
              <td>{menu.label}</td>
              <td>{menu.path}</td>
              <td>{menu.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(menu)}>Edit</button>
                <button onClick={() => handleDelete(menu.menuId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingMenu && (
        <div>
          <h3>Edit Menu</h3>
          <input
            type="text"
            value={editingMenu.label}
            onChange={(e) => setEditingMenu({ ...editingMenu, label: e.target.value })}
            placeholder="Label"
          />
          <button onClick={() => handleSave(editingMenu)}>Save</button>
          <button onClick={() => setEditingMenu(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
