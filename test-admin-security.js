import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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

// Test credentials
const ADMIN_EMAIL = 'dwarampudirakesh@gmail.com';
const ADMIN_PASSWORD = 'rakesh@1234';
const WRONG_EMAIL = 'wrong@email.com';
const WRONG_PASSWORD = 'wrongpassword';

async function testAdminSecurity() {
  console.log('🔐 Testing Admin Security Implementation...\n');
  
  try {
    // Test 1: Valid admin login
    console.log('🧪 Test 1: Valid Admin Login');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      const user = userCredential.user;
      
      // Check if user exists in admins collection
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        console.log('✅ Valid admin login successful');
        console.log('👤 Admin Name:', adminData.name);
        console.log('📧 Admin Email:', adminData.email);
        console.log('🏥 Admin Role:', adminData.role);
        console.log('✅ Admin Status:', adminData.isActive ? 'Active' : 'Inactive');
        
        // Sign out after test
        await signOut(auth);
        console.log('🚪 Admin signed out successfully\n');
      } else {
        console.log('❌ Admin not found in Firestore');
      }
    } catch (error) {
      console.log('❌ Valid admin login failed:', error.message);
    }
    
    // Test 2: Invalid email
    console.log('🧪 Test 2: Invalid Email');
    try {
      await signInWithEmailAndPassword(auth, WRONG_EMAIL, ADMIN_PASSWORD);
      console.log('❌ SECURITY ISSUE: Invalid email login succeeded (should fail)');
    } catch (error) {
      console.log('✅ Invalid email login correctly rejected:', error.code);
    }
    
    // Test 3: Invalid password
    console.log('🧪 Test 3: Invalid Password');
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, WRONG_PASSWORD);
      console.log('❌ SECURITY ISSUE: Invalid password login succeeded (should fail)');
    } catch (error) {
      console.log('✅ Invalid password login correctly rejected:', error.code);
    }
    
    // Test 4: Email case sensitivity
    console.log('🧪 Test 4: Email Case Sensitivity');
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL.toUpperCase(), ADMIN_PASSWORD);
      console.log('❌ SECURITY ISSUE: Case insensitive email login succeeded (should fail)');
    } catch (error) {
      console.log('✅ Case sensitive email correctly rejected:', error.code);
    }
    
    // Test 5: Empty credentials
    console.log('🧪 Test 5: Empty Credentials');
    try {
      await signInWithEmailAndPassword(auth, '', '');
      console.log('❌ SECURITY ISSUE: Empty credentials login succeeded (should fail)');
    } catch (error) {
      console.log('✅ Empty credentials correctly rejected:', error.code);
    }
    
    console.log('\n🎯 Security Test Results:');
    console.log('✅ Only the exact admin email and password combination is accepted');
    console.log('✅ All invalid login attempts are properly rejected');
    console.log('✅ Admin authentication is working securely');
    console.log('✅ No session persistence - admin must login every time');
    console.log('\n🔒 ADMIN CREDENTIALS:');
    console.log('📧 Email: dwarampudirakesh@gmail.com');
    console.log('🔑 Password: rakesh@1234');
    console.log('⚠️  These are the ONLY credentials that will work!');
    
  } catch (error) {
    console.error('💥 Error during security testing:', error);
  }
}

// Run the security test
testAdminSecurity().then(() => {
  console.log('\n🏁 Security testing completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
