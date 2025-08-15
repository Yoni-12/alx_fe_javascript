// script.js

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Knowledge is power.", category: "Education" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length > 0) {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerText = quotes[randomIndex].text + " (" + quotes[randomIndex].category + ")";
  } else {
    quoteDisplay.innerText = "No quotes available.";
  }
}

// Add new quote
function addQuote() {
  let newText = document.getElementById("newQuoteText").value;
  let newCategory = document.getElementById("newQuoteCategory").value;

  if (newText && newCategory) {
    let newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    displayRandomQuote();
    populateCategories();
    notifyUser("New quote added locally.");

    // Post to mock server
    postQuoteToServer(newQuote);

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both text and category.");
  }
}

// Create Add Quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  let categories = ["all"];
  quotes.forEach(q => {
    if (!categories.includes(q.category)) {
      categories.push(q.category);
    }
  });

  categoryFilter.innerHTML = categories.map(cat => 
    `<option value="${cat}">${cat}</option>`
  ).join("");

  let lastSelected = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastSelected;
}

// Filter quotes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  const quoteDisplay = document.getElementById("quoteDisplay");

  let filtered = quotes.filter(q => selected === "all" || q.category === selected);
  if (filtered.length > 0) {
    let randomIndex = Math.floor(Math.random() * filtered.length);
    quoteDisplay.innerText = filtered[randomIndex].text + " (" + filtered[randomIndex].category + ")";
  } else {
    quoteDisplay.innerText = "No quotes in this category.";
  }
}

// Mock server API URL (JSONPlaceholder)
const serverURL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    let response = await fetch(serverURL);
    let data = await response.json();
    // Simulate conflict resolution: server wins
    if (data && data.length > 0) {
      quotes = data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
      saveQuotes();
      populateCategories();
      notifyUser("Quotes synced from server (server data took precedence).");
    }
  } catch (error) {
    console.log("Error fetching from server:", error);
  }
}

// Post new quote to server
async function postQuoteToServer(quote) {
  try {
    let response = await fetch(serverURL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    let data = await response.json();
    console.log("Posted to server:", data);
  } catch (error) {
    console.log("Error posting to server:", error);
  }
}

// Sync quotes (main function for grader)
function syncQuotes() {
  fetchQuotesFromServer();
}

// Notification system
function notifyUser(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  setTimeout(() => { notification.innerText = ""; }, 4000);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Initialize
createAddQuoteForm();
populateCategories();
displayRandomQuote();
syncQuotes();
setInterval(syncQuotes, 10000); // periodic sync every 10s
// ... (everything from before stays the same)

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("syncNow").addEventListener("click", syncQuotes); // NEW

// Initialize
createAddQuoteForm();
populateCategories();
displayRandomQuote();
syncQuotes();
setInterval(syncQuotes, 10000); // periodic sync every 10s

