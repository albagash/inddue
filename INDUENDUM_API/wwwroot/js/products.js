// Variables for Sidebar Dropdowns
const priceBtn = document.getElementById('price-btn');
const sizeBtn = document.getElementById('size-btn');
const colorBtn = document.getElementById('color-btn');
const seasonBtn = document.getElementById('season-btn');

const priceDropdown = document.getElementById('price-dropdown');
const sizeDropdown = document.getElementById('size-dropdown');
const colorDropdown = document.getElementById('color-dropdown');
const seasonDropdown = document.getElementById('season-dropdown');

// Toggle Dropdowns
priceBtn.addEventListener('click', () => toggleDropdown(priceDropdown));
sizeBtn.addEventListener('click', () => toggleDropdown(sizeDropdown));
colorBtn.addEventListener('click', () => toggleDropdown(colorDropdown));
seasonBtn.addEventListener('click', () => toggleDropdown(seasonDropdown));

// Function to Toggle Dropdown
function toggleDropdown(dropdown) {
    const allDropdowns = [priceDropdown, sizeDropdown, colorDropdown, seasonDropdown];
    allDropdowns.forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('active');
        }
    });
    dropdown.classList.toggle('active');
}
// Initialize Cart
let cart = [];

// Function to Filter Products
function filterProducts() {
    const search = document.getElementById('search-filter')?.value.toLowerCase() || '';
    const price = document.getElementById('price-filter')?.value || '';
    const size = document.getElementById('size-filter')?.value || '';
    const color = document.getElementById('color-filter')?.value || '';
    const season = document.getElementById('season-filter')?.value || '';

    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productPrice = parseInt(product.getAttribute('data-price'), 10);
        const productSize = product.getAttribute('data-size');
        const productColor = product.getAttribute('data-color');
        const productSeason = product.getAttribute('data-season');

        let show = true;

        // Filter by Search
        if (search && !productName.includes(search)) {
            show = false;
        }

        // Filter by Price
        if (price === 'low-to-high') {
            sortProducts('low-to-high');
        } else if (price === 'high-to-low') {
            sortProducts('high-to-low');
        } else if (price === 'popular') {
            sortProducts('popular');
        }

        // Filter by Size
        if (size && size !== productSize) {
            show = false;
        }

        // Filter by Color
        if (color && color !== productColor) {
            show = false;
        }

        // Filter by Season
        if (season && season !== productSeason) {
            show = false;
        }

        // Show or Hide Product
        product.style.display = show ? 'block' : 'none';
    });
}

// Function to Sort Products
function sortProducts(order) {
    const productGrid = document.querySelector('.product-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));

    let sortedProducts;
    if (order === 'low-to-high') {
        sortedProducts = products.sort((a, b) => a.getAttribute('data-price') - b.getAttribute('data-price'));
    } else if (order === 'high-to-low') {
        sortedProducts = products.sort((a, b) => b.getAttribute('data-price') - a.getAttribute('data-price'));
    } else if (order === 'popular') {
        // For simplicity, let's assume "popular" is sorted by the number of stars (in descending order)
        sortedProducts = products.sort((a, b) => {
            const starsA = a.querySelector('p').textContent.length;
            const starsB = b.querySelector('p').textContent.length;
            return starsB - starsA;
        });
    }
    // Clear and Append Sorted Products
    productGrid.innerHTML = '';
    sortedProducts.forEach(product => productGrid.appendChild(product));
}

// Function to Reset Filters
function resetFilters() {
    document.querySelectorAll('.filter-dropdown select').forEach(select => select.value = '');
    filterProducts();
    closeAllDropdowns();
}

// Function to Close All Dropdowns
function closeAllDropdowns() {
    const allDropdowns = [priceDropdown, sizeDropdown, colorDropdown, seasonDropdown];
    allDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
}


// Function to Add Product to Cart
function addToCart(productName, productPrice) {
    const existingProduct = cart.find(product => product.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    alert(`${productName} added to cart!`);
    updateCartCount();
}

// Function to Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, product) => total + product.quantity, 0);
    cartCount.textContent = totalItems;
}

// Function to Display Cart
function displayCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(product => {
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <span>${product.name}</span>
                <span>€${product.price} x ${product.quantity}</span>
                <button onclick="removeFromCart('${product.name}')">Remove</button>
            `;
            cartItems.appendChild(item);
        });
    }

    cartModal.style.display = 'block';
}
// Function to Remove Product from Cart
function removeFromCart(productName) {
    cart = cart.filter(product => product.name !== productName);
    alert(`${productName} removed from cart!`);
    updateCartCount();
    displayCart();
}

// Function to Close Cart Modal
function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'none';
}

// Event Listeners
document.getElementById('reset-filters').addEventListener('click', resetFilters);
document.getElementById('cart-icon').addEventListener('click', displayCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);

document.querySelectorAll('.filter-dropdown select').forEach(select => {
    select.addEventListener('change', filterProducts);
});
