import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMenuConfigs, updateMenuConfig, deleteMenuConfig, seedDefaultMenus, clearError, clearSuccess } from '../../store/features/menuConfigSlice';
import { RootState } from '../../store/store';

const UserTypeCategory = {
  JOB_SEEKER: 'JOB_SEEKER',
  GIG_WORKER: 'GIG_WORKER',
  EMPLOYER: 'EMPLOYER',
  AGGREGATOR: 'AGGREGATOR',
  STARTUP_FOUNDER: 'STARTUP_FOUNDER'
};

const WorkerType = {
  EMPLOYEE: 'EMPLOYEE',
  FREELANCER: 'FREELANCER',
  BOTH: 'BOTH',
  CONSULTANT: 'CONSULTANT',
  CONTRACTOR: 'CONTRACTOR'
};

const SubscriptionTier = {
  FREE: 'FREE',
  TRIAL: 'TRIAL',
  PREMIUM: 'PREMIUM',
  ENTERPRISE: 'ENTERPRISE'
};

export const MenuManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector((state: RootState) => state.menuConfig);
  const token = localStorage.getItem('authToken') || '';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    dispatch(fetchAllMenuConfigs(token) as any);
  }, [dispatch, token]);

  const handleEdit = (item: any) => {
    setEditingId(item.menuId);
    setEditData({ ...item });
  };

  const handleSave = async () => {
    if (editingId) {
      dispatch(updateMenuConfig({ menuId: editingId, data: editData, token }) as any);
      setEditingId(null);
    }
  };

  const handleDelete = (menuId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      dispatch(deleteMenuConfig({ menuId, token }) as any);
    }
  };

  const handleSeedDefaults = () => {
    if (window.confirm('This will seed default menu configurations. Continue?')) {
      dispatch(seedDefaultMenus(token) as any);
    }
  };

  const toggleUserType = (userType: string) => {
    const current = editData.allowedUserTypes || [];
    if (current.includes(userType)) {
      setEditData({
        ...editData,
        allowedUserTypes: current.filter((t: string) => t !== userType)
      });
    } else {
      setEditData({
        ...editData,
        allowedUserTypes: [...current, userType]
      });
    }
  };

  const toggleWorkerType = (workerType: string) => {
    const current = editData.allowedWorkerTypes || [];
    if (current.includes(workerType)) {
      setEditData({
        ...editData,
        allowedWorkerTypes: current.filter((t: string) => t !== workerType)
      });
    } else {
      setEditData({
        ...editData,
        allowedWorkerTypes: [...current, workerType]
      });
    }
  };

  const toggleSubscriptionTier = (tier: string) => {
    const current = editData.allowedSubscriptionTiers || [];
    if (current.includes(tier)) {
      setEditData({
        ...editData,
        allowedSubscriptionTiers: current.filter((t: string) => t !== tier)
      });
    } else {
      setEditData({
        ...editData,
        allowedSubscriptionTiers: [...current, tier]
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <button
          onClick={handleSeedDefaults}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Seed Defaults
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
          <button onClick={() => dispatch(clearError())} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Operation completed successfully
          <button onClick={() => dispatch(clearSuccess())} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Menu ID</th>
                <th className="border p-2 text-left">Label</th>
                <th className="border p-2 text-left">Path</th>
                <th className="border p-2 text-left">Active</th>
                <th className="border p-2 text-left">User Types</th>
                <th className="border p-2 text-left">Worker Types</th>
                <th className="border p-2 text-left">Subscription Tiers</th>
                <th className="border p-2 text-left">Min Trust Score</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.menuId} className="border hover:bg-gray-50">
                  <td className="border p-2">{item.menuId}</td>
                  <td className="border p-2">{item.label}</td>
                  <td className="border p-2">{item.path}</td>
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      checked={editingId === item.menuId ? editData.isActive : item.isActive}
                      onChange={(e) => {
                        if (editingId === item.menuId) {
                          setEditData({ ...editData, isActive: e.target.checked });
                        }
                      }}
                      disabled={editingId !== item.menuId}
                    />
                  </td>
                  <td className="border p-2 text-sm">
                    {editingId === item.menuId ? (
                      <div className="space-y-1">
                        {Object.values(UserTypeCategory).map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.allowedUserTypes || []).includes(type)}
                              onChange={() => toggleUserType(type)}
                              className="mr-2"
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div>{(item.allowedUserTypes || []).join(', ') || 'All'}</div>
                    )}
                  </td>
                  <td className="border p-2 text-sm">
                    {editingId === item.menuId ? (
                      <div className="space-y-1">
                        {Object.values(WorkerType).map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.allowedWorkerTypes || []).includes(type)}
                              onChange={() => toggleWorkerType(type)}
                              className="mr-2"
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div>{(item.allowedWorkerTypes || []).join(', ') || 'All'}</div>
                    )}
                  </td>
                  <td className="border p-2 text-sm">
                    {editingId === item.menuId ? (
                      <div className="space-y-1">
                        {Object.values(SubscriptionTier).map((tier) => (
                          <label key={tier} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.allowedSubscriptionTiers || []).includes(tier)}
                              onChange={() => toggleSubscriptionTier(tier)}
                              className="mr-2"
                            />
                            {tier}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div>{(item.allowedSubscriptionTiers || []).join(', ')}</div>
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === item.menuId ? (
                      <input
                        type="number"
                        value={editData.minTrustScore || 0}
                        onChange={(e) => setEditData({ ...editData, minTrustScore: parseInt(e.target.value) })}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    ) : (
                      item.minTrustScore
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === item.menuId ? (
                      <div className="space-x-2">
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.menuId)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
