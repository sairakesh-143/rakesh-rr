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

async function testAdminLoginFlow() {
  console.log('🧪 Testing complete admin login flow...');
  console.log('');
  
  try {
    // Step 1: Firebase Authentication
    console.log('🔐 Step 1: Authenticating with Firebase...');
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const user = userCredential.user;
    
    console.log('✅ Firebase authentication successful!');
    console.log('   User ID:', user.uid);
    console.log('   Email:', user.email);
    console.log('');
    
    // Step 2: Check Admin Data in Firestore
    console.log('🔍 Step 2: Checking admin data in Firestore...');
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      console.log('✅ Admin data found in Firestore:');
      console.log('   Name:', adminData.name);
      console.log('   Role:', adminData.role);
      console.log('   Email:', adminData.email);
      console.log('   Active:', adminData.isActive);
      console.log('   Permissions:', adminData.permissions);
      console.log('');
      
      // Step 3: Verify admin can access admin portal
      if (adminData.isActive && adminData.role === 'super_admin') {
        console.log('🎯 Step 3: Admin login flow verification');
        console.log('✅ Admin has proper role and is active');
        console.log('✅ Admin should be able to access admin portal');
        console.log('');
        console.log('🌟 ADMIN LOGIN FLOW TEST PASSED!');
        console.log('');
        console.log('📝 Next steps:');
        console.log('1. Go to: http://localhost:5173/admin/login');
        console.log('2. Enter credentials:');
        console.log('   Email: ' + ADMIN_EMAIL);
        console.log('   Password: ' + ADMIN_PASSWORD);
        console.log('3. Click "Sign in as Admin"');
        console.log('4. Should redirect to: http://localhost:5173/admin');
        console.log('5. Should see admin dashboard');
        
      } else {
        console.log('❌ Admin data exists but user is not active or not super_admin');
        console.log('   Active:', adminData.isActive);
        console.log('   Role:', adminData.role);
      }
      
    } else {
      console.log('❌ Admin data not found in Firestore');
      console.log('   User authenticated but no admin record exists');
    }
    
  } catch (error) {
    console.error('❌ Admin login flow test failed:', error.message);
    console.error('Code:', error.code);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Verify admin user exists in Firebase Auth');
    console.log('2. Verify admin data exists in Firestore admins collection');
    console.log('3. Check Firebase configuration');
    console.log('4. Ensure credentials are correct');
  }
}

testAdminLoginFlow().then(() => {
  console.log('');
  console.log('🏁 Admin login flow test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
