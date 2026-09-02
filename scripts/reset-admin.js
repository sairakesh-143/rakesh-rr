import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

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

async function resetAdmin() {
  try {
    console.log('🔄 Resetting admin user...');
    
    // Try to create the admin user (this will fail if user exists)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log('✅ Admin user created successfully');
      
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
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Admin user already exists with this email.');
        console.log('⚠️  If you need to reset the password, you\'ll need to do it manually in Firebase Console.');
        console.log('⚠️  Or delete the existing user and run this script again.');
        console.log('');
        console.log('🔍 Attempting to verify existing admin with current credentials...');
        
        try {
          const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          console.log('✅ Existing admin credentials are correct!');
          console.log('📧 Admin Email:', ADMIN_EMAIL);
          console.log('🔑 Admin Password:', ADMIN_PASSWORD);
          console.log('');
          console.log('🎯 Admin can login to the admin portal at: /admin/login');
        } catch (signInError) {
          console.error('❌ Existing admin has different credentials');
          console.error('❌ Error:', signInError.message);
          console.log('');
          console.log('🔧 SOLUTION: You need to either:');
          console.log('1. Delete the existing user from Firebase Console');
          console.log('2. Or reset the password in Firebase Console');
          console.log('3. Or use the correct password for the existing user');
        }
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('❌ Error resetting admin:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the reset
resetAdmin().then(() => {
  console.log('🏁 Admin reset process completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
