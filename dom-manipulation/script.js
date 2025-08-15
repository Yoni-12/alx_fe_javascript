// Quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Default quote one", category: "General" },
  { text: "Default quote two", category: "Inspiration" }
];

// Display quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newQuote = {
    text: textInput.value,
    category: categoryInput.value
  };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote); // post to mock API
  populateCategories();
  displayRandomQuote();
  textInput.value = "";
  categoryInput.value = "";
}

// Create add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote">
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Populate category dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  filter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
  const savedFilter = localStorage.getItem("selectedCategory") || "all";
  filter.value = savedFilter;
}

// Filter quotes
function filterQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", filter);
  const quoteDisplay = document.getElementById("quoteDisplay");
  let filteredQuotes = quotes;
  if (filter !== "all") {
    filteredQuotes = quotes.filter(q => q.category === filter);
  }
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes in this category.";
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
  }
}

// --- MOCK SERVER INTERACTION ---

// Post quote to "server"
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  .then(response => response.json())
  .then(data => {
    showNotification("Quote posted to server (simulated).");
    addLog("Posted new quote to server: " + JSON.stringify(quote));
  });
}

// Sync quotes with server
function syncQuotes() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(serverQuotes => {
      // Just simulate: take first 5 as server quotes
      const simulatedServerQuotes = serverQuotes.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server"
      }));

      // Conflict resolution: server overwrites local
      quotes = simulatedServerQuotes.concat(quotes);
      saveQuotes();
      populateCategories();
      displayRandomQuote();
      showNotification("Quotes synced with server. Server data took precedence.");
      addLog("Synced with server, local overwritten by server quotes.");
    });
}

// Notification (temporary)
function showNotification(message) {
  const note = document.getElementById("notification");
  note.innerText = message;
  setTimeout(() => { note.innerText = ""; }, 4000);
}

// Persistent log
function addLog(message) {
  const logContainer = document.getElementById("logContainer");
  const entry = document.createElement("div");
  entry.textContent = new Date().toLocaleTimeString() + ": " + message;
  logContainer.appendChild(entry);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("syncNow").addEventListener("click", syncQuotes);

// Initialize
createAddQuoteForm();
populateCategories();
displayRandomQuote();
syncQuotes(); // first sync
setInterval(syncQuotes, 10000); // periodic sync every 10s
