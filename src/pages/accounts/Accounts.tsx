import React, { useEffect, useState } from "react";
import { accountsApi, Account } from "../../services/accountsApi";

const Accounts = () => {

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const data = await accountsApi.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to load accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div>
      <h2>Accounts</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((acc) => (
            <tr key={acc._id}>
              <td>{acc.profile_name}</td>
              <td>{acc.phonenumber}</td>
              <td>{acc.role}</td>
              <td>{acc.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accounts;