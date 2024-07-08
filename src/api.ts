import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
	withCredentials: true,
});

api.interceptors.request.use((config:any) => {
	const token = document.cookie.split('; ')
  .find(row => row.startsWith('refreshToken='))
  ?.split('=')[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
