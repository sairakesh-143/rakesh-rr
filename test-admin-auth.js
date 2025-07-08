import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

// Test admin credentials
const ADMIN_EMAIL = 'admin.temp.1751968826962@hospital.com';
const ADMIN_PASSWORD = 'rakesh@123';

async function testAdminAuth() {
  try {
    console.log('🔐 Testing admin authentication...');
    
    // Sign in with admin credentials
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const user = userCredential.user;
    
    console.log('✅ Admin authentication successful!');
    console.log('👤 User ID:', user.uid);
    console.log('📧 Email:', user.email);
    
    // Check if admin data exists in Firestore
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      console.log('✅ Admin data found in Firestore:');
      console.log('   Name:', adminData.name);
      console.log('   Role:', adminData.role);
      console.log('   Email:', adminData.email);
      console.log('   Active:', adminData.isActive);
      console.log('   Permissions:', adminData.permissions);
    } else {
      console.log('❌ Admin data not found in Firestore');
    }
    
    console.log('');
    console.log('🎯 Ready to test login at: http://localhost:5173/admin/login');
    console.log('   Email: ' + ADMIN_EMAIL);
    console.log('   Password: ' + ADMIN_PASSWORD);
    
  } catch (error) {
    console.error('❌ Admin authentication failed:', error.message);
    console.error('Code:', error.code);
  }
}

testAdminAuth().then(() => {
  console.log('🏁 Admin authentication test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
