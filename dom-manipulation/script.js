// ====== QUOTES DATA AND STORAGE ======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Be yourself; everyone else is already taken.", category: "Inspirational" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== DISPLAY RANDOM QUOTE ======
function displayRandomQuote(filtered = quotes) {
  if (filtered.length === 0) return;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${filtered[randomIndex].text}" - ${filtered[randomIndex].category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(filtered[randomIndex]));
}

// ====== ADD QUOTE ======
function addQuote(text, category) {
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote();
  postQuoteToServer(newQuote);
}

// ====== IMPORT / EXPORT JSON ======
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    showNotification("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== CATEGORY FILTERING ======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;
  const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  const lastSelected = localStorage.getItem("lastCategory") || "all";
  categoryFilter.value = lastSelected;
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category);
  if (category === "all") {
    displayRandomQuote();
  } else {
    const filtered = quotes.filter(q => q.category === category);
    displayRandomQuote(filtered);
  }
}

// ====== SERVER SYNC ======
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const serverData = await res.json();
    resolveConflicts(serverData.map(item => ({
      text: item.title || item.body,
      category: item.category || "General"
    })));
  } catch (err) {
    console.error("Failed to fetch server quotes:", err);
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    showNotification("Quote posted to server!");
  } catch (err) {
    console.error("Failed to post quote:", err);
  }
}

function resolveConflicts(serverQuotes) {
  serverQuotes.forEach(sq => {
    if (!quotes.some(q => q.text === sq.text && q.category === sq.category)) {
      quotes.push(sq);
      showNotification(`New quote added from server: "${sq.text}"`);
    }
  });
  saveQuotes();
  populateCategories();
  displayRandomQuote();
}

async function syncQuotes() {
  await fetchQuotesFromServer();
  for (const quote of quotes) {
    await postQuoteToServer(quote);
  }
}

// Periodically sync every 10 seconds
setInterval(syncQuotes, 10000);

// ====== NOTIFICATIONS ======
function showNotification(message) {
  let notif = document.getElementById("notification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notification";
    notif.style.position = "fixed";
    notif.style.bottom = "10px";
    notif.style.right = "10px";
    notif.style.backgroundColor = "#333";
    notif.style.color = "#fff";
    notif.style.padding = "10px";
    notif.style.borderRadius = "5px";
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.style.display = "block";
  setTimeout(() => { notif.style.display = "none"; }, 3000);
}

// ====== EVENT LISTENERS ======
document.getElementById("newQuote").addEventListener("click", () => filterQuotes());
document.getElementById("categoryFilter")?.addEventListener("change", filterQuotes);
document.getElementById("exportBtn")?.addEventListener("click", exportQuotes);
document.getElementById("importFile")?.addEventListener("change", importFromJsonFile);

// ====== INITIALIZATION ======
populateCategories();
displayRandomQuote();
fetchQuotesFromServer();
