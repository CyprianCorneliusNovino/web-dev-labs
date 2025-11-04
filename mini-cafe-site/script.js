// Array to store the items currently in the user's order
let currentOrder = [];
const orderList = document.getElementById('order-list');
const orderTotalElement = document.getElementById('order-total');

/**
 * Calculates and updates the total price of all items in the currentOrder.
 */
function updateOrderTotal() {
    let total = 0;
    currentOrder.forEach(item => {
        // Price is stored as a number, so we can sum them directly
        total += item.price;
    });

    // Display the total, formatted to two decimal places
    orderTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}


/**
 * Updates the visual Order Summary area (DOM) in menu.html.
 */
function updateOrderSummaryDOM() {
    // Clear the existing list items
    orderList.innerHTML = ''; 

    // Rebuild the list from the currentOrder array
    currentOrder.forEach(item => {
        const listItem = document.createElement('li');
        // Example: Classic Latte ($4.50)
        listItem.textContent = `${item.name} ($${item.price.toFixed(2)})`;
        orderList.appendChild(listItem);
    });

    // Update the total
    updateOrderTotal();
}

/**
 * Handles the click event for all "Order Now" buttons.
 * @param {Event} event - The click event object.
 */
function handleOrderClick(event) {
    // Check if the clicked element has the 'order-btn' class
    if (event.target.classList.contains('order-btn')) {
        // Get the item name from the data-item attribute
        const itemName = event.target.getAttribute('data-item'); 
        
        // **--- MODIFIED: Get price directly from the button's data attribute ---**
        // The price is stored as a string in the data-price attribute, so parse it to a float
        const priceString = event.target.getAttribute('data-price');
        const itemPrice = parseFloat(priceString); 
        
        // 1. Show the alert
        alert(`You ordered ${itemName} for $${itemPrice.toFixed(2)}!`);

        // Add the new item to the order array
        currentOrder.push({ name: itemName, price: itemPrice });

        // Update the Order Summary on the page
        updateOrderSummaryDOM();
    }
}

// Attach the event listener to the main container for efficiency (event delegation)
document.addEventListener('click', handleOrderClick);

// Initialize the order summary when the page loads
document.addEventListener('DOMContentLoaded', updateOrderSummaryDOM);