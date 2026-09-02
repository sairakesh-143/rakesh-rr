import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
const ADMIN_EMAIL = 'dwarampudisai@gmail.com';
const ADMIN_PASSWORD = 'rakesh@123';

async function createFreshAdmin() {
  try {
    console.log('🔄 Creating fresh admin user...');
    
    // Use a temporary unique email for the new admin
    const tempEmail = 'admin.temp.' + Date.now() + '@hospital.com';
    
    console.log('📧 Creating temporary admin with email:', tempEmail);
    
    // Create the admin user with temporary email
    const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, ADMIN_PASSWORD);
    const user = userCredential.user;
    
    console.log('✅ Admin user created successfully');
    
    // Create admin document in Firestore with the desired email
    const adminData = {
      uid: user.uid,
      email: ADMIN_EMAIL, // Use the desired email in the database
      tempEmail: tempEmail, // Store the actual auth email for reference
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
    console.log('📧 Admin Email for Login:', tempEmail);
    console.log('📧 Admin Email (Display):', ADMIN_EMAIL);
    console.log('🔑 Admin Password:', ADMIN_PASSWORD);
    console.log('👤 Admin Name: Rakesh Dwarampu');
    console.log('🏥 Admin Role: super_admin');
    console.log('✅ Admin Status: Active');
    console.log('');
    console.log('🎯 Admin can now login to the admin portal at: /admin/login');
    console.log('⚠️  IMPORTANT: Use the temporary email and password combination to login!');
    
    // Update the admin authentication files to use the temporary email
    console.log('');
    console.log('📝 You need to update your authentication files to use:');
    console.log('   Email:', tempEmail);
    console.log('   Password:', ADMIN_PASSWORD);
    
  } catch (error) {
    console.error('❌ Error creating fresh admin:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the creation
createFreshAdmin().then(() => {
  console.log('🏁 Fresh admin creation process completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
