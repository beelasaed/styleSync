import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import ClothesCard from '../components/ClothesCard';
import { Filter, Plus } from 'lucide-react';
import ClothingForm from '../components/ClothingForm';

const Closet = () => {
    const [clothes, setClothes] = useState([]);
    const [filteredClothes, setFilteredClothes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({
        category: 'All',
        season: 'All',
        status: 'All'
    });

    useEffect(() => {
        fetchClothes();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [clothes, filters]);

    const fetchClothes = async () => {
        try {
            const response = await apiClient.get('/clothes');
            setClothes(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching clothes:", error);
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...clothes];
        if (filters.category !== 'All') {
            result = result.filter(item => item.category === filters.category.toLowerCase());
        }
        if (filters.season !== 'All') {
            result = result.filter(item => item.season.includes(filters.season.toLowerCase()));
        }
        if (filters.status !== 'All') {
            result = result.filter(item => item.status === filters.status.toLowerCase());
        }
        setFilteredClothes(result);
    };

    const handleWearItem = async (id) => {
        try {
            const item = clothes.find(c => c._id === id);
            const response = await apiClient.put(`/clothes/${id}`, {
                wearCount: (item.wearCount || 0) + 1,
                lastWorn: new Date()
            });
            setClothes(clothes.map(c => c._id === id ? response.data : c));
        } catch (error) {
            console.error("Error updating wear count:", error);
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
            setClothes(clothes.map(item =>
                item._id === id ? { ...item, status: 'laundry' } : item
            ));
        } catch (error) {
            console.error('Failed to send to laundry:', error);
            alert('Failed to send item to laundry');
        }
    };

    const categories = ['All', 'top', 'bottom', 'dress', 'suit', 'outerwear', 'footwear'];
    const seasons = ['All', 'summer', 'winter', 'spring', 'fall', 'rainy'];

    if (loading) return <div style={{ padding: '2rem' }}>Loading Closet...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Digital Closet</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <Plus size={18} />
                        Add Item
                    </button>
                    <Filter size={20} color="#888" />
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="btn btn-secondary"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                    </select>
                    <select
                        value={filters.season}
                        onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                        className="btn btn-secondary"
                    >
                        {seasons.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid">
                {filteredClothes.map(item => (
                    <ClothesCard
                        key={item._id}
                        item={item}
                        onWear={handleWearItem}
                        onLaundry={handleSendToLaundry}
                    />
                ))}
            </div>

            {filteredClothes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    No items found matching your filters.
                </div>
            )}

            {showForm && (
                <ClothingForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchClothes}
                    isAccessory={false}
                />
            )}
        </div>
    );
};

export default Closet;
