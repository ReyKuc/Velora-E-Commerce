/* public/js/script.js */
console.log("SCRIPT JS YÜKLENDİ");

const messageDiv = document.getElementById("message");


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.querySelector('input[name="role"]:checked').value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role })
            });

            const data = await res.json();

            messageDiv.style.display = "block";

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                window.location.href = data.role === "admin" ? "admin.html" : "index.html";
            } else {
                messageDiv.textContent = data.message;
                messageDiv.className = "message error";
            }
        } catch (err) {
            console.error(err);
            messageDiv.textContent = "Sunucu hatası!";
            messageDiv.className = "message error";
        }
    });
}


const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;
        const role = document.getElementById("selectedRole").value;

        if (password !== password2) {
            messageDiv.style.display = "block";
            messageDiv.textContent = "Şifreler eşleşmiyor!";
            messageDiv.className = "message error";
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();
            messageDiv.style.display = "block";

            if (res.ok) {
                messageDiv.textContent = data.message;
                messageDiv.className = "message success";
                registerForm.reset();
                setTimeout(() => window.location.href = "login.html", 1500);
            } else {
                messageDiv.textContent = data.message;
                messageDiv.className = "message error";
            }
        } catch (err) {
            console.error(err);
            messageDiv.style.display = "block";
            messageDiv.textContent = "Sunucu hatası!";
            messageDiv.className = "message error";
        }
    });
}


function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");

    const cartBtn = document.getElementById("cartBtn");
    const favoriteBtn = document.getElementById("favoriteBtn");
    const adminPanelBtn = document.getElementById("adminPanelBtn");

    if (role === "admin") {
        if (cartBtn) cartBtn.style.display = "none";
        if (favoriteBtn) favoriteBtn.style.display = "none";
        if (adminPanelBtn) adminPanelBtn.style.display = "block";
    }
});
