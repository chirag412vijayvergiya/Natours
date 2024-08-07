import axios from 'axios';
import { showAlert } from './alert';

export const createFavourite = async (tourId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/favourite',
      data: {
        tour: tourId,
      },
    });
    if (res.status >= 200 && res.status < 300) {
      showAlert('success', 'Tour became your Favourite!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
