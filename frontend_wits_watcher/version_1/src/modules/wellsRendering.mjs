import getAllWels from './getAllWells.mjs';

import deleteWell from './deleteWell.mjs';
import updateWell from './updateWell.mjs';

import secret_variables from '../../secret_variables.js';

const mainContainer = document.querySelector('.main');
const wellsContainer = document.getElementById('wells-container');

export default async function wellsRendering() {

  const allWells = await getAllWels();

  mainContainer.addEventListener('click', (e) => {

    const className = e.target.className;
    const settingsId = 'settings-popup-' + e.target.dataset.settingsId;

    const settingPopups = document.querySelectorAll('.well-card-settings-popup');
    const updatePopups = document.querySelectorAll('.well-card-update-modal');

    if (className === 'well-card-settings-btn') {

      settingPopups.forEach(elem => {

        if (elem.id === settingsId) {
          const toggleStatus = elem.getAttribute('data-state');

          if (toggleStatus === 'false') {
            elem.classList.remove('hide');
            elem.setAttribute('data-state', 'true');
          } else {
            elem.classList.add('hide');
            elem.setAttribute('data-state', 'false');
          }
        } else {
          elem.classList.add('hide');
          elem.setAttribute('data-state', 'false');
        }
      });

    } else {

      settingPopups.forEach((elem) => {
        if (e.target.className !== 'well-card-settings-item') {
          if (elem.getAttribute('data-state') === 'true') {
            elem.classList.add('hide');
            elem.setAttribute('data-state', 'false');
          }
        } else {

          const cardId = cutStr(elem.id, 0, 14);
          //TODO: нужно поменять метод cutStr на более специфичный, не завязанный на количество симвоов
          const isUpdatePopupOpenBtn = cardId === cutStr(e.target.id, 0, 20);
          const isDeleteItemForCard = cardId === cutStr(e.target.id, 0, 17);

          const updateType = e.target.dataset.itemType === 'update';
          const deleteType = e.target.dataset.itemType === 'delete';

          const modalPopup = document.getElementById(`update-popup-${cardId}`);

          if (isUpdatePopupOpenBtn && updateType) {
            modalPopup.classList.remove('hide');
          }

          if (isDeleteItemForCard && deleteType) {

            deleteWell(cardId);

            setTimeout(() => {
              location.reload();
            }, 500);
          }
        }
      });

      updatePopups.forEach((elem) => {
        const popupId = elem.getAttribute('data-update-popup-id');
        const updatePopupClose = e.target.dataset.updateCloseBtnId === popupId;
        const popupUpdateBtn = e.target.dataset.updateBtnId === popupId;

        const updateNameInputValue = elem.querySelector('#bush-name-update').value;
        const updateUrlInputValue = elem.querySelector('#api-url-update').value;

        if (updatePopupClose) {
          elem.classList.add('hide');
        }

        if (popupUpdateBtn) {
          const updateWellOpts = {
            bush_name: updateNameInputValue,
            api_url: updateUrlInputValue
          };

          updateWell(popupId, updateWellOpts);

          setTimeout(() => {
            location.reload();
          }, 500);
        }

      });

    }
  });

  allWells.forEach((doc) => {
    //! console.log(doc.id, " => ", doc.data());

    const wellCard = document.createElement('div');
    wellCard.id = doc.id;

    render(doc, wellCard);

    setInterval(() => {
      render(doc, wellCard);
    }, secret_variables.REQUEST_INTERVAL);

    wellsContainer.appendChild(wellCard);

  });
}

function render(doc, element) {

  fetch(doc.data().api_url, {
    mode: 'no-cors',
  })
    .then((response) => {

      if (response.status === 511) {
        return {
          status: '511'
        }
      } else if (response.status === 404) {
        return {
          status: '404'
        };
      } else if (response.status === 504) {
        return {
          status: '504'
        };
      } else {
        return response.json();
      }
    })
    .then((data) => {

      let status = '';
      let statusClass = 'no-gti-data';

      //TODO: перенести статусы в отдельный файл
      if (data.status === 'true') {
        status = 'OK &#9989;';
        statusClass = 'ok-data';
      } else if (data.status === 'false') {
        status = 'Нет данных от ГТИ &#128683;';
        statusClass = 'no-gti-data';
      } else if (data.status === 'server_trouble') {
        status = 'Не работает "WITS to OPC &#9940;"';
        statusClass = 'watcher-trouble';
      } else if (data.status === '511') {
        status = 'Обновите ссылку "localtunnel"';
        statusClass = 'watcher-trouble';
      } else if (data.status === '404') {
        status = '404 (битая ссылка "localtunnel" или завис "сервер наблюдатель") &#128219;';
        statusClass = 'watcher-trouble';
      } else if (data.status === '504') {
        status = 'Проблемма с <localtunnel>\nподождите 5-10 мин\nи снова перезапустите "сервер наблюдатель"';
        statusClass = 'watcher-trouble';
      }

      element.innerHTML = `
          <div class='well-card' data-id=${doc.id}>
            <div class='well-card-settings-btn' data-settings-id=${doc.id}>&#8230;</div>
            <div class='well-card-name'>${doc.data().bush_name}</div>
            <div title='${doc.data().api_url}' class="well-card-status ${statusClass}">
              <span>Статус: </span>
              ${status}
            </div>
            <div class='well-card-settings-popup hide' data-state='false' id='settings-popup-${doc.id}'>
              <div class='well-card-settings-item' data-item-type='update' id='settings-item-update-${doc.id}'>Изменить &#128397;</div>
              <div class='well-card-settings-item' data-item-type='delete' id='settings-item-del-${doc.id}'>Удалить &#128701;</div>
            </div>

            <div class='well-card-update-modal hide' id='update-popup-${doc.id}' data-update-popup-id=${doc.id}>
              <div class='well-card-update-modal-close' data-update-close-btn-id=${doc.id}>X</div>
              <div>
                <div>
                  <label for='bush-name-update'>Название: </label>
                </div>
                <input id='bush-name-update' data-update-name-input-id='${doc.id}' value=${doc.data().bush_name} />
              </div>
              <div>
                <div>
                  <label for='api-url-update'>Сылка: </label>
                </div>
                <input id='api-url-update' data-update-url-input-id='${doc.id}' value=${doc.data().api_url} />
              </div>
              <div class='well-card-update-modal-btn' data-update-btn-id=${doc.id}>ОБНОВИТЬ</div>
            </div>
          </div>
        `;
    })
    .catch(err => console.log(err));

  console.log('Идет запрос => ', doc.data().api_url, doc.id);
}

function cutStr(str, cutStart, cutEnd) {
  return str.substr(0, cutStart) + str.substr(cutEnd + 1);
}