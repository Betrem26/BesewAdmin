import React, { useState } from 'react';

interface FraudReport {
  id: number;
  reportedBy: string;
  reason: string;
  status: 'Pending' | 'Reviewed' | 'Blocked';
  date: string;
}

const initialReports: FraudReport[] = [
  { id: 1, reportedBy: 'User123', reason: 'Fake job post', status: 'Pending', date: '2024-06-01' },
  { id: 2, reportedBy: 'User456', reason: 'Scam attempt', status: 'Reviewed', date: '2024-06-02' },
];

const blue = '#022657';
const lightBlue = '#e6f0fa';
const accent = '#007bff';

const Fraud: React.FC = () => {
  const [reports, setReports] = useState<FraudReport[]>(initialReports);

  const handleStatusChange = (id: number, newStatus: FraudReport['status']) => {
    setReports(reports.map(report =>
      report.id === id ? { ...report, status: newStatus } : report
    ));
  };

  // Simple analytics
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const blockedReports = reports.filter(r => r.status === 'Blocked').length;

  return (
    <div style={{ background: lightBlue, minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(2,38,87,0.08)', padding: 32 }}>
        <h1 style={{ color: blue, fontWeight: 700, fontSize: 32, marginBottom: 8 }}>Fraud Management</h1>
        <p style={{ color: '#555', marginBottom: 24 }}>Review and manage fraud reports to keep your platform safe.</p>

        {/* Analytics summary */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1, background: accent, color: '#fff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Total Reports</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{totalReports}</div>
          </div>
          <div style={{ flex: 1, background: blue, color: '#fff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Pending</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{pendingReports}</div>
          </div>
          <div style={{ flex: 1, background: '#fff', border: `2px solid ${accent}`, color: blue, borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Blocked</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{blockedReports}</div>
          </div>
        </div>

        {/* Fraud reports table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: lightBlue }}>
                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Reported By</th>
                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Reason</th>
                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Date</th>
                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Status</th>
                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} style={{ borderBottom: `1px solid ${lightBlue}` }}>
                  <td style={{ padding: 12 }}>{report.reportedBy}</td>
                  <td style={{ padding: 12 }}>{report.reason}</td>
                  <td style={{ padding: 12 }}>{report.date}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: report.status === 'Blocked' ? '#d32f2f' : report.status === 'Reviewed' ? accent : blue,
                      color: '#fff',
                      borderRadius: 8,
                      padding: '4px 12px',
                      fontWeight: 600,
                      fontSize: 14,
                    }}>
                      {report.status}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => handleStatusChange(report.id, 'Reviewed')}
                      style={{
                        background: accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 16px',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        marginRight: 8,
                        transition: 'background 0.2s',
                      }}
                      disabled={report.status === 'Reviewed'}
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleStatusChange(report.id, 'Blocked')}
                      style={{
                        background: '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 16px',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        marginRight: 8,
                        transition: 'background 0.2s',
                      }}
                      disabled={report.status === 'Blocked'}
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#888' }}>
                    No fraud reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fraud;
