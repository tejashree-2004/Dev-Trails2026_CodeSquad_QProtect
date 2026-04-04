import axios from 'axios';

const BASE = 'http://127.0.0.1:5000/api';

export const registerWorker = (data) => axios.post(`${BASE}/register`, data);
export const getPremium = (data) => axios.post(`${BASE}/premium`, data);
export const activatePolicy = (data) => axios.post(`${BASE}/policy/activate`, data);
export const getDashboard = (id) => axios.get(`${BASE}/dashboard/${id}`);
export const checkDisruption = (zone) => axios.post(`${BASE}/disruption/check`, { zone });