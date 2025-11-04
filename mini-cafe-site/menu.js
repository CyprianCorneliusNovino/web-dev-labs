// 3. Create an array of menu items
const cafeMenu = [
    { name: "The Classic Latte", description: "Rich espresso shot combined with steamed milk and a thin layer of foam. Perfect balance of milk and coffee.", price: 4.50 },
    { name: "House Cold Brew", description: "Steeped for 20 hours, resulting in a smooth, low-acid, and naturally sweet concentrated coffee.", price: 5.00 },
    { name: "Spicy Chai Tea", description: "Warm, complex blend of black tea, cinnamon, cardamom, and clove, served with your choice of milk.", price: 4.00 },
    { name: "Almond Croissant", description: "Flaky, buttery croissant filled with sweet almond paste and topped with toasted slivers. A morning classic.", price: 3.75 },
    { name: "Avocado Toast", description: "Thick-cut sourdough bread topped with freshly smashed avocado, sea salt, pepper, and a sprinkle of chili flakes.", price: 7.50 },
    { name: "Double Espresso", description: "A simple, strong, double shot of our house blend espresso.", price: 3.50 },
    { name: "Blueberry Muffin", description: "Freshly baked muffin loaded with plump, juicy blueberries.", price: 3.00 }
];

// Get the container element using its ID
const menuListContainer = document.getElementById('menu-list');

// 4. Use a loop to dynamically create and Insert HTML for each menu item
cafeMenu.forEach(item => {
    // Dynamically create the div (which acts as a 'card')
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('menu-item'); 

    // Construct the inner HTML, applying existing CSS classes
    // Note: We use item.name for the data-item attribute for the cart script
    itemDiv.innerHTML = `
        <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
        </div>
        <button class="order-btn" data-item="${item.name}" data-price="${item.price.toFixed(2)}">Order Now</button>
    `;

    // Insert the generated HTML into the container
    menuListContainer.appendChild(itemDiv);
});