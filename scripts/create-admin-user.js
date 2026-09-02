import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  const adminEmail = "dwarampudisai@gmail.com";
  const adminPassword = "rakesh@123";

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;

    // Add admin data to Firestore
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

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 User ID:', user.uid);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Run the setup
createAdminUser();
