import React, { useState } from 'react';

interface Ad {
    id: number;
    title: string;
    status: 'Active' | 'Inactive';
    impressions: number;
    clicks: number;
}

const initialAds: Ad[] = [
    { id: 1, title: 'Homepage Banner', status: 'Active', impressions: 1200, clicks: 45 },
    { id: 2, title: 'Sidebar Ad', status: 'Inactive', impressions: 800, clicks: 12 },
];

const blue = '#022657';
const lightBlue = '#e6f0fa';
const accent = '#007bff';

const AdManagement: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>(initialAds);
    const [newAdTitle, setNewAdTitle] = useState('');

    const handleAddAd = () => {
        if (!newAdTitle.trim()) return;
        setAds([
            ...ads,
            {
                id: ads.length + 1,
                title: newAdTitle,
                status: 'Inactive',
                impressions: 0,
                clicks: 0,
            },
        ]);
        setNewAdTitle('');
    };

    const handleToggleStatus = (id: number) => {
        setAds(
            ads.map((ad) =>
                ad.id === id
                    ? { ...ad, status: ad.status === 'Active' ? 'Inactive' : 'Active' }
                    : ad
            )
        );
    };

    // Simple analytics
    const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const activeAds = ads.filter((ad) => ad.status === 'Active').length;

    return (
        <div style={{ background: lightBlue, minHeight: '100vh', padding: '32px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(2,38,87,0.08)', padding: 32 }}>
                <h1 style={{ color: blue, fontWeight: 700, fontSize: 32, marginBottom: 8 }}>Ad Management</h1>
                <p style={{ color: '#555', marginBottom: 24 }}>Manage your ads, view analytics, and add new campaigns.</p>

                {/* Analytics summary */}
                <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                    <div style={{ flex: 1, background: accent, color: '#fff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 600 }}>Total Impressions</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{totalImpressions}</div>
                    </div>
                    <div style={{ flex: 1, background: blue, color: '#fff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 600 }}>Total Clicks</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{totalClicks}</div>
                    </div>
                    <div style={{ flex: 1, background: '#fff', border: `2px solid ${accent}`, color: blue, borderRadius: 12, padding: 20, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 600 }}>Active Ads</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{activeAds}</div>
                    </div>
                </div>

                {/* Add new ad */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                    <input
                        type="text"
                        value={newAdTitle}
                        onChange={(e) => setNewAdTitle(e.target.value)}
                        placeholder="Enter new ad title..."
                        style={{ flex: 1, padding: 12, borderRadius: 8, border: `1px solid ${blue}`, fontSize: 16 }}
                    />
                    <button
                        onClick={handleAddAd}
                        style={{ background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                        Add Ad
                    </button>
                </div>

                {/* Ads table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                        <thead>
                            <tr style={{ background: lightBlue }}>
                                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Title</th>
                                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Status</th>
                                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Impressions</th>
                                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Clicks</th>
                                <th style={{ padding: 12, color: blue, fontWeight: 700, fontSize: 16 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ads.map((ad) => (
                                <tr key={ad.id} style={{ borderBottom: `1px solid ${lightBlue}` }}>
                                    <td style={{ padding: 12 }}>{ad.title}</td>
                                    <td style={{ padding: 12 }}>
                                        <span style={{
                                            background: ad.status === 'Active' ? accent : '#ccc',
                                            color: '#fff',
                                            borderRadius: 8,
                                            padding: '4px 12px',
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}>
                                            {ad.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: 12 }}>{ad.impressions}</td>
                                    <td style={{ padding: 12 }}>{ad.clicks}</td>
                                    <td style={{ padding: 12 }}>
                                        <button
                                            onClick={() => handleToggleStatus(ad.id)}
                                            style={{
                                                background: ad.status === 'Active' ? blue : accent,
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
                                        >
                                            {ad.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            style={{
                                                background: '#fff',
                                                color: accent,
                                                border: `1px solid ${accent}`,
                                                borderRadius: 6,
                                                padding: '6px 16px',
                                                fontWeight: 600,
                                                fontSize: 14,
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                            }}
                                            onClick={() => alert('Edit feature coming soon!')}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {ads.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#888' }}>
                                        No ads found.
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

export default AdManagement; 