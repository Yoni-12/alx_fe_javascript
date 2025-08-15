// Quotes array with initial quotes
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay positive.", category: "Motivation" },
  { text: "Be kind.", category: "Life" },
  { text: "Never give up.", category: "Inspiration" }
];

// Load from localStorage if available
if (localStorage.getItem('quotes')) {
  quotes = JSON.parse(localStorage.getItem('quotes'));
}

// Get last selected category
let lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';

// Display a random quote
function displayRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = "No quotes available in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById('quoteDisplay').innerText = filteredQuotes[randomIndex].text;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (text === "" || category === "") return;

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Save quotes and selected category
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('selectedCategory', document.getElementById('categoryFilter').value);
}

// Create add quote form
function createAddQuoteForm() {
  const container = document.getElementById('formContainer');
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Populate category dropdown with unique categories
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  select.innerHTML = '<option value="all">All Categories</option>';
  const categories = [];
  quotes.forEach(q => {
    if (!categories.includes(q.category)) {
      categories.push(q.category);
    }
  });
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.text = cat;
    select.appendChild(option);
  });
  select.value = lastSelectedCategory;
}

// Filter quotes based on selected category
function filterQuote() {
  lastSelectedCategory = document.getElementById('categoryFilter').value;
  saveQuotes();
  displayRandomQuote();
}

// Export quotes to JSON
document.getElementById('exportBtn').addEventListener('click', function() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Event listener for category filter
document.getElementById('categoryFilter').addEventListener('change', filterQuote);

// Initialize page
createAddQuoteForm();
populateCategories();
displayRandomQuote();
