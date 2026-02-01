// create-test-users.js
// Test kullanıcıları oluşturan script
// Kullanım: node create-test-users.js

require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/velora";

console.log('🔌 MongoDB\'ye bağlanılıyor...\n');

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB bağlandı!\n');
        
        // Mevcut kullanıcıları temizle (isteğe bağlı)
        console.log('🗑️ Mevcut test kullanıcıları siliniyor...');
        await User.deleteMany({ 
            email: { 
                $in: ['test@test.com', 'admin@velora.com'] 
            } 
        });
        console.log('✅ Temizlendi\n');
        
        // Test kullanıcıları
        const testUsers = [
            {
                name: 'testuser',
                email: 'test@test.com',
                password: '123456',
                role: 'user'
            },
            {
                name: 'admin',
                email: 'admin@velora.com',
                password: 'admin123',
                role: 'admin'
            }
        ];
        
        console.log('👥 Test kullanıcıları oluşturuluyor...\n');
        
        for (const userData of testUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            const user = await User.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role
            });
            
            console.log(`✅ ${userData.role.toUpperCase()} oluşturuldu:`);
            console.log(`   Email: ${userData.email}`);
            console.log(`   Password: ${userData.password}`);
            console.log(`   ID: ${user._id}\n`);
        }
        
        console.log('='.repeat(60));
        console.log('🎉 Test kullanıcıları başarıyla oluşturuldu!');
        console.log('='.repeat(60));
        console.log('\n📋 Giriş Bilgileri:\n');
        console.log('👤 USER:');
        console.log('   Email: test@test.com');
        console.log('   Password: 123456\n');
        console.log('👑 ADMIN:');
        console.log('   Email: admin@velora.com');
        console.log('   Password: admin123\n');
        console.log('='.repeat(60));
        
        // Kullanıcıları listele
        const allUsers = await User.find({});
        console.log(`\n📊 Toplam ${allUsers.length} kullanıcı veritabanında:\n`);
        allUsers.forEach(u => {
            console.log(`   ${u.role === 'admin' ? '👑' : '👤'} ${u.name} (${u.email}) - ${u.role}`);
        });
        
        mongoose.connection.close();
        console.log('\n✅ Bağlantı kapatıldı');
        process.exit(0);
        
    })
    .catch(err => {
        console.error('❌ Hata:', err.message);
        process.exit(1);
    });