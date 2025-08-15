// Quotes array
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "An unexamined life is not worth living.", category: "Philosophy" }
];

// Load saved quotes from localStorage if available
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
  let quoteDisplay = document.getElementById("quoteDisplay");
  let category = document.getElementById("categoryFilter").value;

  let filteredQuotes = (category === "all") 
    ? quotes 
    : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = randomQuote.text + " (" + randomQuote.category + ")";
  
  // Save last viewed category to localStorage
  localStorage.setItem("lastCategory", category);
}

// Function to add a new quote
function addQuote() {
  let textInput = document.getElementById("newQuoteText").value;
  let categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  }
}

// Create add-quote form dynamically
function createAddQuoteForm() {
  let formContainer = document.getElementById("formContainer");

  let textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  let categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  let addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addBtn);
}

// Extract unique categories and populate dropdown
function populateCategories() {
  let categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  let categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  let lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
  }
}

// Filter quotes based on category
function filterQuotes() {
  displayRandomQuote();
  // Save selected category in localStorage
  let selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Initialize
createAddQuoteForm();
populateCategories();
displayRandomQuote();
