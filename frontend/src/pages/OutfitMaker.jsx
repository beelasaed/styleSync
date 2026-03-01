import React, { useState } from 'react';
import apiClient from '../api/axios';
import { Sparkles, MapPin, Briefcase, Zap, CheckCircle } from 'lucide-react';

const OutfitMaker = () => {
    const [generationParams, setGenerationParams] = useState({
        location: 'Dhaka',
        occasion: 'casual'
    });
    const [outfit, setOutfit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setSaved(false);
        try {
            const response = await apiClient.post('/outfits/generate', generationParams);
            setOutfit(response.data);
        } catch (error) {
            console.error("Error generating outfit:", error);
            alert(error.response?.data?.message || "Failed to generate outfit.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!outfit) return;
        setSaved(true);
        // Usually generation saves it to DB already, but we can show confirmation
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Sparkles size={32} color="var(--sage-green)" />
                <h1>Outfit Generator</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Configuration Panel */}
                <section className="card" style={{ height: 'fit-content' }}>
                    <h3 className="section-title">Preferences</h3>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={16} /> Location
                        </label>
                        <input
                            className="form-control"
                            value={generationParams.location}
                            onChange={e => setGenerationParams({ ...generationParams, location: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Briefcase size={16} /> Occasion
                        </label>
                        <select
                            className="form-control"
                            value={generationParams.occasion}
                            onChange={e => setGenerationParams({ ...generationParams, occasion: e.target.value })}
                        >
                            <option value="casual">Casual</option>
                            <option value="formal">Formal</option>
                            <option value="work">Work</option>
                            <option value="party">Party</option>
                            <option value="sport">Sport</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        <Zap size={18} />
                        {loading ? 'Thinking...' : 'Generate Outfit'}
                    </button>
                </section>

                {/* Results Panel */}
                <section>
                    {outfit ? (
                        <div className="card animate-fade" style={{ textAlign: 'center', padding: '3rem' }}>
                            <h2 style={{ marginBottom: '2rem' }}>{outfit.name}</h2>

                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {outfit.clothingItems.map(item => (
                                    <div key={item._id} style={{ width: '150px' }}>
                                        <img src={item.images?.[0]?.url} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.5rem' }} />
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</p>
                                    </div>
                                ))}
                                {outfit.accessories.map(acc => (
                                    <div key={acc._id} style={{ width: '150px' }}>
                                        <img src={acc.images?.[0]?.url} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.5rem' }} />
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{acc.name}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleSave}
                                    disabled={saved}
                                >
                                    {saved ? <><CheckCircle size={18} /> Saved</> : 'Confirm Selection'}
                                </button>
                                <button className="btn btn-secondary" onClick={handleGenerate}>Try Another</button>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
                            <Sparkles size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p>Set your preferences and generate a custom look.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default OutfitMaker;
