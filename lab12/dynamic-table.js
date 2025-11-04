const products = [ 
    { name: "Laptop", quantity: 5, price: 1200.00 },
    { name: "Mouse", quantity: 50, price: 25.50 },
    { name: "Monitor", quantity: 12, price: 350.00 }
];


const tableBody = document.getElementById('product-table-body');


products.forEach(product => {


    const row = document.createElement('tr');


    let nameCell = document.createElement('td');
    nameCell.textContent = product.name;
    row.appendChild(nameCell);


    let quantityCell = document.createElement('td');
    quantityCell.textContent = product.quantity;
    row.appendChild(quantityCell);


    let priceCell = document.createElement('td');

    priceCell.textContent = `$${product.price.toFixed(2)}`; 
    row.appendChild(priceCell);


    tableBody.appendChild(row);
});