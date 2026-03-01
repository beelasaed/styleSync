import React from 'react';
import { Calendar, User } from 'lucide-react';

const ClothesCard = ({ item, onWear, onLaundry }) => {
    const lastWornDate = item.lastWorn
        ? new Date(item.lastWorn).toLocaleDateString()
        : 'Never';

    const isInLaundry = item.status === 'laundry';

    return (
        <div className="card" style={{ opacity: isInLaundry ? 0.7 : 1 }}>
            <div style={{ position: 'relative' }}>
                <img
                    src={item.images?.[0]?.url || item.image?.url || 'https://via.placeholder.com/200?text=No+Image'}
                    alt={item.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: isInLaundry ? '#f59e0b' : 'var(--sage-green)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                }}>
                    {isInLaundry ? 'Laundry' : `Worn: ${item.wearCount}`}
                </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>{item.category}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#888' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {lastWornDate}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {onLaundry && !isInLaundry && (
                            <button
                                className="btn btn-secondary"
                                style={{ padding: '4px 12px', fontSize: '0.8rem', color: '#f59e0b' }}
                                onClick={() => onLaundry(item._id)}
                            >
                                Laundry
                            </button>
                        )}
                        {onWear && (
                            <button
                                className="btn btn-primary"
                                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                                onClick={() => onWear(item._id)}
                                disabled={isInLaundry}
                            >
                                Select
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClothesCard;
