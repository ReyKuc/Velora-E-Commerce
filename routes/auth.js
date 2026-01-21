const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 1. Test Rotası (Test panelindeki 1. buton için)
router.get("/test", (req, res) => {
    res.json({ 
        success: true, 
        message: "Auth API route erişilebilir durumda!" 
    });
});

// 2. Kayıt Rotası
router.post("/register", authController.register);

// 3. Giriş Rotası
router.post("/login", authController.login);

module.exports = router;