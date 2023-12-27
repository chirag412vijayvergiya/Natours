/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
//import { updateData } from './updateSetting';
import { updateSettings } from './updateSetting';
import { bookTour } from './stripe';
import { signup } from './signup';
import { createFavourite } from './favourite';

//DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const signupForm = document.querySelector('.form--signup');
const favouriteBtn = document.querySelector('#book-fav');

//DELEGATION
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}
//console.log(locations);

//VALUES

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const Name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const Confirmpassword = document.getElementById('confirmpassword').value;
    //console.log(Name, email, password, Confirmpassword);
    signup(Name, email, password, Confirmpassword);
  });
}

// if (userDataForm) {
//   userDataForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const name = document.getElementById('name').value;
//     updateData(name, email);
//   });
// }

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    //document.querySelector('.btn--save-data').textContent = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;
    await updateSettings(form, 'data');
    //document.querySelector('.btn--save-data').textContent = 'Save settings';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (favouriteBtn) {
  favouriteBtn.addEventListener('click', (e) => {
    //console.log(user);
    const { tourId } = e.target.dataset;
    console.log(tourId);
    createFavourite(tourId);
  });
}
