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
if (data) {
  currentUsers = JSON.parse(data).users;
  console.log("Данные получены");
  renderUsers(JSON.parse(data).users);
}
else {
  setTimeout(() => {
    fetch('/json.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки");
        }
        return response.json();
      })
      .then(users => {
        console.log("Данные успешно загружены из файла:", users);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsers(users.users);
      })
      .catch(error => {
        title.textContent = "Ошибка при загрузке данных";
        title.style.color = "red";
      });
  }, 2000);
};

function renderUsers(usersArray) {
  container.querySelectorAll('.user-card').forEach(card => card.remove());
  usersArray.forEach(user => {
    const card = template.content.cloneNode(true);
    card.querySelector('.user-id').textContent = `${user.id}`
    card.querySelector('.user-name').textContent = `${user.name}`
    card.querySelector('.user-email').textContent = `${user.email}`
    card.querySelector('.user-age').textContent = `${user.age}`
    container.append(card);
  });
};

deleteAll.addEventListener('click', () => {
  localStorage.removeItem('users');
  const cards = document.querySelectorAll('.user-card');
  cards.forEach(card =>
    card.remove());
});

getAll.addEventListener('click', () => {
  const currentCardsCount = document.querySelectorAll('.users-card').length;
  if (currentCardsCount === 5) {
    alert("Все пользователи уже отображены на странице");
  }
  else {
    fetch('/json.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки");
        }
        return response.json();
      })
      .then(users => {
        localStorage.setItem('users', JSON.stringify(users));
        renderUsers(users.users);
      })
      .catch(error => {
        alert("Не удалось восстановить данные: " + error.message);
      });
    }
  });

deleteOne.addEventListener('click', () => {
  const inputId  = prompt("Введите ID пользователя для удаления:");
  if (inputId === null) return;
  const idToDestroy = Number(inputId);
  const storedData = JSON.parse(localStorage.getItem('users'));
  if (!storedData || !storedData.users) {
    alert('Данные еще не загружены!');
    return;
  }

  const filteredUsers = storedData.users.filter(user => user.id !== idToDestroy)
    localStorage.setItem('users', JSON.stringify({ users: filteredUsers }));
    renderUsers(filteredUsers);
});


