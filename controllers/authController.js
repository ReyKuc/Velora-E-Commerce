const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Bu email zaten kayıtlı" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });
        res.status(201).json({ success: true, message: "Kayıt başarılı" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Kayıt hatası" });
    }
};

exports.login = async (req, res) => {
    try {
        const { usernameOrEmail, password, role } = req.body;
        
        // 1. Gelen veriyi temizle (Boşlukları sil ve küçük harfe çevir)
        const identifier = usernameOrEmail ? usernameOrEmail.trim().toLowerCase() : "";

        // 2. Kullanıcıyı bulurken 'i' (case-insensitive) flag'i kullan
        const user = await User.findOne({ 
            $or: [
                { email: { $regex: new RegExp("^" + identifier + "$", "i") } }, 
                { name: { $regex: new RegExp("^" + identifier + "$", "i") } }
            ] 
        });

        console.log(`🔍 Giriş denemesi: ${identifier} | Bulundu: ${user ? "EVET" : "HAYIR"}`);

        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }
        
        // ... (Kodun geri kalanı: Rol ve şifre kontrolü aynı kalsın)

        // 2. Rol kontrolü
        if (user.role !== role) {
            return res.status(403).json({ success: false, message: "Rol yetkiniz yok" });
        }

        // 3. Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Şifre yanlış" });
        }

        // 4. Token oluştur
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "velora_secret_key_2025",
            { expiresIn: "7d" }
        );

        // 5. YANIT GÖNDER (Kritik nokta)
        return res.status(200).json({ 
            success: true, 
            token, 
            role: user.role,
            message: "Giriş başarılı"
        });

    } catch (err) {
        console.error("Login hatası:", err);
        return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
};