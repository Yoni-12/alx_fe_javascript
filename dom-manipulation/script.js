let quotes = [];
const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const notification = document.getElementById('notification');
const newQuoteButton = document.getElementById('newQuote');

loadQuotes();
populateCategories();
showRandomQuote();
syncQuotes();

// fetch quotes from server using mock API
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: 'server'
    }));
  } catch (err) {
    console.error('Error fetching from server:', err);
    return [];
  }
}

// post new quote to server using mock API
async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
  } catch (err) {
    console.error('Error posting to server:', err);
  }
}

// add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) {
    notification.textContent = 'Please enter both quote and category.';
    return;
  }
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  notification.textContent = 'Quote added!';
  postQuoteToServer(newQuote);
  showRandomQuote();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// display random quote based on filter
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// populate category dropdown
function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  const lastCategory = localStorage.getItem('lastCategory') || 'all';
  categoryFilter.value = lastCategory;
}

// filter quotes by selected category
function filterQuotes() {
  localStorage.setItem('lastCategory', categoryFilter.value);
  showRandomQuote();
}

// save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// load quotes from local storage
function loadQuotes() {
  const saved = localStorage.getItem('quotes');
  if (saved) {
    quotes = JSON.parse(saved);
  } else {
    quotes = [
      { text: 'The early bird catches the worm.', category: 'inspiration' },
      { text: 'Knowledge is power.', category: 'wisdom' }
    ];
  }
}

// sync local quotes with server every 15 seconds
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let newData = false;

  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
    if (!exists) {
      quotes.push(sq);
      newData = true;
    }
  });

  if (newData) {
    saveQuotes();
    populateCategories();
    notification.textContent = 'Quotes updated from server!';
  }

  setTimeout(syncQuotes, 15000); // repeat every 15 seconds
}

// show new quote button listener
newQuoteButton.addEventListener('click', showRandomQuote);
