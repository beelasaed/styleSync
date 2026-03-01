import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Filter, Plus } from 'lucide-react';
import ClothesCard from '../components/ClothesCard';
import ClothingForm from '../components/ClothingForm';

const Accessories = () => {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccessories();
    }, []);

    const fetchAccessories = async () => {
        try {
            const response = await apiClient.get('/accessories');
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching accessories:", error);
            setLoading(false);
        }
    };

    const handleWearItem = async (id) => {
        try {
            const item = items.find(c => c._id === id);
            const response = await apiClient.put(`/accessories/${id}`, {
                wearCount: (item.wearCount || 0) + 1,
                lastWorn: new Date()
            });
            setItems(items.map(c => c._id === id ? response.data : c));
        } catch (error) {
            console.error("Error updating wear count:", error);
        }
    };

    if (loading) return <div>Loading Accessories...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>My Accessories</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} />
                    Add Accessory
                </button>
            </div>

            <div className="grid">
                {items.map(item => (
                    <ClothesCard
                        key={item._id}
                        item={{ ...item, category: item.type }}
                        onWear={handleWearItem}
                    />
                ))}
            </div>

            {items.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    No accessories found.
                </div>
            )}

            {showForm && (
                <ClothingForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchAccessories}
                    isAccessory={true}
                />
            )}
        </div>
    );
};

export default Accessories;
