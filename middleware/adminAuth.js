
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success:false, message:"Token yok" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user || user.role !== "admin") {
            return res.status(403).json({ success:false, message:"Admin yetkisi gerekli" });
        }

        req.user = { id: user._id, role: user.role };
        next();

    } catch (err) {
        return res.status(401).json({ success:false, message:"Token geçersiz" });
    }
};

module.exports = adminAuth;
