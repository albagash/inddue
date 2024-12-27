document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = "https://localhost:44358/api";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbmFsYmFAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5hbGJhQGV4YW1wbGUuY29tIiwiRnVsbE5hbWUiOiJBbGJhIEdhc2hpIiwianRpIjoiOGE4NzZiMDMtNzllYS00OTYxLWI0M2YtOWFiMWRlYjA3OWE5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3MzUzMTA2NjksImlzcyI6IkluZHVlbmR1bUFQSSIsImF1ZCI6IkluZHVlbmR1bUFQSVVzZXJzIn0.K0B46saKxiGkjwcWkA7M9E7W8CxE_b79dDc-Ac6Wl58";

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const showMessage = (message, type = "info") => {
        const messageBox = document.querySelector(".message-box");
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = "block";
            setTimeout(() => (messageBox.style.display = "none"), 3000);
        }
    };

    
    const editUser = async (event) => {
        const userId = event.target.getAttribute("data-id"); 
        const newName = prompt("Shkruani emrin e ri të përdoruesit:");
        const newEmail = prompt("Shkruani email-in e ri të përdoruesit:");
        const newRole = prompt("Shkruani rolin e ri të përdoruesit (Admin, Company, User):");

        if (newName && newEmail && newRole) {
            try {
                const response = await fetch(`${BASE_URL}/users/${userId}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        fullName: newName,
                        email: newEmail,
                        role: newRole
                    })
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    showMessage(`✅ Përdoruesi u përditësua me sukses: ${updatedUser.fullName}`, "success");
                    loadUsers();
                } else {
                    const error = await response.json();
                    showMessage(`❌ Gabim gjatë përditësimit: ${error.message}`, "error");
                }
            } catch (error) {
                console.error("Gabim gjatë përditësimit të përdoruesit:", error);
                showMessage("❌ Gabim gjatë lidhjes me serverin.", "error");
            }
        } else {
            showMessage("❌ Të gjitha fushat janë të detyrueshme për përditësim!", "error");
        }
    };

    
    const loadUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users`, { headers });
            if (response.ok) {
                const users = await response.json();
                const usersTable = document.getElementById("users-table-body");
                usersTable.innerHTML = "";

                users.forEach((user) => {
                    const row = `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.fullName}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="edit-user-btn" data-id="${user.id}">✏️</button>
                                <button class="delete-user-btn" data-id="${user.id}">🗑️</button>
                            </td>
                        </tr>
                    `;
                    usersTable.innerHTML += row;
                });

                document.querySelectorAll(".edit-user-btn").forEach((button) => {
                    button.addEventListener("click", editUser);
                });

                document.querySelectorAll(".delete-user-btn").forEach((button) => {
                    button.addEventListener("click", deleteUser);
                });
            } else {
                showMessage("❌ Gabim gjatë ngarkimit të përdoruesve.", "error");
            }
        } catch (error) {
            console.error("Gabim gjatë ngarkimit të përdoruesve:", error);
            showMessage("❌ Gabim gjatë lidhjes me serverin.", "error");
        }
    };

    
    const deleteUser = async (event) => {
        const userId = event.target.getAttribute("data-id");
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                method: "DELETE",
                headers
            });

            if (response.ok) {
                showMessage("✅ Përdoruesi u fshi me sukses!", "success");
                loadUsers();
            } else {
                const error = await response.json();
                showMessage(`❌ Gabim: ${error.message}`, "error");
            }
        } catch (error) {
            console.error("Gabim gjatë fshirjes së përdoruesit:", error);
            showMessage("❌ Gabim gjatë lidhjes me serverin.", "error");
        }
    };

    loadUsers(); 
});




