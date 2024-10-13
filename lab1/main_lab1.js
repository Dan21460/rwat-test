// Daniel Wu C21460524

const col1 = document.querySelector("#col1 div");
const col2 = document.querySelector("#col2 div");
const col3 = document.querySelector("#col3 div");
const col4 = document.querySelector("#col4 div");
const col5 = document.querySelector("#col5 div");
const textInput = document.querySelector("#textInput");

// Store the initial text for resetting when needed
const initialTexts = ["Here", "we", "go", "again", "now"];
const elements = [col1, col2, col3, col4, col5];

// Click event for first colored element (col1)
col1.addEventListener("click", function () {
    const inputValue = textInput.value.trim();
    if (inputValue) {
        // Change text to the value in the input field
        col1.textContent = inputValue;
        // Change background color (random example color)
        col1.classList.replace("bg-primary", "bg-secondary");
    }
});

// Click event for second colored element (col2)
col2.addEventListener("click", function () {
    // Toggle font-weight between normal and bold
    elements.forEach(element => {
        if (element.style.fontWeight === "bold") {
            element.style.fontWeight = "normal";
        } else {
            element.style.fontWeight = "bold";
        }
    });
});

// Keydown event for sorting text based on arrow keys
document.addEventListener("keydown", function (event) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        let sortedTexts;
        switch (event.key) {
            case "ArrowRight":
                // Sort text in alphabetical order
                sortedTexts = [...elements].map(el => el.textContent).sort();
                break;
            case "ArrowLeft":
                // Sort text in reverse alphabetical order
                sortedTexts = [...elements].map(el => el.textContent).sort().reverse();
                break;
            case "ArrowDown":
                // Random shuffle of the text
                sortedTexts = [...elements].map(el => el.textContent);
                sortedTexts = sortedTexts.sort(() => Math.random() - 0.5);
                break;
            case "ArrowUp":
                // Reset to original order
                sortedTexts = [...initialTexts];
                break;
        }

        // Apply the sorted or shuffled text to elements
        elements.forEach((element, index) => {
            element.textContent = sortedTexts[index];
        });
    }
});