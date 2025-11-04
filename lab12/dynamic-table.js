// Product data (array of objects for name, quantity, and price)
const products = [
    { name: "Laptop", quantity: 5, price: 1200.00 },
    { name: "Mouse", quantity: 50, price: 25.50 },
    { name: "Monitor", quantity: 12, price: 350.00 }
];

// Get the tbody element
const tableBody = document.getElementById('product-table-body');

// 2. In JS, use a loop to create 3 <tr> rows inside <table><tbody>...</tbody></table>
// 3. Each row should contain name, quantity, and price.
products.forEach(product => {
    // Create a new table row element (<tr>)
    const row = document.createElement('tr');

    // Create and append the Name cell (<td>)
    let nameCell = document.createElement('td');
    nameCell.textContent = product.name;
    row.appendChild(nameCell);

    // Create and append the Quantity cell (<td>)
    let quantityCell = document.createElement('td');
    quantityCell.textContent = product.quantity;
    row.appendChild(quantityCell);

    // Create and append the Price cell (<td>)
    let priceCell = document.createElement('td');
    // Format the price for display
    priceCell.textContent = `$${product.price.toFixed(2)}`; 
    row.appendChild(priceCell);

    // Append the newly created row to the table body
    tableBody.appendChild(row);
});