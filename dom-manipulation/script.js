// script.js

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

let serverQuotes = [...quotes]; // Simulated "server-side" data

// Save quotes locally
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    display.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  display.textContent = `"${quote.text}" - ${quote.category}`;
}

// Create add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Add a new quote locally + push to server
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;
  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    pushQuotesToServer(newQuote);
    alert("Quote added and synced!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// --- Server Sync Simulation ---

// Pretend to "fetch" quotes from server
function fetchQuotesFromServer() {
  // Compare server and local
  const serverData = [...serverQuotes];
  if (JSON.stringify(serverData) !== JSON.stringify(quotes)) {
    quotes = serverData;
    saveQuotes();
    notifyConflictResolution();
    displayRandomQuote();
  }
}

// Pretend to "push" a new quote to server
function pushQuotesToServer(newQuote) {
  serverQuotes.push(newQuote);
}

// Notify user of conflict resolution
function notifyConflictResolution() {
  const display = document.getElementById("quoteDisplay");
  const msg = document.createElement("p");
  msg.style.color = "red";
  msg.textContent = "Conflict detected. Server data used.";
  display.appendChild(msg);
}

// --- Event Listeners ---
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Init
createAddQuoteForm();
displayRandomQuote();

// Periodically sync with "server"
setInterval(fetchQuotesFromServer, 10000);
