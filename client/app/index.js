let records = [];
let selectedPlace = 'map';

const title = document.getElementById('title');
const navItems = Array.from(document.querySelectorAll('.navbar .nav-item'));
const innerContent = document.getElementById('inner-content');
const details = document.getElementById('details');
const detailsTitle = document.getElementById('details-title');
const detailsContent = document.getElementById('details-content');

function fetchRecords() {
  return fetch(window.origin + '/api/log', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      return response.json().then(data => {
        records = data;
        applyRecords();
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
let showedDetails = false;
fetchRecords().then(() => {
  if (showedDetails) return;

  const path = window.location.pathname.split('/').filter(item => item);
  if (path.length > 2 && path[1] == 'details') {
    const record = records.find(record => record.unlocked && record.id === parseInt(path[2]));
    if (record) {
      showRecord(record);
    }
  }
});

const titles = {
  map: 'Інструкції',
  book: 'Бортовий журнал',
  mail: 'Листи',
}

const typeMapping = {
  map: 'instruction',
  book: 'log',
  mail: 'letter',
}

function navigate(place) {
  navItems.forEach(item => item.classList.remove('active'));
  navItems.find(item => item.classList.contains(place)).classList.add('active');

  title.classList.add('collapsed')
  selectedPlace = place;
  const fetchResult = fetchRecords();

  innerContent.classList.add('hidden');
  fetchResult.then(applyRecords);
  fetchResult.then(() => setTimeout(() => {
    title.innerText = titles[place];
    title.classList.remove('collapsed');
  }, 350))
}

function applyRecords() {
  setTimeout(() => {
    innerContent.innerHTML = '';
    innerContent.scrollTop = 0;
    const cards = document.createElement('div');
    cards.classList.add('cards-container')
    innerContent.appendChild(cards);
    records
      .filter(record => record.unlocked && record.type === typeMapping[selectedPlace])
      .sort((r1, r2) => +r1.id - +r2.id)
      .forEach(record => {
      const element = document.createElement('div');
      element.classList.add('record');
      element.innerHTML = `
        <img src="/images/${record.image}" alt="${record.title}" class="record-image">
        <div class="record-title">
          <span>${record.title}</span>
          <span>Від ${formatDate(new Date(Date.parse(record.date)))}</span>
        </div>
      `;
      element.addEventListener('click', () => {
        showRecord(record);
      });
      cards.appendChild(element);
    });
    innerContent.classList.remove('hidden');
  }, 350);
}

const showRecord = (record) => {
  detailsTitle.innerText = record.title;
  detailsContent.innerHTML = `${record.text}
    <img src="/images/${record.image}" alt="${record.title}" class="details-image">
    <p class="date">${formatDate(new Date(Date.parse(record.date)))}</p>`
  detailsContent.scrollTop = 0;

  openDetails();
}

function hideDetails() {
  details.classList.add('hidden');
}

function openDetails() {
  details.classList.remove('hidden');
}

function formatDate(date) {
  const months = [
    "Січ.",
    "Лют.",
    "Бер.",
    "Квіт.",
    "Трав.",
    "Черв.",
    "Лип.",
    "Серп.",
    "Вер.",
    "Жовт.",
    "Лист.",
    "Груд."
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const formattedDate = `${day} ${month} ${year} р.`;

  return formattedDate;
}