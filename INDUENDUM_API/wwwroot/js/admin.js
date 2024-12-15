document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Panel Loaded");

    // Simulim i të dhënave
    const users = [
        { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin" },
        { id: 2, name: "Company User", email: "company@example.com", role: "Company" },
        { id: 3, name: "Simple User", email: "user@example.com", role: "User" },
    ];

    // Ngarko të dhënat në tabelë
    const userTable = document.getElementById('user-table');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><button>Edit</button> <button>Delete</button></td>
        `;
        userTable.appendChild(row);
    });
});
