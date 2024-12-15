document.addEventListener("DOMContentLoaded", () => {
    const productsGrid = document.getElementById("products-grid");
    const brandFilter = document.getElementById("brand-filter");
    const priceFilter = document.getElementById("price-filter");

    // Produktet (Për shembull)
    const products = [
        { id: 1, name: "Nike T-shirt", brand: "Nike", price: 30, image: "/images/product1.jpg" },
        { id: 2, name: "Adidas Shoes", brand: "Adidas", price: 50, image: "/images/product2.jpg" },
        { id: 3, name: "Puma Jacket", brand: "Puma", price: 70, image: "/images/product3.jpg" },
    ];

    const renderProducts = (filteredProducts) => {
        productsGrid.innerHTML = ""; // Pastro listën ekzistuese
        filteredProducts.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.brand}</p>
                <p>Çmimi: $${product.price}</p>
            `;
            productsGrid.appendChild(productCard);
        });
    };

    renderProducts(products);

    brandFilter.addEventListener("change", () => {
        const selectedBrand = brandFilter.value;
        const filtered = selectedBrand
            ? products.filter((product) => product.brand === selectedBrand)
            : products;
        renderProducts(filtered);
    });

    priceFilter.addEventListener("change", () => {
        const selectedPrice = priceFilter.value;
        let filtered = [...products];

        if (selectedPrice === "low-to-high") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (selectedPrice === "high-to-low") {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderProducts(filtered);
    });
});
