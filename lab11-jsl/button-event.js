// Function to handle the click event
function handleButtonClick() {
    alert("Thanks for clicking! (Via External JS)");
}

// Get the button element by its ID
const jsButton = document.getElementById('js-button');

// Add the event listener to the button
jsButton.addEventListener('click', handleButtonClick);