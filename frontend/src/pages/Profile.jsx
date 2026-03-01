import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { User, Settings, Camera, LogOut } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            // Fetch the first user since we don't have auth yet
            const response = await apiClient.get('/users');
            setUser(response.data[0]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '4rem' }}>Personal <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</span></h1>

            <div className="card" style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '3rem' }}>
                    <div style={{
                        padding: '8px',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 15px 40px var(--primary-glow)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <img
                            src={user?.profilePicture?.url || 'https://ui-avatars.com/api/?name=Style+Sync&background=a78bfa&color=fff'}
                            style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    </div>
                    <button style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px var(--primary-glow)',
                        border: '2px solid white'
                    }}>
                        <Camera size={20} />
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>{user?.username || 'Style Curator'}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
                        Premium Vision Active
                    </div>
                </div>

                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem', textAlign: 'left', marginBottom: '3rem' }}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input className="form-control" value={user?.email || 'curator@stylesync.pro'} disabled style={{ background: 'var(--background)' }} />
                    </div>
                    <div className="form-group">
                        <label>Style Preferences</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {(user?.preferences?.occasions || ['Minimalist', 'High-End', 'Avant-Garde']).map(o => (
                                <span key={o} style={{
                                    fontSize: '0.85rem',
                                    padding: '6px 16px',
                                    backgroundColor: 'var(--primary-glow)',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    color: 'var(--primary-deep)',
                                    textTransform: 'capitalize',
                                    border: '1px solid var(--primary-soft)'
                                }}>{o}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', pt: '3rem', borderTop: '2px solid var(--background)', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem' }}>
                        <Settings size={20} />
                        Preferences
                    </button>
                    <button className="btn" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem 2.5rem' }}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
