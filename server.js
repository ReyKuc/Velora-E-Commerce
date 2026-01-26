// server.js - DEBUG VERSION
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

console.log('\n🚀 VELORA Server Başlatılıyor...\n');

// ========================================
// MIDDLEWARE - SIRALAMA ÇOK ÖNEMLİ!
// ========================================

// 1. JSON Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. CORS (gerekirse)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// 3. Request Logging - HER İSTEĞİ LOGLA
app.use((req, res, next) => {
    console.log('\n' + '='.repeat(60));
    console.log(`📨 ${req.method} ${req.path}`);
    console.log(`⏰ ${new Date().toLocaleTimeString()}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    }
    
    if (req.headers.authorization) {
        console.log('🔑 Auth Header:', req.headers.authorization.substring(0, 30) + '...');
    }
    
    console.log('='.repeat(60));
    next();
});

// ========================================
// API ROTALARI - ÖNCE BUNLAR!
// ========================================

console.log('📁 Rotalar yükleniyor...\n');

// Auth rotalarını yükle
try {
    const authRoutes = require("./routes/auth");
    app.use("/api/auth", authRoutes);
    console.log('✅ /api/auth yüklendi');
} catch (err) {
    console.error('❌ /api/auth YÜKLENEMEDI:', err.message);
    process.exit(1);
}

// Cart rotalarını yükle
try {
    const cartRoutes = require("./routes/cart");
    app.use("/api/cart", cartRoutes);
    console.log('✅ /api/cart yüklendi');
} catch (err) {
    console.error('❌ /api/cart YÜKLENEMEDI:', err.message);
}

// Favorite rotalarını yükle
try {
    const favoriteRoutes = require("./routes/favorite");
    app.use("/api/favorite", favoriteRoutes);
    console.log('✅ /api/favorite yüklendi');
} catch (err) {
    console.error('❌ /api/favorite YÜKLENEMEDI:', err.message);
}

// Products rotalarını yükle
try {
    const productRoutes = require("./routes/products");
    app.use("/api/products", productRoutes);
    console.log('✅ /api/products yüklendi');
} catch (err) {
    console.error('❌ /api/products YÜKLENEMEDI:', err.message);
}

// Admin rotalarını yükle
try {
    const adminRoutes = require("./routes/admin");
    app.use("/api/admin", adminRoutes);
    console.log('✅ /api/admin yüklendi');
} catch (err) {
    console.error('❌ /api/admin YÜKLENEMEDI:', err.message);
}

console.log('\n📊 API Endpoints hazır:\n');
console.log('   POST /api/auth/register');
console.log('   POST /api/auth/login');
console.log('   GET  /api/auth/test');
console.log('   GET  /api/products');
console.log('   POST /api/cart/add');
console.log('   GET  /api/cart');
console.log('   POST /api/favorite/add');
console.log('   GET  /api/favorite');
console.log('   GET  /api/admin/products');

// ========================================
// STATIC FILES - API'den SONRA!
// ========================================
app.use(express.static(path.join(__dirname, "public")));
console.log('\n✅ Static files ayarlandı (public klasörü)\n');

// ========================================
// HTML SAYFALAR - Fallback Routes
// ========================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});
app.get("/stockupdate.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "stockupdate.html"));
});
app.get("/test-api.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "test-api.html"));
});

// ========================================
// ERROR HANDLERS
// ========================================
// server.js içinde 404 handler'ın hemen üstüne ekle

// 404 Handler
app.use((req, res) => {
    console.log('\n❌ 404 - Rota bulunamadı:', req.path);
    res.status(404).json({ 
        success: false, 
        message: "Endpoint bulunamadı",
        path: req.path,
        method: req.method,
        availableRoutes: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/test',
            'GET /api/products',
            'POST /api/cart/add',
            'GET /api/cart',
            'POST /api/favorite/add',
            'GET /api/favorite'
        ]
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('\n💥 SUNUCU HATASI:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Sunucu hatası",
        error: err.message
    });
});

// ========================================
// MONGODB BAĞLANTISI
// ========================================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/velora";

console.log('🔌 MongoDB\'ye bağlanılıyor...');
console.log('📍 URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('\n✅ MongoDB BAŞARIYLA bağlandı!');
        console.log('📦 Veritabanı: velora');
        console.log('🔗 Bağlantı durumu:', mongoose.connection.readyState);
    })
    .catch(err => {
        console.error('\n❌ MongoDB bağlantı HATASI:', err.message);
        console.error('💡 MongoDB\'nin çalıştığından emin olun!');
        process.exit(1);
    });

// ========================================
// SUNUCUYU BAŞLAT
// ========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🎉 VELORA SUNUCUSU ÇALIŞIYOR!');
    console.log('='.repeat(60));
    console.log(`🌐 Ana Sayfa: http://localhost:${PORT}`);
    console.log(`🧪 Test Panel: http://localhost:${PORT}/test-api.html`);
    console.log(`🔐 Login: http://localhost:${PORT}/login.html`);
    console.log(`📝 API Base: http://localhost:${PORT}/api`);
    console.log('='.repeat(60));
    console.log('\n💡 İpucu: Her istek için detaylı log göreceksiniz\n');
});