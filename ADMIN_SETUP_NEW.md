# 🏥 Hospital Admin Setup - UPDATED

## 👤 Admin User Credentials
- **Email:** dwarampudisai@gmail.com
- **Password:** rakesh@123
- **Role:** Super Administrator
- **Access Level:** Full permissions

## 🚀 Quick Setup Methods

### Method 1: Automated Setup (Recommended)
1. Open the file `admin-setup.html` in your web browser
2. Update the Firebase configuration section with your project details
3. Click the "Create Admin User" button
4. The script will automatically:
   - Create the user in Firebase Authentication
   - Add admin permissions to Firestore
   - Provide confirmation of successful setup

### Method 2: Manual Firebase Console Setup

#### Step A: Create Authentication User
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"**
5. Enter:
   - **Email:** `dwarampudisai@gmail.com`
   - **Password:** `rakesh@123`
6. Click **"Add User"** and note the generated User ID

#### Step B: Add Admin Permissions
1. Navigate to **Firestore Database**
2. Create collection: `admins` (if not exists)
3. Add document with the User ID from Step A:

```json
{
  "email": "dwarampudisai@gmail.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2025-07-08T00:00:00.000Z",
  "lastLoginAt": null,
  "permissions": {
    "manageDoctors": true,
    "manageAppointments": true,
    "managePatients": true,
    "viewReports": true,
    "manageSettings": true
  }
}
```

## 🔐 Admin Portal Access

Once setup is complete:
- **Admin Login URL:** `http://localhost:8082/admin/login`
- **Email:** dwarampudisai@gmail.com
- **Password:** rakesh@123

## 🛡️ Security Features

### Access Control
- ✅ Only users in `admins` collection can access admin portal
- ✅ Separate authentication system from regular users
- ✅ Role-based permission system
- ✅ Secure route protection with Firebase Auth

### Admin Capabilities
- ✅ **Doctor Management:** Add, edit, activate/deactivate doctors
- ✅ **Appointment Management:** View, confirm, cancel appointments
- ✅ **Patient Management:** View patient records and information
- ✅ **Reports & Analytics:** Access to system reports
- ✅ **System Settings:** Configure application settings

## 🔧 Troubleshooting

### Common Issues:
1. **"Access Denied" Error:**
   - Verify user exists in `admins` collection
   - Check `isActive` field is set to `true`

2. **Login Failed:**
   - Confirm email/password in Firebase Authentication
   - Verify Firebase configuration in `src/lib/firebase.ts`

3. **Admin Routes Not Working:**
   - Check browser console for errors
   - Verify admin authentication store (`src/store/adminAuth.ts`)

## 📞 Support
If you encounter issues, check:
1. Firebase project configuration
2. Internet connectivity
3. Browser console for error messages

---

**⚠️ Important:** Keep admin credentials secure and never commit them to version control!
