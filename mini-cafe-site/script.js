let currentOrder = [];
const orderList = document.getElementById('order-list');
const orderTotalElement = document.getElementById('order-total');

function updateOrderTotal() {
    let total = 0;
    currentOrder.forEach(item => {
        total += item.price;
    });

    orderTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}


function updateOrderSummaryDOM() {
    orderList.innerHTML = ''; 

    currentOrder.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} ($${item.price.toFixed(2)})`;
        orderList.appendChild(listItem);
    });

    
    updateOrderTotal();
}

function handleOrderClick(event) {
    if (event.target.classList.contains('order-btn')) {
        const itemName = event.target.getAttribute('data-item'); 
        
        
        const priceString = event.target.getAttribute('data-price');
        const itemPrice = parseFloat(priceString); 
        
        alert(`You ordered ${itemName} for $${itemPrice.toFixed(2)}!`);

        currentOrder.push({ name: itemName, price: itemPrice });

        updateOrderSummaryDOM();
    }
}

document.addEventListener('click', handleOrderClick);

document.addEventListener('DOMContentLoaded', updateOrderSummaryDOM);