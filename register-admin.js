import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6FrNuqeBrfrwhZnulwDp4lC3lgt6hzck",
  authDomain: "hospital-149b6.firebaseapp.com",
  projectId: "hospital-149b6",
  storageBucket: "hospital-149b6.firebasestorage.app",
  messagingSenderId: "822650817761",
  appId: "1:822650817761:web:adc3079d5e1e249d033ba0",
  measurementId: "G-BN0WEFRPZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin credentials
const ADMIN_EMAIL = 'admin.temp.1751968826962@hospital.com';
const ADMIN_PASSWORD = 'rakesh@123';

async function registerAdmin() {
  try {
    console.log('🔐 Registering admin user...');
    
    let userCredential;
    
    try {
      // Try to create new user
      userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log('✅ Admin user created successfully');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('👤 Admin user already exists, signing in...');
        userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Admin user signed in successfully');
      } else {
        throw error;
      }
    }
    
    const user = userCredential.user;
    
    // Create admin document in Firestore
    const adminData = {
      uid: user.uid,
      email: ADMIN_EMAIL,
      name: 'Rakesh Dwarampu',
      role: 'super_admin',
      isActive: true,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      permissions: [
        'manage_doctors',
        'manage_patients', 
        'manage_appointments',
        'view_reports',
        'manage_notifications',
        'manage_settings',
        'full_access'
      ]
    };
    
    await setDoc(doc(db, 'admins', user.uid), adminData);
    
    console.log('✅ Admin registered successfully in Firestore');
    console.log('📧 Admin Email:', ADMIN_EMAIL);
    console.log('🔑 Admin Password:', ADMIN_PASSWORD);
    console.log('👤 Admin Name: Rakesh Dwarampu');
    console.log('🏥 Admin Role: super_admin');
    console.log('✅ Admin Status: Active');
    console.log('');
    console.log('🎯 Admin can now login to the admin portal at: /admin/login');
    console.log('⚠️  IMPORTANT: Only this exact email and password combination will work!');
    
  } catch (error) {
    console.error('❌ Error registering admin:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the registration
registerAdmin().then(() => {
  console.log('🏁 Admin registration process completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
