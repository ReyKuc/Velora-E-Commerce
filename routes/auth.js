const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// TEST: GET http://localhost:3000/api/auth/test
router.get("/test", (req, res) => {
    res.json({ success: true, message: "Auth Route Calisiyor" });
});

// LOGIN: POST http://localhost:3000/api/auth/login
// NOT: Buradaki virgüllere ve fonksiyon isimlerine dikkat edin
router.post("/login", authController.login);

// REGISTER: POST http://localhost:3000/api/auth/register
router.post("/register", authController.register);

module.exports = router;