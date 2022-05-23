import createNewWell from "./createNewWell.mjs";

const openModal = document.getElementById('add-well-btn');
const modalForm = document.getElementById('add-well-modal');

const modalClose = document.getElementById('add-modal-close');
const createButton = document.getElementById('add-well-modal-btn');

const validatePopup = document.getElementById('validate-popup');
const validateErrText = document.getElementById('validate-err-text');
const btnPopupClose = document.getElementById('btn-popup-close');

const inputBushName = document.getElementById('bush-name');
const inputApiUrl = document.getElementById('api-link');

export default function modalFormCrateNewWell() {

  let bushName = '';
  let apiUrl = '';

  openModal.addEventListener('click', () => {
    modalForm.classList.remove('hide');
  });

  modalClose.addEventListener('click', () => {
    modalForm.classList.add('hide');
  });

  inputBushName.addEventListener('input', (e) => {
    bushName = e.target.value;
  });

  inputApiUrl.addEventListener('input', (e) => {
    apiUrl = e.target.value;
  });

  createButton.addEventListener('click', async (e) => {

    e.preventDefault();

    const wellOpts = {
      bush_name: bushName.trim(),
      api_url: apiUrl.trim()
    };

    const urlRegExp = /[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/gi;

    if (urlRegExp.test(wellOpts.api_url) && wellOpts.bush_name !== '') {

      createNewWell(wellOpts);
      validatePopup.classList.remove('hide');
      validateErrText.innerText = 'Созданно!';
      modalForm.classList.add('hide');

    } else {

      validatePopup.classList.remove('hide');

      if (urlRegExp.test(wellOpts.bush_name) === false) {
        validateErrText.innerText = 'Введите коректный URL';
      }

      if (wellOpts.bush_name === '') {
        validateErrText.innerText = 'Название куста не должно быть пустым';
      }

      if (urlRegExp.test(wellOpts.bush_name) === false && wellOpts.bush_name === '') {
        validateErrText.innerText = 'Введите коректный URL \nтак же название куста \nне должно быть пустым';
      }
    }
  });

  btnPopupClose.addEventListener('click', () => {
    validatePopup.classList.add('hide');

    setTimeout(() => {
      location.reload();
    }, 200);
  });
}