import axios from 'axios';
import { showAlert } from './alert.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/auth/login',
      data: {
        email,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.href = '/api/template';
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/auth/logout',
    });

    if (res.data.status === 'success') {
      if (window.location.pathname.startsWith('/api/template/me')) {
        location.href = '/api/template';
      } else {
        location.reload(true);
      }
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
