import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateData';
import { bookTour } from './stripe';

const loginform = document.getElementById('loginForm');

const logoutbut = document.querySelector('.nav__el--logout');
const imgbutton = document.querySelector('.profileimg');
const bokking = document.getElementById('book');

if (loginform) {
  loginform.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
    login(email, password);
  });
}

const form = document.getElementById('userDataForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const upbutton = document.querySelector('.form__upload').value;

    const data = {
      name,
      email,
      upbutton,
    };

    updateSettings(data, 'data');
  });
}

const passwordForm = document.getElementById('passwordForm');

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldpassword = document.getElementById('password-current').value;
    const newpassword = document.getElementById('password').value;
    const repassword = document.getElementById('password-confirm').value;
    const data = {
      oldpassword,
      newpassword,
      repassword,
    };

    await updateSettings(data, 'password');
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logoutbut) {
  logoutbut.addEventListener('click', logout);
}

if (imgbutton) {
  imgbutton.addEventListener('click', () => {
    location.href = '/api/template/me';
  });
}

const booking = document.querySelector('.logg');
if (booking) {
  booking.addEventListener('click', () => {
    location.href = '/api/template/login';
  });
}

if (bokking) {
  bokking.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    console.log(tourId);
    bookTour(tourId);
  });
}
