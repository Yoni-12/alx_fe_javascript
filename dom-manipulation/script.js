// Initialize quotes array from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Be yourself; everyone else is already taken.", category: "Motivation" }
];

// Get references to HTML elements we need
let quoteDisplay = document.getElementById('quoteDisplay');
let newQuoteBtn = document.getElementById('newQuote');
let categoryFilter = document.getElementById('categoryFilter');
let notificationDiv = document.getElementById('notification');
let importFile = document.getElementById('importFile');

// Display a random quote, optionally filtered by category
function showRandomQuote() {
  let filteredQuotes = quotes;

  if (categoryFilter.value != 'all') {
    filteredQuotes = [];
    for (let i = 0; i < quotes.length; i++) {
      if (quotes[i].category == categoryFilter.value) {
        filteredQuotes.push(quotes[i]);
      }
    }
  }

  if (filteredQuotes.length > 0) {
    let index = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerText = filteredQuotes[index].text;
  }
}

// Add a new quote from user input, update localStorage, categories, and server
function addQuote() {
  let textInput = document.getElementById('newQuoteText');
  let categoryInput = document.getElementById('newQuoteCategory');

  if (textInput.value == '' || categoryInput.value == '') {
    alert('Please enter both text and category!');
    return;
  }

  let newQuote = { text: textInput.value, category: categoryInput.value };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();
  postQuoteToServer(newQuote);

  textInput.value = '';
  categoryInput.value = '';
}

// Populate category dropdown dynamically based on existing quotes
function populateCategories() {
  let categories = ['all'];
  for (let i = 0; i < quotes.length; i++) {
    if (categories.indexOf(quotes[i].category) === -1) {
      categories.push(quotes[i].category);
    }
  }

  categoryFilter.innerHTML = '';
  for (let i = 0; i < categories.length; i++) {
    let option = document.createElement('option');
    option.value = categories[i];
    option.innerText = categories[i];
    categoryFilter.appendChild(option);
  }

  let savedCategory = localStorage.getItem('lastCategory');
  if (savedCategory) categoryFilter.value = savedCategory;
}

// Filter displayed quotes based on selected category and save preference
function filterQuotes() {
  showRandomQuote();
  localStorage.setItem('lastCategory', categoryFilter.value);
}

// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

// Import quotes from a JSON file and update localStorage
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Mock API endpoint for demonstration
let mockAPI = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from mock server
function fetchQuotesFromServer() {
  return fetch(mockAPI)
    .then(response => response.json())
    .then(data => {
      let serverQuotes = [];
      for (let i = 0; i < data.length; i++) {
        serverQuotes.push({ text: data[i].title, category: 'Server' });
      }
      return serverQuotes;
    })
    .catch(error => {
      console.log('Error fetching from server:', error);
      return [];
    });
}

// Post a single quote to mock server
function postQuoteToServer(quote) {
  fetch(mockAPI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote)
  })
  .then(() => showNotification('New quote synced to server.'))
  .catch(() => showNotification('Failed to sync quote to server.'));
}

// Sync local quotes with server, resolve conflicts by adding missing server quotes
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let newData = false;

    for (let i = 0; i < serverQuotes.length; i++) {
      let exists = false;
      for (let j = 0; j < quotes.length; j++) {
        if (quotes[j].text == serverQuotes[i].text) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        quotes.push(serverQuotes[i]);
        newData = true;
      }
    }

    if (newData) {
      saveQuotes();
      populateCategories();
      showRandomQuote();
      showNotification('Quotes updated from server!');
    }
  });
}

// Show temporary notifications for user actions or server updates
function showNotification(message) {
  notificationDiv.innerText = message;
  setTimeout(function() {
    notificationDiv.innerText = '';
  }, 4000);
}

// Wire up buttons and inputs to their respective functions
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes);
importFile.addEventListener('change', importFromJsonFile);

// Populate categories, show a quote, sync with server, and start periodic sync
populateCategories();
showRandomQuote();
syncQuotes();
setInterval(syncQuotes, 10000);
