// Function to handle the background change
function changeBackground() {
    // Get the dropdown element
    const selectElement = document.getElementById('color-select');

    // Get the selected value from the dropdown
    // Get the selected value
    const selectedColor = selectElement.value; 

    // Change the background color of the page using document.body.style.backgroundColor
    document.body.style.backgroundColor = selectedColor;
}