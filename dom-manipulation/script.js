let quotes = [];
let lastSelectedCategory = 'all';
let notificationTimeout;

// Load quotes from localStorage on page load
if (localStorage.getItem('quotes')) {
  quotes = JSON.parse(localStorage.getItem('quotes'));
}

// Load last selected category
if (localStorage.getItem('lastSelectedCategory')) {
  lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  document.getElementById('categoryFilter').value = lastSelectedCategory;
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
  let filteredQuotes = filterQuotesArray();
  if (filteredQuotes.length === 0) return;

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById('quoteDisplay').textContent = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
}

function filterQuotesArray() {
  let selectedCategory = document.getElementById('categoryFilter').value;
  return selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
}

function addQuote() {
  let text = document.getElementById('newQuoteText').value.trim();
  let category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return;

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

function populateCategories() {
  let select = document.getElementById('categoryFilter');
  let categories = ['all', ...new Set(quotes.map(q => q.category))];

  select.innerHTML = '';
  categories.forEach(cat => {
    let option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.value = lastSelectedCategory;
}

function filterQuotes() {
  lastSelectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastSelectedCategory', lastSelectedCategory);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Mock API interaction
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();
  // Only take the first 5 posts for simulation
  return data.slice(0, 5).map(d => ({ text: d.title, category: 'Server' }));
}

async function postQuoteToServer(quote) {
  await fetch(SERVER_URL, {
    method: 'POST',
    body: JSON.stringify(quote),
    headers: { 'Content-Type': 'application/json' }
  });
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(sq => {
    if (!quotes.some(q => q.text === sq.text && q.category === sq.category)) {
      quotes.push(sq);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification('Quotes updated from server!');
  }
}

// Show notification in UI
function showNotification(message) {
  clearTimeout(notificationTimeout);
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notificationTimeout = setTimeout(() => notification.textContent = '', 5000);
}

// Periodically sync with server every 30 seconds
setInterval(syncQuotes, 30000);

// Initialize app
populateCategories();
filterQuotes();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
