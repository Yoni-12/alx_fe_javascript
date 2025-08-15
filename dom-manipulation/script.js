// --- QUOTES ARRAY ---
var quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" }
];

// --- LOCAL STORAGE FUNCTIONS ---
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// --- SESSION STORAGE FUNCTIONS (optional) ---
function saveLastQuote(index) {
  sessionStorage.setItem("lastQuoteIndex", index);
}

function loadLastQuote() {
  const lastIndex = sessionStorage.getItem("lastQuoteIndex");
  return lastIndex !== null ? parseInt(lastIndex) : null;
}

// --- SHOW RANDOM QUOTE ---
function showRandomQuote() {
  var randomIndex = Math.floor(Math.random() * quotes.length);
  var q = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML =
    "<p>\"" + q.text + "\"</p><p><i>— " + q.category + "</i></p>";
  saveLastQuote(randomIndex);
}

// --- ADD NEW QUOTE ---
function addQuote() {
  var text = document.getElementById("newQuoteText").value;
  var category = document.getElementById("newQuoteCategory").value;

  if (text === "" || category === "") {
    alert("Please fill both fields!");
    return;
  }

  quotes.push({ text: text, category: category });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  saveQuotes();      // save to local storage
  showRandomQuote(); // update display
}

// --- CREATE ADD QUOTE FORM ---
function createAddQuoteForm() {
  var formDiv = document.getElementById("formContainer");

  var inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  var inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  var addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addButton);
}

// --- JSON IMPORT ---
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- JSON EXPORT ---
document.getElementById("exportBtn").onclick = function() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
};

// --- EVENT LISTENER FOR "SHOW NEW QUOTE" BUTTON ---
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// --- INITIALIZATION ---
loadQuotes();         // load from local storage
createAddQuoteForm();  // create form dynamically
showRandomQuote();     // display a quote on page load
