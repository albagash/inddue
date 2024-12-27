document.addEventListener("DOMContentLoaded", function () {
    // Hero Button Click Event
    const heroButton = document.querySelector(".hero button");
    if (heroButton) {
        heroButton.addEventListener("click", () => {
            window.location.href = "/products.html"; // Redirect to the Products page
        });
    }

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", function () {
            item.classList.toggle("active");
            const answer = item.querySelector(".faq-answer");
            if (item.classList.contains("active")) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = "0px";
            }
        });
    });

    // Fetch and Display Products
    async function fetchProducts() {
        const container = document.getElementById("products-container");
        if (!container) return; // Check if container exists

        try {
            container.innerHTML = `<p>Loading products...</p>`; // Loading message
            const response = await fetch("/api/products"); // Fetch products from the API
            if (!response.ok) {
                throw new Error("Failed to fetch products.");
            }
            const products = await response.json();
            displayProducts(products); // Call display function
        } catch (error) {
            console.error("Error fetching products:", error);
            container.innerHTML = `<p style="color: red;">Failed to load products. Please try again later.</p>`;
        }
    }

    function displayProducts(products) {
        const container = document.getElementById("products-container");
        if (!container) return;

        container.innerHTML = ""; // Clear container content
        products.forEach((product) => {
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

    // Register Form Submission
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fullName = document.getElementById("register-fullname").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;

            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullName, email, password }),
                });

                if (response.ok) {
                    alert("Registration successful!");
                    window.location.href = "/login.html";
                } else {
                    const errorData = await response.json();
                    alert(`Registration error: ${errorData.message || "Something went wrong."}`);
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("Error connecting to the server.");
            }
        });
    }

    // Call fetchProducts when the page loads
    fetchProducts();

    document.addEventListener("DOMContentLoaded", () => {
        const adminLink = document.querySelector(".admin-link");
        const userRole = localStorage.getItem("role"); // Roli ruhet në localStorage

        if (userRole !== "Admin") {
            adminLink.style.display = "none"; // Fshi butonin nëse nuk është Admin
        }
    });

    function filterCollections() {
        const filterValue = document.getElementById('collection-filter').value;
        const blogCards = document.querySelectorAll('.blog-card');

        blogCards.forEach(card => {
            if (filterValue === 'all' || card.dataset.collection === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

});
