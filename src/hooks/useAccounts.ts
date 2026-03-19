import { useState } from 'react';
import accountsApi, { Account, CreateAccountDto, UpdateAccountDto } from '../services/accountsApi';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  const fetchAllAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.getAllAccounts();
      setAccounts(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountByPartyId = async (partyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.getAccountByPartyId(partyId);
      setCurrentAccount(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch account');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (accountData: CreateAccountDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.createAccount(accountData);
      setAccounts(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (id: string, accountData: UpdateAccountDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.updateAccount(id, accountData);
      setAccounts(prev => prev.map(acc => acc.id === id ? response.data : acc));
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (partyId: string) => {
    setLoading(true);
    setError(null);
    try {
      await accountsApi.deleteAccount(partyId);
      setAccounts(prev => prev.filter(acc => acc.partyId !== partyId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (partyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.promoteToAdmin(partyId);
      setAccounts(prev => prev.map(acc => acc.partyId === partyId ? response.data : acc));
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to promote user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const demoteToUser = async (partyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountsApi.demoteToUser(partyId);
      setAccounts(prev => prev.map(acc => acc.partyId === partyId ? response.data : acc));
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to demote admin');
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
    createAccount,
    updateAccount,
    deleteAccount,
    promoteToAdmin,
    demoteToUser,
    clearError,
  };
};