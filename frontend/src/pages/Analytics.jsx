import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Assuming you have an analytics endpoint or just fetch everything
            const [clothes, accessories] = await Promise.all([
                apiClient.get('/clothes'),
                apiClient.get('/accessories')
            ]);

            const allItems = [...clothes.data, ...accessories.data];
            const sorted = [...allItems].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));

            setStats({
                totalItems: allItems.length,
                mostWorn: sorted.slice(0, 5),
                leastWorn: sorted.filter(i => i.status === 'active').reverse().slice(0, 5),
                categoryBreakdown: allItems.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1;
                    return acc;
                }, {})
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Insights...</div>;

    return (
        <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart3 size={32} color="var(--sage-green)" />
                Wardrobe Insights
            </h1>

            <div className="grid" style={{ marginTop: '2.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Activity size={20} color="var(--sage-green)" />
                        <h3 className="section-title" style={{ marginBottom: 0 }}>Overview</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--sage-green)' }}>{stats.totalItems}</p>
                    <p style={{ color: '#888' }}>Total items in your collection</p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <TrendingUp size={20} color="var(--sage-green)" />
                        <h3 className="section-title" style={{ marginBottom: 0 }}>Hall of Fame</h3>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.mostWorn.map(item => (
                            <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>{item.name}</span>
                                <span style={{ color: 'var(--sage-green)', fontWeight: 600 }}>{item.wearCount} wears</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <TrendingDown size={20} color="#ef4444" />
                        <h3 className="section-title" style={{ marginBottom: 0 }}>Forgotten Gems</h3>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.leastWorn.map(item => (
                            <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>{item.name}</span>
                                <span style={{ color: '#888' }}>{item.wearCount} wears</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <PieChart size={20} color="var(--sage-green)" />
                    <h3 className="section-title" style={{ marginBottom: 0 }}>Category Distribution</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
                        <div key={cat} style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(143, 188, 143, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                color: 'var(--sage-green)',
                                marginBottom: '0.5rem'
                            }}>
                                {count}
                            </div>
                            <p style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: '#666' }}>{cat}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
