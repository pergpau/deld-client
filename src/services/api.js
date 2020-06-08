import axios from 'axios';
import router from '../router';
import store from '../store';

const api = axios.create({
  baseURL: process.env.VUE_APP_NODE_HOST,
  headers: {
    "Content-type": "application/json",
  }
});

api.interceptors.request.use(
  config => {
    const token = store.getters.token;
    if (token) {
      config.headers.common["Authorization"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  res => { return res },
  err => {
    if (err.response.status == 401) {
      router.push('/login')
      store.dispatch('logout')
    }
    return Promise.reject(err);
  }
);

export default api;