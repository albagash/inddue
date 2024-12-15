document.addEventListener("DOMContentLoaded", () => {
    console.log("Login & Register script loaded!");

    const BASE_URL = "https://localhost:44358/api/auth";

    // *** Register Form Submission ***
    const registerForm = document.getElementById('register-form');
    const messageBox = document.getElementById('message'); // Kutia e mesazhit për regjistrimin

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fullName = document.getElementById('register-fullname').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const role = document.getElementById('register-role').value;

            // Shfaq mesazhin e procesimit
            if (messageBox) {
                messageBox.style.display = 'block';
                messageBox.className = 'message';
                messageBox.textContent = '⏳ Po procesojmë kërkesën tuaj...';
            }

            try {
                const response = await fetch(`${BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, password, role }),
                });

                if (response.ok) {
                    console.log("✅ Regjistrimi u krye me sukses!");
                    console.log(await response.json()); // Logo përgjigjen e serverit
                    if (messageBox) {
                        messageBox.className = 'message success';
                        messageBox.textContent = '✅ Regjistrimi u krye me sukses! Tani mund të kyçeni.';
                    }
                    setTimeout(() => {
                        window.location.href = '/login.html'; // Ridrejto te login page pas 2 sekondash
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    console.error("❌ Gabim nga serveri:", errorData); // Logo gabimin nga serveri
                    if (messageBox) {
                        messageBox.className = 'message error';
                        messageBox.textContent = `❌ Gabim gjatë regjistrimit: ${errorData.message || 'Diçka shkoi keq.'}`;
                    }
                }

            } catch (error) {
                console.error('Gabim gjatë regjistrimit:', error);
                if (messageBox) {
                    messageBox.className = 'message error';
                    messageBox.textContent = '❌ Gabim gjatë lidhjes me serverin.';
                }
            }
        });
    }
});


    // *** Login Form Submission ***
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();

            console.log("Duke dërguar të dhënat e kyçjes...");

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(`✅ Kyçja u krye me sukses! Mirësevini, ${data.role}.`);

                    // Ruaj tokenin dhe rolin në localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);

                    // Ridrejto te faqja kryesore
                    window.location.href = '/index.html';
                } else {
                    const errorData = await response.json();
                    alert(`❌ Gabim gjatë kyçjes: ${errorData.message || 'Email ose fjalëkalim i pasaktë.'}`);
                }
            } catch (error) {
                console.error('Gabim gjatë kyçjes:', error);
                alert('❌ Gabim gjatë lidhjes me serverin.');
            }
        });
    }

    // *** Kontrollo Rolin dhe Shfaq Seksionet e Duara ***
    const checkUserRole = () => {
        const role = localStorage.getItem('role');
        const adminSection = document.querySelector('.admin-section');
        const companySection = document.querySelector('.company-section');
        const userSection = document.querySelector('.user-section');

        // Fshih të gjitha seksionet fillimisht
        if (adminSection) adminSection.style.display = 'none';
        if (companySection) companySection.style.display = 'none';
        if (userSection) userSection.style.display = 'none';

        // Shfaq seksionin bazuar në rolin
        if (role === 'Admin') {
            if (adminSection) adminSection.style.display = 'block';
            alert("Mirësevini në panelin e administratorit.");
        } else if (role === 'Company') {
            if (companySection) companySection.style.display = 'block';
            alert("Mirësevini në panelin e kompanisë.");
        } else if (role === 'User') {
            if (userSection) userSection.style.display = 'block';
            alert("Mirësevini, përdorues i thjeshtë!");
        } else {
            console.warn("❓ Roli nuk u gjet.");
        }
    };

    // Kontrollo rolin kur faqja kryesore ngarkohet
    if (window.location.pathname === '/index.html') {
        checkUserRole();
    }
});
