// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import AccountForm from './AccountForm';
import { CustomButton } from '../../components/atoms/buttons/CustomButton';
import CustomCard from '../../components/atoms/cards/CustomCard';
import CustomInput from '../../components/atoms/inputs/CustomInput';

const Accounts: React.FC = () => {
  const {
    accounts,
    loading,
    error,
    fetchAllAccounts,
    deleteAccount,
    promoteToAdmin,
    demoteToUser,
    clearError,
  } = useAccounts();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedAccount, setSelectedAccount] = useState(null); // Commented out since not used

  useEffect(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  const handleDelete = async (partyId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(partyId);
        await fetchAllAccounts();
      } catch (err) {
        console.error('Failed to delete account:', err);
      }
    }
  };

  const handlePromote = async (partyId: string) => {
    if (window.confirm('Are you sure you want to promote this user to admin?')) {
      try {
        await promoteToAdmin(partyId);
        await fetchAllAccounts();
      } catch (err) {
        console.error('Failed to promote user:', err);
      }
    }
  };

  const handleDemote = async (partyId: string) => {
    if (window.confirm('Are you sure you want to demote this admin to user?')) {
      try {
        await demoteToUser(partyId);
        await fetchAllAccounts();
      } catch (err) {
        console.error('Failed to demote admin:', err);
      }
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.phoneNumber.includes(searchTerm)
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Account Management</h1>
        <CustomButton
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Account'}
        </CustomButton>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="mb-6">
          <AccountForm onSuccess={() => {
            setShowCreateForm(false);
            fetchAllAccounts();
          }} />
        </div>
      )}

      <div className="mb-4">
        <CustomInput
          type="text"
          placeholder="Search accounts by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredAccounts.map((account) => (
          <CustomCard key={account.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {account.firstName} {account.lastName}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(account.role)}`}>
                    {account.role}
                  </span>
                  {!account.isActive && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Email:</span> {account.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {account.phoneNumber}
                  </div>
                  <div>
                    <span className="font-medium">Party ID:</span> {account.partyId}
                  </div>
                  <div>
                    <span className="font-medium">MFA Enabled:</span> {account.mfaEnabled ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(account.createdAt).toLocaleDateString()}
                  </div>
                  {account.lastLogin && (
                    <div>
                      <span className="font-medium">Last Login:</span> {new Date(account.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {account.role !== 'super_admin' && (
                  <>
                    {account.role === 'user' ? (
                      <CustomButton
                        variant="secondary"
                        onClick={() => handlePromote(account.partyId)}
                      >
                        Promote to Admin
                      </CustomButton>
                    ) : (
                      <CustomButton
                        variant="secondary"
                        onClick={() => handleDemote(account.partyId)}
                      >
                        Demote to User
                      </CustomButton>
                    )}
                  </>
                )}
                <CustomButton
                  variant="secondary"
                  onClick={() => handleDelete(account.partyId)}
                  disabled={account.role === 'super_admin'}
                >
                  Delete
                </CustomButton>
              </div>
            </div>
          </CustomCard>
        ))}

        {filteredAccounts.length === 0 && accounts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No accounts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;