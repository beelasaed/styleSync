import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Cloud, Sun, CloudRain, Thermometer, Sparkles, TrendingUp, AlertCircle, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [insights, setInsights] = useState({ mostWorn: [], leastWorn: [], utilization: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Latest Weather
            const weatherRes = await apiClient.get('/weather');
            const latestWeather = weatherRes.data[0] || { conditions: 'sunny', temperature: 25, location: 'Dhaka' };
            setWeather(latestWeather);

            // 2. Fetch Clothes for Recommendations & Insights
            const clothesRes = await apiClient.get('/clothes');
            const allClothes = clothesRes.data;

            // 3. Generate Recommendation
            generateRecommendation(allClothes, latestWeather);

            // 4. Calculate Insights
            calculateInsights(allClothes);

            setLoading(false);
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
            setLoading(false);
        }
    };

    const generateRecommendation = (clothes, currentWeather) => {
        const activeClothes = clothes.filter(c => c.status === 'active');

        // Simple logic: Filter by matching season based on weather
        let season = 'summer';
        if (currentWeather.conditions.toLowerCase().includes('rain')) season = 'rainy';
        if (currentWeather.temperature < 20) season = 'winter';

        const possibleTops = activeClothes.filter(c => c.category.toLowerCase() === 'top' && c.season.includes(season));
        const possibleBottoms = activeClothes.filter(c => c.category.toLowerCase() === 'bottom' && c.season.includes(season));

        if (possibleTops.length > 0 && possibleBottoms.length > 0) {
            setRecommendation({
                top: possibleTops[Math.floor(Math.random() * possibleTops.length)],
                bottom: possibleBottoms[Math.floor(Math.random() * possibleBottoms.length)]
            });
        }
    };

    const calculateInsights = (clothes) => {
        const sorted = [...clothes].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
        const mostWorn = sorted.slice(0, 3);
        const leastWorn = sorted.filter(c => c.status === 'active').reverse().slice(0, 3);

        const activeCount = clothes.filter(c => c.status === 'active').length;
        const totalCount = clothes.length;
        const utilization = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

        setInsights({ mostWorn, leastWorn, utilization });
    };

    const handleLogWorn = async () => {
        if (!recommendation) return;
        try {
            const { top, bottom } = recommendation;
            await Promise.all([
                apiClient.put(`/clothes/${top._id}`, { wearCount: (top.wearCount || 0) + 1, lastWorn: new Date() }),
                apiClient.put(`/clothes/${bottom._id}`, { wearCount: (bottom.wearCount || 0) + 1, lastWorn: new Date() })
            ]);
            fetchDashboardData();
        } catch (error) {
            console.error("Error logging wear:", error);
        }
    };

    const handleSendToLaundry = async () => {
        if (!recommendation) return;
        try {
            const { top, bottom } = recommendation;
            await apiClient.post('/laundry', {
                items: [top._id, bottom._id],
                startDate: new Date(),
                status: 'pending'
            });
            // Items status should be updated by laundry controller
            fetchDashboardData();
        } catch (error) {
            console.error("Error sending to laundry:", error);
        }
    }

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div>
            <h1>Dashboard</h1>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {/* Weather Widget */}
                <div className="card" style={{ flex: '1', minWidth: '300px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'rgba(143, 188, 143, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                        {weather?.conditions === 'rainy' ? <CloudRain size={40} color="var(--sage-green)" /> : <Sun size={40} color="var(--sage-green)" />}
                    </div>
                    <div>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>Current Environment</p>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{weather?.temperature}°C • {weather?.conditions}</h2>
                        <p style={{ color: '#666' }}>{weather?.location || 'Unknown Location'}</p>
                    </div>
                </div>

                {/* Utilization Bar */}
                <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>Closet Utilization</span>
                        <span>{insights.utilization}%</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', backgroundColor: '#f0f0f0', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${insights.utilization}%`, height: '100%', backgroundColor: 'var(--sage-green)' }}></div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Comparing active items to total inventory.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Smart Recommendation */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Sparkles size={20} color="var(--sage-green)" />
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Daily Selection</h2>
                    </div>

                    <div className="card" style={{ padding: '2rem' }}>
                        {recommendation ? (
                            <>
                                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
                                    <RecommendationItem item={recommendation.top} label="Top" />
                                    <RecommendationItem item={recommendation.bottom} label="Bottom" />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button onClick={handleLogWorn} className="btn btn-primary">Log as Worn</button>
                                    <button onClick={() => fetchDashboardData()} className="btn btn-secondary">Shuffle</button>
                                    <button onClick={handleSendToLaundry} className="btn btn-secondary" style={{ color: '#f59e0b' }}>To Laundry</button>
                                </div>
                            </>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#888' }}>No clean clothes found for today's weather. Try doing some laundry!</p>
                        )}
                    </div>
                </section>

                {/* Insights */}
                <section>
                    <h2 className="section-title">Insights</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <TrendingUp size={16} color="var(--sage-green)" />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Most Worn</span>
                            </div>
                            {insights.mostWorn.map(c => (
                                <div key={c._id} style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{c.name}</span>
                                    <span style={{ color: '#888' }}>{c.wearCount}×</span>
                                </div>
                            ))}
                        </div>

                        <div className="card" style={{ padding: '1rem', borderColor: '#ffebeb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <AlertCircle size={16} color="#ef4444" />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ef4444' }}>Donation Watch</span>
                            </div>
                            {insights.leastWorn.map(c => (
                                <div key={c._id} style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{c.name}</span>
                                    <span style={{ color: '#888' }}>{c.wearCount}×</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const RecommendationItem = ({ item, label }) => (
    <div style={{ textAlign: 'center', flex: 1 }}>
        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem', letterSpacing: '1px' }}>{label}</p>
        <div style={{
            width: '100%',
            height: '180px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #eee',
            marginBottom: '0.75rem'
        }}>
            <img src={item.images?.[0]?.url || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
    </div>
);

export default Dashboard;
