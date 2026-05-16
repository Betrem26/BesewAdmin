import { useState } from 'react';
import accountsApi, { Account } from '../services/accountsApi';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  const fetchAllAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountsApi.getAllAccounts();
      setAccounts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountByPartyId = async (partyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountsApi.getAccountByPartyId(partyId);
      setCurrentAccount(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch account');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (partyId: string) => {
    setLoading(true);
    setError(null);
    try {
      await accountsApi.deleteAccount(partyId);
      setAccounts(prev => prev.filter(acc => acc.party_id !== partyId));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (partyId: string, reason: string = '', mfa_challenge_id: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const updated = await accountsApi.promoteToAdmin(partyId, reason, mfa_challenge_id);
      setAccounts(prev => prev.map(acc => acc.party_id === partyId ? { ...acc, ...updated } : acc));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to promote user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const demoteToUser = async (partyId: string, reason: string = '', mfa_challenge_id: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const updated = await accountsApi.demoteToUser(partyId, reason, mfa_challenge_id);
      setAccounts(prev => prev.map(acc => acc.party_id === partyId ? { ...acc, ...updated } : acc));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to demote admin');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    accounts,
    currentAccount,
    loading,
    error,
    fetchAllAccounts,
    fetchAccountByPartyId,
    deleteAccount,
    promoteToAdmin,
    demoteToUser,
    clearError,
  };
};
