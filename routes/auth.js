//routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/test", (req, res) => {
    res.json({ success: true, message: "Auth Route Calisiyor" });
});

router.post("/login", authController.login);


router.post("/register", authController.register);

module.exports = router;