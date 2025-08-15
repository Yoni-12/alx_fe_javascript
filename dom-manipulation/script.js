// Quotes array with initial quotes
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay positive.", category: "Motivation" },
  { text: "Be kind.", category: "Life" },
  { text: "Never give up.", category: "Inspiration" }
];

// Load from localStorage if available
if(localStorage.getItem('quotes')) {
  quotes = JSON.parse(localStorage.getItem('quotes'));
}

// Get last selected category filter
let lastCategory = localStorage.getItem('lastCategory') || 'all';

// Display a random quote (filtered by category)
function displayRandomQuote() {
  let category = document.getElementById('categoryFilter').value || 'all';
  let filteredQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  if(filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = "No quotes available in this category.";
    return;
  }
  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById('quoteDisplay').innerText = filteredQuotes[randomIndex].text;
}

// Add a new quote
function addQuote() {
  let textInput = document.getElementById('newQuoteText').value.trim();
  let categoryInput = document.getElementById('newQuoteCategory').value.trim();
  if(textInput === "" || categoryInput === "") return;

  quotes.push({ text: textInput, category: categoryInput });
  saveQuotes();
  populateCategories();
  displayRandomQuote();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Save quotes and last category to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('lastCategory', document.getElementById('categoryFilter').value);
}

// Create the form for adding quotes
function createAddQuoteForm() {
  const container = document.getElementById('formContainer');
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Populate category dropdown dynamically
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  let categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    let option = document.createElement('option');
    option.value = cat;
    option.text = cat;
    select.appendChild(option);
  });
  // Restore last selected category
  select.value = lastCategory;
}

// Filter quotes based on selected category
function filterQuotes() {
  lastCategory = document.getElementById('categoryFilter').value;
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

// Initialize
createAddQuoteForm();
populateCategories();
displayRandomQuote();
