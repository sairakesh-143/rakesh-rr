// Run this script in your browser's developer console while on your hospital website
// Make sure you're connected to your Firebase project

async function createAdminUser() {
    console.log('🏥 Creating admin user for Hospital Website...');
    
    const adminEmail = "dwarampudirakesh@gmail.com";
    const adminPassword = "rakesh@1234";
    
    try {
        // Import Firebase functions (assuming they're available globally)
        const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = window.firebaseAuth;
        const { doc, setDoc } = window.firebaseFirestore;
        const auth = window.auth;
        const db = window.db;
        
        let userCredential;
        
        try {
            // Try to create new user
            userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
            console.log('✅ New admin user created in Authentication');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                // User already exists, sign them in to get the UID
                console.log('ℹ️ User already exists, signing in to get UID...');
                userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
            } else {
                throw error;
            }
        }
        
        const user = userCredential.user;
        
        // Add admin permissions to Firestore
        await setDoc(doc(db, 'admins', user.uid), {
            email: adminEmail,
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLoginAt: null,
            permissions: {
                manageDoctors: true,
                manageAppointments: true,
                managePatients: true,
                viewReports: true,
                manageSettings: true
            }
        });
        
        console.log('✅ Admin permissions added to Firestore');
        console.log('👤 Admin User Details:');
        console.log('  📧 Email:', adminEmail);
        console.log('  🔑 Password:', adminPassword);
        console.log('  🆔 User ID:', user.uid);
        console.log('  🌐 Admin Portal: http://localhost:8082/admin/login');
        console.log('');
        console.log('🎉 Admin setup complete! You can now access the admin portal.');
        
        return {
            success: true,
            email: adminEmail,
            uid: user.uid
        };
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        console.log('');
        console.log('💡 Troubleshooting:');
        console.log('  1. Make sure you\'re on the hospital website');
        console.log('  2. Check that Firebase is properly configured');
        console.log('  3. Verify your internet connection');
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the admin setup
console.log('🚀 Starting admin user setup...');
console.log('📧 Admin Email: dwarampudirakesh@gmail.com');
console.log('🔑 Admin Password: rakesh@1234');
console.log('');

createAdminUser().then(result => {
    if (result.success) {
        console.log('');
        console.log('🎯 Next Steps:');
        console.log('  1. Go to: http://localhost:8082/admin/login');
        console.log('  2. Login with: dwarampudirakesh@gmail.com / rakesh@1234');
        console.log('  3. Start managing your hospital system!');
    }
});
