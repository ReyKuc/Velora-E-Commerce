// check-structure.js
// Proje yapısını kontrol eden script
// Kullanım: node check-structure.js

const fs = require('fs');
const path = require('path');

console.log('🔍 VELORA Proje Yapısı Kontrolü\n');

const requiredFiles = [
    'server.js',
    'package.json',
    '.env',
    'controllers/authController.js',
    'middleware/auth.js',
    'middleware/adminAuth.js',
    'models/User.js',
    'models/Product.js',
    'models/Cart.js',
    'models/Favorite.js',
    'routes/auth.js',
    'routes/admin.js',
    'routes/cart.js',
    'routes/favorite.js',
    'routes/products.js',
    'public/index.html',
    'public/login.html',
    'public/register.html',
    'public/admin.html',
    'public/products.html',
    'public/cart.html',
    'public/favorites.html',
    'public/css/style.css',
    'public/js/script.js'
];

let allOk = true;

requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${file}`);
    if (!exists) allOk = false;
});

console.log('\n' + '='.repeat(50));

if (allOk) {
    console.log('✅ Tüm dosyalar mevcut!');
    console.log('\n📋 Sonraki adımlar:');
    console.log('1. npm install');
    console.log('2. MongoDB\'nin çalıştığından emin olun');
    console.log('3. npm start');
    console.log('4. http://localhost:3000/test-api.html adresini açın');
} else {
    console.log('❌ Bazı dosyalar eksik!');
    console.log('Eksik dosyaları oluşturun ve tekrar deneyin.');
}

// Package.json kontrolü
try {
    const pkg = require('./package.json');
    console.log('\n📦 Dependencies:');
    
    const required = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'dotenv', 'body-parser'];
    required.forEach(dep => {
        const exists = pkg.dependencies && pkg.dependencies[dep];
        console.log(`${exists ? '✅' : '❌'} ${dep}`);
    });
} catch (err) {
    console.log('\n❌ package.json okunamadı!');
}

// .env kontrolü
try {
    require('dotenv').config();
    console.log('\n🔐 Environment Variables:');
    console.log(`${process.env.PORT ? '✅' : '❌'} PORT = ${process.env.PORT || 'YOK'}`);
    console.log(`${process.env.MONGODB_URI ? '✅' : '❌'} MONGODB_URI = ${process.env.MONGODB_URI ? 'SET' : 'YOK'}`);
    console.log(`${process.env.JWT_SECRET ? '✅' : '❌'} JWT_SECRET = ${process.env.JWT_SECRET ? 'SET' : 'YOK'}`);
} catch (err) {
    console.log('\n❌ .env dosyası okunamadı!');
    console.log('💡 .env dosyası oluşturun ve gerekli değişkenleri ekleyin');
}