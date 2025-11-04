// 3. In JS, create an array of fruits and loop through it.
const fruits = [
    "Apple", 
    "Banana", 
    "Cherry", 
    "Date", 
    "Elderberry", 
    "Fig", 
    "Grape", 
    "Honeydew", 
    "Imbe", 
    "Jackfruit", 
    "Kiwi" // This makes 11 elements
];

// Get the unordered list element
const fruitList = document.getElementById('fruit-list');

// Loop through the fruits array
for (let i = 0; i < fruits.length; i++) {
    // Create a new <li> element
    const listItem = document.createElement('li');

    // Add the fruit name to the <li> element (Create <li**>Fruit Name</li**>)
    listItem.innerText = fruits[i];

    // Append the new <li> element to the <ul> element
    // Append them to the list using appendChild()
    fruitList.appendChild(listItem);
}