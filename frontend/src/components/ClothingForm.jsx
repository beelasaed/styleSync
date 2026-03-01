import React, { useState } from 'react';
import apiClient from '../api/axios';
import { X, Upload } from 'lucide-react';

const ClothingForm = ({ onClose, onSuccess, isAccessory }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: isAccessory ? '' : 'top',
        type: isAccessory ? 'jewelry' : '',
        color: '',
        material: '',
        season: [],
        occasion: [],
        status: 'active'
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const categoriesList = ['top', 'bottom', 'dress', 'suit', 'outerwear', 'footwear'];
    const typesList = ['jewelry', 'bag', 'shoes', 'hat', 'belt'];
    const seasonsList = ['summer', 'winter', 'spring', 'fall', 'rainy'];
    const occasionsList = ['formal', 'casual', 'work', 'party', 'sport'];

    const toggleSelection = (list, item, field) => {
        const current = [...formData[field]];
        if (current.includes(item)) {
            setFormData({ ...formData, [field]: current.filter(i => i !== item) });
        } else {
            setFormData({ ...formData, [field]: [...current, item] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const currentIsAccessory = !!isAccessory;
        const endpoint = currentIsAccessory ? '/accessories' : '/clothes';
        const fileField = currentIsAccessory ? 'image' : 'images';

        console.log("--- StyleSync Upload Debug ---");
        console.log("Mode:", currentIsAccessory ? "Accessory" : "Clothing");
        console.log("Endpoint:", endpoint);
        console.log("File Field:", fileField);

        // Add array fields (already handled by the loop above, so we don't need these)
        // Except the loop skips empty ones, let's just use a clean build
        const data = new FormData();
        data.append('name', formData.name);
        data.append('color', formData.color);
        data.append('material', formData.material);
        data.append('status', formData.status);

        if (currentIsAccessory) {
            data.append('type', formData.type);
        } else {
            data.append('category', formData.category);
        }

        formData.season.forEach(s => data.append('season', s));
        formData.occasion.forEach(o => data.append('occasion', o));

        // Add file(s)
        if (currentIsAccessory) {
            if (images.length > 0) {
                data.append('image', images[0]);
                console.log("FormData field: 'image' (1 file)");
            }
        } else {
            images.forEach((img) => {
                data.append('images', img);
            });
            console.log(`FormData field: 'images' (${images.length} files)`);
        }

        try {
            const response = await apiClient.post(endpoint, data);
            console.log("Upload Success:", response.data);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Upload Error Details:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Upload Failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}><X size={20} /></button>
                <h2 style={{ marginBottom: '1.5rem' }}>{isAccessory ? 'Add New Accessory' : 'Add New Clothing'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Item Name</label>
                        <input
                            required
                            className="form-control"
                            placeholder={isAccessory ? "e.g. Gold Watch" : "e.g. Linen Summer Shirt"}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>{isAccessory ? 'Type' : 'Category'}</label>
                            <select
                                className="form-control"
                                value={isAccessory ? formData.type : formData.category}
                                onChange={e => setFormData({ ...formData, [isAccessory ? 'type' : 'category']: e.target.value })}
                            >
                                {isAccessory ? (
                                    typesList.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)
                                ) : (
                                    categoriesList.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)
                                )}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <input
                                required
                                className="form-control"
                                placeholder="Blue"
                                value={formData.color}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Season</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {seasonsList.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    className={`btn ${formData.season.includes(s) ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                                    onClick={() => toggleSelection(seasonsList, s, 'season')}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Occasion</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {occasionsList.map(o => (
                                <button
                                    key={o}
                                    type="button"
                                    className={`btn ${formData.occasion.includes(o) ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                                    onClick={() => toggleSelection(occasionsList, o, 'occasion')}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image{isAccessory ? '' : 's'}</label>
                        <div style={{
                            border: '2px dashed var(--border-color)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            cursor: 'pointer'
                        }} onClick={() => document.getElementById('img-upload').click()}>
                            <Upload size={24} color="#888" style={{ marginBottom: '0.5rem' }} />
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>
                                {images.length > 0 ? (isAccessory ? images[0].name : `${images.length} files selected`) : 'Click to upload image(s)'}
                            </p>
                            <input
                                id="img-upload"
                                type="file"
                                multiple={!isAccessory}
                                hidden
                                onChange={e => setImages(Array.from(e.target.files))}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Save Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClothingForm;
