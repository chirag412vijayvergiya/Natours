/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// export const updateData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
//       data: {
//         name,
//         email,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Data updated successfully!');
//       window.setTimeout(() => {
//         location.assign('/me');
//       }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

//type is either 'password' or data
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? 'updateMyPassword' : 'updateMe';
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/${url}`,
      data,
    });
    console.log(url);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.reload('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