document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = "https://localhost:44358/api"; 
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbmFsYmFAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5hbGJhQGV4YW1wbGUuY29tIiwiRnVsbE5hbWUiOiJBbGJhIEdhc2hpIiwianRpIjoiOGE4NzZiMDMtNzllYS00OTYxLWI0M2YtOWFiMWRlYjA3OWE5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3MzUzMTA2NjksImlzcyI6IkluZHVlbmR1bUFQSSIsImF1ZCI6IkluZHVlbmR1bUFQSVVzZXJzIn0.K0B46saKxiGkjwcWkA7M9E7W8CxE_b79dDc-Ac6Wl58"; // Vendos token-in tënd këtu

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const showMessage = (message, type = "info") => {
        const messageBox = document.querySelector(".message-box");
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = "block";
            setTimeout(() => (messageBox.style.display = "none"), 3000);
        }
    };

    
    const addProductForm = document.getElementById("add-product-form");
    if (addProductForm) {
        addProductForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("product-name").value.trim();
            const description = document.getElementById("product-description").value.trim();
            const price = parseFloat(document.getElementById("product-price").value.trim());
            const category = document.getElementById("product-category").value.trim();
            const imageUrl = document.getElementById("product-image-url").value.trim();

            if (!name || !description || isNaN(price) || !category || !imageUrl) {
                showMessage("Të gjitha fushat janë të detyrueshme!", "error");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/products`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ name, description, price, category, imageUrl })
                });

                if (response.ok) {
                    showMessage("✅ Produkti u shtua me sukses!", "success");
                    addProductForm.reset();
                    loadProducts();
                } else {
                    const error = await response.json();
                    showMessage(`❌ Gabim: ${error.message}`, "error");
                }
            } catch (error) {
                console.error("Gabim gjatë shtimit të produktit:", error);
                showMessage("❌ Gabim gjatë lidhjes me serverin.", "error");
            }
        });
    }

    
    const loadProducts = async () => {
        const productsTableBody = document.getElementById("products-table-body");
        if (!productsTableBody) return;

        productsTableBody.innerHTML = `<tr><td colspan="6">Duke ngarkuar...</td></tr>`;

        try {
            const response = await fetch(`${BASE_URL}/products`, { headers });
            console.log("Response status:", response.status); 

            if (response.ok) {
                const products = await response.json();
                console.log("Loaded products:", products); 
                productsTableBody.innerHTML = "";

                products.forEach((product) => {
                    const row = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.price}</td>
                        <td>${product.category}</td>
                        <td>
                            <button class="edit-product-btn" data-id="${product.id}">✏️</button>
                            <button class="delete-product-btn" data-id="${product.id}">🗑️</button>
                        </td>
                    </tr>
                `;
                    productsTableBody.innerHTML += row;
                });

                document.querySelectorAll(".edit-product-btn").forEach((button) => {
                    button.addEventListener("click", editProduct);
                });

                document.querySelectorAll(".delete-product-btn").forEach((button) => {
                    button.addEventListener("click", deleteProduct);
                });
            } else {
                const errorText = await response.text();
                console.log("Failed to load products. Error:", errorText);
                showMessage("❌ Gabim gjatë ngarkimit të produkteve.", "error");
            }
        } catch (error) {
            console.error("Gabim gjatë ngarkimit të produkteve:", error);
            showMessage("❌ Gabim gjatë lidhjes me serverin.", "error");
        }
    };



   
    const editProduct = async (event) => {
        const productId = event.target.getAttribute("data-id");
        const newName = prompt("Shkruani emrin e ri të produktit:");
        const newDescription = prompt("Shkruani përshkrimin e ri të produktit:");
        const newPrice = prompt("Shkruani çmimin e ri të produktit:");
        const newCategory = prompt("Shkruani kategorinë e re të produktit:");
        const newImageUrl = prompt("Shkruani URL-në e re të imazhit:");

        if (newName && newDescription && newPrice && newCategory && newImageUrl) {
            try {
                const response = await fetch(`${BASE_URL}/products/${productId}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        name: newName,
                        description: newDescription,
                        price: parseFloat(newPrice),
                        category: newCategory,
                        imageUrl: newImageUrl
                    })
                });

                if (response.ok) {
                    showMessage("✅ Produkti u përditësua me sukses!", "success");
                    loadProducts();
                } else {
                    const error = await response.json();
                    showMessage(`❌ Gabim gjatë përditësimit: ${error.message}`, "error");
                }
            } catch (error) {
                console.error("Gabim gjatë përditësimit të produktit:", error);
                showMessage("❌ Gabim gjatë lidhjes me serverin.", "error");
            }
        } else {
            showMessage("❌ Të gjitha fushat janë të detyrueshme për përditësim!", "error");
        }
    };

    
    const deleteProduct = async (event) => {
        const productId = event.target.getAttribute("data-id");
        try {
            const response = await fetch(`${BASE_URL}/products/${productId}`, {
                method: "DELETE",
                headers
            });

            if (response.ok) {
                showMessage("✅ Produkti u fshi me sukses!", "success");
                loadProducts();
            } else {
                const error = await response.json();
                showMessage(`❌ Gabim gjatë fshirjes: ${error.message}`, "error");
            }
        } catch (error) {
            console.error("Gabim gjatë fshirjes së produktit:", error);
            showMessage("❌ Gabim gjatë lidhjes me serverin.", "error");
        }
    };

    
    loadProducts();
});
