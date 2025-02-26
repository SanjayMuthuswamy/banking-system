const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 5000;

// Admin credentials
const admin = { email: "admin@bank.com", password: "admin123" };

// User database (In-memory storage for simplicity)
let users = [{ email: "sanja1.6y@gmail.com", password: "1" }];
let accounts = { "sanja1.6y@gmail.com": 1000 };

// Login API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === admin.email && password === admin.password) {
        return res.json({ role: "admin", email });
    }

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ role: "user", email });
});

// Admin: Add User
app.post("/admin/add-user", (req, res) => {
    const { adminEmail, email, password } = req.body;
    if (adminEmail !== admin.email) return res.status(403).json({ error: "Unauthorized" });

    if (users.some(user => user.email === email)) {
        return res.status(400).json({ error: "User already exists" });
    }

    users.push({ email, password });
    accounts[email] = 1000;
    res.json({ message: "User added successfully" });
});

// Admin: Delete User
app.post("/admin/delete-user", (req, res) => {
    const { adminEmail, email } = req.body;
    if (adminEmail !== admin.email) return res.status(403).json({ error: "Unauthorized" });

    if (!accounts[email]) {
        return res.status(400).json({ error: "User does not exist" });
    }

    users = users.filter(user => user.email !== email);
    delete accounts[email];

    res.json({ message: "User deleted successfully" });
});

// Admin & User: Check Balance
app.get("/balance", (req, res) => {
    const { email } = req.query;
    if (!email || !accounts[email]) {
        return res.status(400).json({ error: "User not found" });
    }
    res.json({ balance: accounts[email] });
});

// User: Deposit
app.post("/deposit", (req, res) => {
    const { email, amount } = req.body;
    if (!accounts[email]) return res.status(400).json({ error: "User not found" });
    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    accounts[email] += amount;
    res.json({ message: "Deposit successful", balance: accounts[email] });
});

// User: Withdraw
app.post("/withdraw", (req, res) => {
    const { email, amount } = req.body;
    if (!accounts[email]) return res.status(400).json({ error: "User not found" });
    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });
    if (accounts[email] < amount) return res.status(400).json({ error: "Insufficient funds" });

    accounts[email] -= amount;
    res.json({ message: "Withdrawal successful", balance: accounts[email] });
});

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
