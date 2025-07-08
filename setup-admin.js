// Admin Setup Script
// This script adds the admin user to Firestore
// Run this in the browser console while connected to your Firebase project

const adminEmail = "dwarampudisai@gmail.com";
const adminPassword = "rakesh@123";

// Step 1: First, create the admin user in Firebase Authentication
// You can do this through the Firebase Console or run this code

async function setupAdminUser() {
  try {
    // This code should be run in the browser console when connected to your Firebase project
    // or through the Firebase Admin SDK
    
    const adminData = {
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
    };

    // Add to Firestore admins collection
    await db.collection('admins').add(adminData);
    
    console.log('Admin user added successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

// Run the setup
setupAdminUser();
