document.addEventListener('DOMContentLoaded', () => {
    console.log("Company Panel Loaded");

    // Simulim i të dhënave
    const products = [
        { id: 1, name: "Kostum", price: "50€", stock: 10 },
        { id: 2, name: "Këmishë", price: "30€", stock: 5 },
        { id: 3, name: "Xhaketë", price: "70€", stock: 2 },
    ];

    // Ngarko produktet në tabelë
    const productTable = document.getElementById('product-table');
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td><button>Edit</button> <button>Delete</button></td>
        `;
        productTable.appendChild(row);
    });
});
