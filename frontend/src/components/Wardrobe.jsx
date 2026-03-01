import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import apiClient from '../api/axios';
import ClothesCard from './ClothesCard';

const Wardrobe = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const data = await api.getClothes();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch clothes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await api.deleteClothes(id);
                setItems(items.filter(i => i._id !== id));
            } catch (error) {
                alert('Failed to delete item');
            }
        }
    };

    const handleSendToLaundry = async (id) => {
        try {
            await apiClient.post('/laundry', {
                items: [id],
                startDate: new Date(),
                status: 'pending'
            });
            // Update local state to reflect the item is now in laundry
            setItems(items.map(item =>
                item._id === id ? { ...item, status: 'laundry' } : item
            ));
        } catch (error) {
            console.error('Failed to send to laundry:', error);
            alert('Failed to send item to laundry');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem' }}>Loading your wardrobe...</div>;

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your <span className="title-gradient">Wardrobe</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and organize your fashion collection</p>
                </div>
                <button className="btn btn-primary">
                    <span>+</span> Add New Item
                </button>
            </div>

            {items.length === 0 ? (
                <div style={{
                    padding: '5rem',
                    textAlign: 'center',
                    background: 'var(--glass)',
                    borderRadius: '2rem',
                    border: '1px dashed var(--glass-border)'
                }}>
                    <p style={{ color: 'var(--text-muted)' }}>Your wardrobe is empty. Start by adding some clothes!</p>
                </div>
            ) : (
                <div className="wardrobe-grid">
                    {items.map(item => (
                        <ClothesCard
                            key={item._id}
                            item={item}
                            onWear={() => { }}
                            onLaundry={handleSendToLaundry}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wardrobe;
