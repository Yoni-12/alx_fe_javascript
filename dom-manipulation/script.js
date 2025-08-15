// script.js

// our quotes array
var quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" }
];

// function to show a random quote
function showRandomQuote() {
  var randomIndex = Math.floor(Math.random() * quotes.length);
  var q = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML =
    "<p>\"" + q.text + "\"</p><p><i>— " + q.category + "</i></p>";
}

// function to add a new quote
function addQuote() {
  var text = document.getElementById("newQuoteText").value;
  var cat = document.getElementById("newQuoteCategory").value;

  if (text === "" || cat === "") {
    alert("Please fill both fields!");
    return;
  }

  quotes.push({ text: text, category: cat });

  // clear fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added!");
}

// attach event to button
document.getElementById("newQuote").onclick = showRandomQuote;

// dynamically create form for adding quotes
var formDiv = document.createElement("div");

var inputText = document.createElement("input");
inputText.id = "newQuoteText";
inputText.type = "text";
inputText.placeholder = "Enter a new quote";

var inputCat = document.createElement("input");
inputCat.id = "newQuoteCategory";
inputCat.type = "text";
inputCat.placeholder = "Enter quote category";

var addBtn = document.createElement("button");
addBtn.textContent = "Add Quote";
addBtn.onclick = addQuote;

// append inputs and button to formDiv
formDiv.appendChild(inputText);
formDiv.appendChild(inputCat);
formDiv.appendChild(addBtn);

// finally, add formDiv to the body
document.body.appendChild(formDiv);

// show a quote on first load
showRandomQuote();
