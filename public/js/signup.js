import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name, email, password, confirmpassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm: confirmpassword,
      },
    });
    if (res.status >= 200 && res.status < 300) {
      showAlert('success', 'signup successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    // console.log(err.response.data);
    // console.log(err.response.status);
    // console.log(err.response.headers);
    showAlert('error', err.response.data.message);
  }
};
