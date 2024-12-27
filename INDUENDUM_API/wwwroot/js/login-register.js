document.addEventListener("DOMContentLoaded", () => {
    console.log("Login & Register script loaded!");

    const BASE_URL = "https://localhost:44358/api/auth";

    // *** Helper Function for Showing Messages ***
    const showMessage = (box, message, type = "info") => {
        if (box) {
            box.style.display = "block";
            box.className = `message ${type}`;
            box.textContent = message;
        }
    };

    // *** Register Form Submission ***
    const registerForm = document.getElementById("register-form");
    const messageBox = document.getElementById("message"); // Message box for registration

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fullName = document.getElementById("register-fullname").value.trim();
            const email = document.getElementById("register-email").value.trim();
            const password = document.getElementById("register-password").value.trim();
            const role = document.getElementById("register-role").value;

            showMessage(messageBox, "⏳ Po procesojmë kërkesën tuaj...", "info");

            try {
                const response = await fetch(`${BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullName, email, password, role }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ Regjistrimi u krye me sukses:", data);

                    showMessage(messageBox, "✅ Regjistrimi u krye me sukses! Tani mund të kyçeni.", "success");
                    setTimeout(() => {
                        window.location.href = "/login.html";
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    console.error("❌ Gabim nga serveri:", errorData);

                    showMessage(messageBox, `❌ Gabim gjatë regjistrimit: ${errorData.message || "Diçka shkoi keq."}`, "error");
                }
            } catch (error) {
                console.error("❌ Gabim gjatë regjistrimit:", error);
                showMessage(messageBox, "❌ Gabim gjatë lidhjes me serverin.", "error");
            }
        });
    }

    // *** Login Form Submission ***
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            console.log("Duke dërguar të dhënat e kyçjes...");

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ Kyçja u krye me sukses:", data);

                    // Ruaj tokenin dhe rolin në localStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", data.role);

                    alert(`✅ Mirësevini, ${data.role}.`);
                    window.location.href = "/index.html";
                } else {
                    const errorData = await response.json();
                    console.error("❌ Gabim gjatë kyçjes:", errorData);

                    alert(`❌ Gabim: ${errorData.message || "Email ose fjalëkalim i pasaktë."}`);
                }
            } catch (error) {
                console.error("❌ Gabim gjatë kyçjes:", error);
                alert("❌ Gabim gjatë lidhjes me serverin.");
            }
        });
    }

    // *** Check User Role and Display Sections ***
    const checkUserRole = () => {
        const role = localStorage.getItem("role");
        const sections = {
            Admin: document.querySelector(".admin-section"),
            Company: document.querySelector(".company-section"),
            User: document.querySelector(".user-section"),
        };

        // Hide all sections initially
        Object.values(sections).forEach((section) => {
            if (section) section.style.display = "none";
        });

        if (sections[role]) {
            sections[role].style.display = "block";
            alert(`Mirësevini në panelin e ${role.toLowerCase()}.`);
        } else {
            console.warn("❓ Roli nuk u gjet ose nuk është specifikuar.");
        }
    };

    // Kontrollo rolin kur faqja kryesore ngarkohet
    if (window.location.pathname === "/index.html") {
        checkUserRole();
    }
});
