// Event Listener për Hero Button
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".hero button");
    if (button) {
        button.addEventListener("click", () => {
            alert("Shop the best deals now!");
        });
    }
});

// Event Listener për FAQ (Frequently Asked Questions)
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = "0px";
            }
        });
    });
});

// Funksioni për të marrë produktet nga API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products.');
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Funksioni për të shfaqur produktet në frontend
function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';
    products.forEach(product => {
        const productElement = `
            <div class="product-card">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Price:</strong> $${product.price}</p>
            </div>
        `;
        container.innerHTML += productElement;
    });
}

// Event Listener për formularin e shtimit të produktit
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fullName = document.getElementById('register-fullname').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, password }),
                });

                if (response.ok) {
                    alert('Regjistrimi u krye me sukses!');
                    window.location.href = '/login.html';
                } else {
                    const errorData = await response.json();
                    alert(`Gabim gjatë regjistrimit: ${errorData.message || 'Diçka shkoi keq.'}`);
                }
            } catch (error) {
                console.error('Gabim gjatë regjistrimit:', error);
                alert('Gabim gjatë lidhjes me serverin.');
            }
        });
    }
});


// Thirrja e funksionit kur faqja ngarkohet
document.addEventListener('DOMContentLoaded', fetchProducts);
document.addEventListener("DOMContentLoaded", function () {
    // Merr produktet nga API
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products'); // Ndrysho këtë URL nëse është ndryshe
            if (!response.ok) {
                throw new Error('Failed to fetch products.');
            }
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Shfaq produktet në frontend
    function displayProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = '';
        products.forEach(product => {
            const productElement = `
                <div class="product-card">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                </div>
            `;
            container.innerHTML += productElement;
        });
    }

    // Thirr funksionin kur faqja ngarkohet
    fetchProducts();
});




