let quotes = [];
let selectedCategory = 'all';

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote based on selected category
function showRandomQuote() {
  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = 'No quotes available';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById('quoteDisplay').innerText = filteredQuotes[randomIndex].text;
}

// Add a new quote and update DOM/storage
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const newQuote = { text: textInput.value, category: categoryInput.value || 'General' };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();
  postQuoteToServer(newQuote);
  textInput.value = '';
  categoryInput.value = '';
}

// Populate category dropdown dynamically
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.text = cat;
    categorySelect.appendChild(option);
  });
  // Restore last selected category
  const storedCategory = localStorage.getItem('selectedCategory');
  if (storedCategory) {
    categorySelect.value = storedCategory;
    selectedCategory = storedCategory;
  }
}

// Filter quotes when category changes
function filterQuotes() {
  const categorySelect = document.getElementById('categoryFilter');
  selectedCategory = categorySelect.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// Notification display for updates/conflicts
function showNotification(message) {
  let notificationDiv = document.getElementById('notification');
  notificationDiv.innerText = message;
  setTimeout(() => notificationDiv.innerText = '', 4000);
}

// Fetch quotes from mock API
function fetchQuotesFromServer() {
  return fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
      return data.map(item => ({ text: item.title, category: 'Server' }));
    })
    .catch(error => {
      showNotification('Error fetching data from server');
      return [];
    });
}

// Post new quote to mock API
function postQuoteToServer(quote) {
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote)
  })
  .then(() => showNotification('Quote synced to server'))
  .catch(() => showNotification('Failed to sync quote to server'));
}

// Sync local quotes with server quotes
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let updated = false;
    serverQuotes.forEach(serverQuote => {
      let exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote);
        updated = true;
      }
    });
    if (updated) {
      saveQuotes();
      populateCategories();
      showRandomQuote();
      showNotification('Quotes updated from server!');
    }
  });
}

// Set up event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Start periodic sync every 10 seconds
setInterval(syncQuotes, 10000);

// Initialize
loadQuotes();
populateCategories();
showRandomQuote();
