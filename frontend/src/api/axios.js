import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000/api', // Using 127.0.0.1 instead of localhost to avoid Node resolution issues
});

export default apiClient;
