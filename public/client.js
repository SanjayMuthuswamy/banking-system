async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);

        window.location.href = data.role === "admin" ? "admin_dashboard.html" : "user_dashboard.html";
    } else {
        alert("Login Failed: " + data.error);
    }
}

async function getBalance() {
    const email = localStorage.getItem("email");

    const res = await fetch(`/balance?email=${email}`);
    const data = await res.json();
    if (res.ok) {
        document.getElementById("balance").innerText = `Balance: ₹${data.balance}`;
    } else {
        alert(data.error);
    }
}

async function addUser() {
    const adminEmail = localStorage.getItem("email");
    const email = document.getElementById("newUserEmail").value;
    const password = document.getElementById("newUserPassword").value;

    const res = await fetch("/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail, email, password })
    });

    const data = await res.json();
    alert(data.message);
}

async function deleteUser() {
    const adminEmail = localStorage.getItem("email");
    const email = document.getElementById("deleteUserEmail").value;

    const res = await fetch("/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail, email })
    });

    const data = await res.json();
    alert(data.message);
}

async function deposit() {
    const email = localStorage.getItem("email");
    const amount = parseFloat(document.getElementById("depositAmount").value);

    const res = await fetch("/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount })
    });

    const data = await res.json();
    alert(data.message);
    getBalance();
}

async function withdraw() {
    const email = localStorage.getItem("email");
    const amount = parseFloat(document.getElementById("withdrawAmount").value);

    const res = await fetch("/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount })
    });

    const data = await res.json();
    alert(data.message);
    getBalance();
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
