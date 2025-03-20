import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

export const getProducts = async (params) => {
    return await axios.get(API_URL, { params });
};
