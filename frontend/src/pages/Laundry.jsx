import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Eraser, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

const Laundry = () => {
    const [laundrySessions, setLaundrySessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLaundry();
    }, []);

    const fetchLaundry = async () => {
        try {
            const response = await apiClient.get('/laundry');
            setLaundrySessions(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching laundry:", error);
            setLoading(false);
        }
    };

    const handleFinishLaundry = async (id) => {
        try {
            // 1. Mark laundry session as done
            await apiClient.put(`/laundry/${id}`, { status: 'done' });

            // 2. The items should be set back to active. 
            // Usually the backend controller for updateLaundry should handle this.
            // If it doesn't, we might need a dedicated endpoint or handle it here.
            // Assuming the backend handles item status update when laundry is marked 'done'.

            fetchLaundry();
        } catch (error) {
            console.error("Error finishing laundry:", error);
        }
    };

    const deleteSession = async (id) => {
        try {
            await apiClient.delete(`/laundry/${id}`);
            fetchLaundry();
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    }

    const renderStatusGroup = (status, icon, label, color) => {
        const sessions = laundrySessions.filter(s => s.status === status);

        return (
            <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    color: color
                }}>
                    {icon}
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{label}</h2>
                    <span style={{
                        backgroundColor: '#eee',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: '#666'
                    }}>{sessions.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sessions.map(session => (
                        <div key={session._id} className="card" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                    {new Date(session.startDate).toLocaleDateString()}
                                </span>
                                {status !== 'done' && (
                                    <button
                                        onClick={() => handleFinishLaundry(session._id)}
                                        className="btn btn-primary"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                    >
                                        Finish
                                    </button>
                                )}
                                {status === 'done' && (
                                    <button
                                        onClick={() => deleteSession(session._id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}
                                    >
                                        <Eraser size={16} />
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {session.items.map(item => (
                                    <div key={typeof item === 'object' ? item._id : item} style={{
                                        fontSize: '0.8rem',
                                        backgroundColor: '#f8f9fa',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        {typeof item === 'object' ? item.name : 'Clothes Item'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                            No items in this stage.
                        </p>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div>Loading Laundry Tracker...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1>Laundry Tracker</h1>
                    <p style={{ color: '#666' }}>Track your cleaning cycles and refresh your wardrobe.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {renderStatusGroup('pending', <Clock size={20} />, 'Pending', '#f59e0b')}
                {renderStatusGroup('washing', <RefreshCw size={20} />, 'Washing', '#3b82f6')}
                {renderStatusGroup('done', <CheckCircle2 size={20} />, 'Done', 'var(--sage-green)')}
            </div>
        </div>
    );
};

export default Laundry;
