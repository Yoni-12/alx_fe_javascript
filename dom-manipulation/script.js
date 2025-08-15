// Array of quotes
var quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" }
];

// Function to show a random quote
function showRandomQuote() {
  var randomIndex = Math.floor(Math.random() * quotes.length);
  var q = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML =
    "<p>\"" + q.text + "\"</p><p><i>— " + q.category + "</i></p>";
}

// Function to add a new quote
function addQuote() {
  var text = document.getElementById("newQuoteText").value;
  var category = document.getElementById("newQuoteCategory").value;

  if (text === "" || category === "") {
    alert("Please fill both fields!");
    return;
  }

  quotes.push({ text: text, category: category });

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
}

// Function to create the add quote form dynamically
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

// Event listener for Show New Quote button
document.getElementById("newQuote").onclick = showRandomQuote;

// Call createAddQuoteForm to build the form on page load
createAddQuoteForm();

// Show a random quote on page load
showRandomQuote();
