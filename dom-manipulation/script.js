// array of quotes
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
    var category = document.getElementById("newQuoteCategory").value;

    if (text === "" || category === "") {
        alert("Please fill both fields!");
        return;
    }

    // add new quote to the array
    quotes.push({ text: text, category: category });

    // clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // show a random quote including the new one
    showRandomQuote();
}

// connect "Show New Quote" button to the function
document.getElementById("newQuote").onclick = showRandomQuote;

// dynamically create the form for adding new quotes
var formDiv = document.createElement("div");

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

// add inputs and button to the form div
formDiv.appendChild(inputText);
formDiv.appendChild(inputCategory);
formDiv.appendChild(addButton);

// append form div to the body
document.body.appendChild(formDiv);

// show a quote when the page loads
showRandomQuote();
