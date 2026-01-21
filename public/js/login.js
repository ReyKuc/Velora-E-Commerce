if (data.success) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "index.html";
    }
}
