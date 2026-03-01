const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
    // Clothes
    getClothes: async () => {
        const response = await fetch(`${API_BASE_URL}/clothes`);
        return response.json();
    },
    addClothes: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/clothes`, {
            method: 'POST',
            body: formData,
        });
        return response.json();
    },
    deleteClothes: async (id) => {
        const response = await fetch(`${API_BASE_URL}/clothes/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Outfits
    generateOutfit: async (location, occasion) => {
        const response = await fetch(`${API_BASE_URL}/outfits/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, occasion }),
        });
        return response.json();
    },
    getOutfits: async () => {
        const response = await fetch(`${API_BASE_URL}/outfits`);
        return response.json();
    },
    deleteOutfit: async (id) => {
        const response = await fetch(`${API_BASE_URL}/outfits/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    }
};
