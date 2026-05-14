// @ts-nocheck
import React, { useState, useEffect } from 'react';
import accountsApi, { Account } from '../../services/accountsApi';

const AccountsTest: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [partyIdSearch, setPartyIdSearch] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [promoteId, setPromoteId] = useState('');
  const [demoteId, setDemoteId] = useState('');

  const [newAccount, setNewAccount] = useState<any>({
    email: '',
    password: '',
    phonenumber: '',
    uname: '',
    profile_name: '',
    party_type: 'individual',
    role: 'user'
  });

  // Fetch all accounts on component mount
  useEffect(() => {
    fetchAllAccounts();
  }, []);

  const fetchAllAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.getAllAccounts();
      setAccounts(response.data);
      setResult('Accounts fetched successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.createAccount(newAccount);
      const dataAny: any = response.data;
      setResult(`Account created: ${dataAny.uname || dataAny.email}`);
      setNewAccount({
        email: '',
        password: '',
        phonenumber: '',
        uname: '',
        profile_name: '',
        party_type: 'individual',
        role: 'user'
      });
      fetchAllAccounts();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGetByPartyId = async () => {
    if (!partyIdSearch) return;
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.getAccountByPartyId(partyIdSearch);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch account');
    } finally {
      setLoading(false);
    }
  };

  const handleGetByPhoneNumber = async () => {
    if (!phoneSearch) return;
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.getAccountByPhoneNumber(phoneSearch);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteId) return;
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await accountsApi.deleteAccount(deleteId);
      setResult(`Account ${deleteId} deleted successfully`);
      setDeleteId('');
      fetchAllAccounts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!promoteId) return;
    setLoading(true);
    setError(null);
    try {
      await accountsApi.promoteToAdmin(promoteId);
      setResult(`User ${promoteId} promoted to admin successfully`);
      setPromoteId('');
      fetchAllAccounts();
    } catch (err: any) {
      setError(err.message || 'Failed to promote user');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoteToUser = async () => {
    if (!demoteId) return;
    setLoading(true);
    setError(null);
    try {
      await accountsApi.demoteToUser(demoteId);
      setResult(`Admin ${demoteId} demoted to user successfully`);
      setDemoteId('');
      fetchAllAccounts();
    } catch (err: any) {
      setError(err.message || 'Failed to demote admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMyAccount = async () => {
    if (!window.confirm('Are you sure you want to delete YOUR account?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await accountsApi.deleteMyAccount();
      setResult('Your account has been deleted');
    } catch (err: any) {
      setError(err.message || 'Failed to delete your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Accounts API Test Dashboard</h1>
      
      {/* Status Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {result && (
          <div className="mt-2">
            <p className="text-green-600 font-medium">Result:</p>
            <pre className="bg-white p-2 rounded mt-1 overflow-auto max-h-40">
              {result}
            </pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Create Account Form */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">1. POST /accounts - Create Account</h2>
          <form onSubmit={handleCreateAccount} className="space-y-3">
            <input
              type="text"
              placeholder="Username (uname)"
              value={newAccount.uname}
              onChange={(e) => setNewAccount({...newAccount, uname: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Profile Name"
              value={newAccount.profile_name}
              onChange={(e) => setNewAccount({...newAccount, profile_name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newAccount.email}
              onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newAccount.password}
              onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number (phonenumber)"
              value={newAccount.phonenumber}
              onChange={(e) => setNewAccount({...newAccount, phonenumber: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newAccount.role}
              onChange={(e) => setNewAccount({...newAccount, role: e.target.value as 'user' | 'admin'})}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Create Account
            </button>
          </form>
        </div>

        {/* Get All Accounts */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">2. GET /accounts - All Accounts</h2>
          <button
            onClick={fetchAllAccounts}
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400 mb-4"
          >
            Refresh Accounts List
          </button>
          
          <div className="max-h-96 overflow-auto">
            {accounts.map((account) => (
              <div key={account.id} className="border-b p-2 hover:bg-gray-50">
                <p><strong>Name:</strong> {account.firstName} {account.lastName}</p>
                <p><strong>Email:</strong> {account.email}</p>
                <p><strong>Phone:</strong> {account.phoneNumber}</p>
                <p><strong>Role:</strong> {account.role}</p>
                <p><strong>Party ID:</strong> {account.partyId}</p>
                <p><strong>ID:</strong> {account.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Get by Party ID - FIXED: removed extra curly braces */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">3. GET /accounts/&#123;partyId&#125;</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Party ID"
              value={partyIdSearch}
              onChange={(e) => setPartyIdSearch(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleGetByPartyId}
              disabled={loading || !partyIdSearch}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              Search
            </button>
          </div>
        </div>

        {/* Get by Phone Number - FIXED: removed extra curly braces */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">4. GET /accounts/by-phonenumber/&#123;phone&#125;</h2>
          <div className="flex space-x-2">
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleGetByPhoneNumber}
              disabled={loading || !phoneSearch}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              Search
            </button>
          </div>
        </div>

        {/* Delete Account - FIXED: removed extra curly braces */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">5. DELETE /accounts/&#123;partyId&#125;</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Party ID to Delete"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={loading || !deleteId}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Promote to Admin - FIXED: removed extra curly braces */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">6. PUT /accounts/admin/promote/&#123;partyId&#125;</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Party ID to Promote"
              value={promoteId}
              onChange={(e) => setPromoteId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handlePromoteToAdmin}
              disabled={loading || !promoteId}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              Promote
            </button>
          </div>
        </div>

        {/* Demote to User - FIXED: removed extra curly braces */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">7. PUT /accounts/admin/demote/&#123;partyId&#125;</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Party ID to Demote"
              value={demoteId}
              onChange={(e) => setDemoteId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleDemoteToUser}
              disabled={loading || !demoteId}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              Demote
            </button>
          </div>
        </div>

        {/* Delete My Account */}
        <div className="border p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-red-600">8. DELETE /accounts/me - Delete My Account</h2>
          <button
            onClick={handleDeleteMyAccount}
            disabled={loading}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            Delete My Account (Current User)
          </button>
          <p className="text-sm text-gray-600 mt-2">Warning: This will delete your own account!</p>
        </div>
      </div>
    </div>
  );
};

export default AccountsTest;