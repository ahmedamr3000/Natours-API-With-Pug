import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  const url = type === 'password' ? 'auth/changeUserPass' : 'allusers';
  const res = axios({
    method: 'PUT',
    url: `http://localhost:4200/api/${url}`,
    data,
  });
  if (res?.data?.status === 'success') {
    showAlert('success', 'Logged in successfully!');
  }
};
