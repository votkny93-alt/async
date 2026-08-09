const statusMessage = document.getElementById('status-message');
const containerUsers = document.getElementById('container-users');
const deleteOne = document.getElementById('delete-one');
const deleteAll = document.getElementById('delete-all');
const getAll = document.getElementById('get-all');
const title = document.querySelector(".title-header");
const container = document.querySelector(".container");
const template = document.getElementById('user-template');

let currentUsers = [];
const data = localStorage.getItem('users');

// 1. загрузка старта страницы
if (data) {
  currentUsers = JSON.parse(data).users;

  if (currentUsers && currentUsers.length === 0) {
    statusMessage.textContent = "Список пользователей пуст. Нажмите 'Получить все' для загрузки.";
    statusMessage.style.color = "gray";
    renderUsers([]);
  } else {
    statusMessage.textContent = "";
    renderUsers(currentUsers);
  }
} else {
  loadDataFromServer(true);
}

// 2. показ карточек
function renderUsers(usersArray) {
  container.querySelectorAll('.user-card').forEach(card => card.remove());
  usersArray.forEach(user => {
    const card = template.content.cloneNode(true);
    card.querySelector('.user-id').textContent = `${user.id}`;
    card.querySelector('.user-name').textContent = `${user.name}`;
    card.querySelector('.user-email').textContent = `${user.email}`;
    card.querySelector('.user-age').textContent = `${user.age}`;
    container.append(card);
  });
}

// 3. загрузка данных с сервера
function loadDataFromServer(useDelay = false) {
  if (currentUsers && currentUsers.length === 0) {
    statusMessage.textContent = "Данные загружаются...";
  } else {
    statusMessage.textContent = "Восстановление данных...";
  }
  statusMessage.style.color = "black";

  // fetch-запроса
  const makeRequest = () => {
    fetch('./json.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки");
        }
        return response.json();
      })
      .then(users => {
        localStorage.setItem('users', JSON.stringify(users));
        statusMessage.textContent = "";
        renderUsers(users.users);
      })
      .catch(error => {
        statusMessage.textContent = "Не удалось загрузить данные.";
        statusMessage.style.color = "red";
      });
  };

  if (useDelay) {
    setTimeout(makeRequest, 2000);
  } else {
    makeRequest();
  }
}

// 4. кнопка удалить всех
deleteAll.addEventListener('click', () => {
  localStorage.removeItem('users', JSON.stringify({ users: [] }));
  currentUsers = [];
  const cards = document.querySelectorAll('.user-card');
  cards.forEach(card => card.remove());
});

// 5. кнопка восстановить всех
getAll.addEventListener('click', () => {
  const currentCardsCount = document.querySelectorAll('.user-card').length;

  loadDataFromServer(false);
});

// 6. кнопка удалить одного
deleteOne.addEventListener('click', () => {
  const inputId = prompt("Введите ID пользователя для удаления:");
  if (inputId === null) return;

  const idToDestroy = Number(inputId);
  const storedData = JSON.parse(localStorage.getItem('users'));

  if (!storedData || !storedData.users || storedData.users.length === 0) {
    alert('Данные отсутствуют или список пуст!');
    return;
  }

  const filteredUsers = storedData.users.filter(user => user.id !== idToDestroy);
  localStorage.setItem('users', JSON.stringify({ users: filteredUsers }));
  renderUsers(filteredUsers);
});
