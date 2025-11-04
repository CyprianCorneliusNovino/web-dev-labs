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
    "Kiwi" 
];

const fruitList = document.getElementById('fruit-list');


for (let i = 0; i < fruits.length; i++) {

    const listItem = document.createElement('li');

    listItem.innerText = fruits[i];

    fruitList.appendChild(listItem);
}