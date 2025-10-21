// Function to perform the addition and update the DOM
function addNumbers() {
    // 1. Get input values (as strings)
    const input1 = document.getElementById('num1').value;
    const input2 = document.getElementById('num2').value;
    
    // 2. Convert to numbers and perform calculation
    const number1 = parseFloat(input1);
    const number2 = parseFloat(input2);
    
    // Check if the conversion resulted in valid numbers
    if (isNaN(number1) || isNaN(number2)) {
        document.getElementById('result').innerText = "Invalid Input";
        return;
    }
    
    const sum = number1 + number2;
    
    // 3. Update the result element in the DOM
    document.getElementById('result').innerText = sum;
}

// Add event listener to the "Add" button
document.getElementById('addButton').addEventListener('click', addNumbers);