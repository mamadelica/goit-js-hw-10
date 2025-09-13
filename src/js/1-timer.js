import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputEl = document.querySelector('#datetime-picker');
const btnEl = document.querySelector('button');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timer = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selected <= new Date()) {
      iziToast.warning({
        title: 'Увага',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      btnEl.disabled = true;
    } else {
      userSelectedDate = selected;
      btnEl.disabled = false;
    }
  },
};

flatpickr(inputEl, options);

btnEl.addEventListener('click', onClick);

function onClick(event) {
  btnEl.disabled = true;
  inputEl.disabled = true;
  timer = setInterval(timeCounter, 1000);
}

function timeCounter() {
  let timeNow = new Date();
  let countedTime = userSelectedDate - timeNow;

  if (countedTime <= 0) {
    clearInterval(timer);
    timeUpdate({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    inputEl.disabled = false;
    return;
  }
  const time = msecToSec(countedTime);
  timeUpdate(time);
}

function timeUpdate({ days, hours, minutes, seconds }) {
  daysEl.textContent = addZero(days);
  hoursEl.textContent = addZero(hours);
  minutesEl.textContent = addZero(minutes);
  secondsEl.textContent = addZero(seconds);
}

function addZero(value) {
  return String(value).padStart(2, '0');
}

function msecToSec(ms) {
  const sec = 1000;
  const min = sec * 60;
  const hour = min * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / min);
  const seconds = Math.floor((((ms % day) % hour) % min) / sec);
  return { days, hours, minutes, seconds };
}
