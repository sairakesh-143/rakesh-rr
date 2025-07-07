# Sample Admin Users for Database

To implement the admin authentication system, you need to manually add admin users to the Firestore database. Here's how:

## Database Structure

Create a collection called `admins` in your Firestore database with documents using the user's UID as the document ID.

## Sample Admin Document Structure

```javascript
// Collection: admins
// Document ID: {user_uid_from_firebase_auth}
{
  uid: "sample-admin-uid-123",
  email: "admin@hospital.com",
  name: "Hospital Administrator",
  role: "admin", // or "super_admin"
  isActive: true,
  createdAt: firebase.firestore.Timestamp.now(),
  lastLogin: firebase.firestore.Timestamp.now(),
  permissions: [
    "appointments:read",
    "appointments:write",
    "patients:read",
    "patients:write",
    "doctors:read",
    "doctors:write",
    "reports:read",
    "settings:read",
    "settings:write"
  ]
}
```

## How to Add Admin Users

### Step 1: Create Firebase Auth User
First, create a user in Firebase Authentication:
1. Go to Firebase Console > Authentication > Users
2. Click "Add User"
3. Enter email and password
4. Copy the generated UID

### Step 2: Add to Firestore
Add the user to the `admins` collection:
1. Go to Firebase Console > Firestore Database
2. Create collection named `admins`
3. Create document with UID as document ID
4. Add the fields as shown above

### Step 3: Sample Admin Accounts

**Main Administrator:**
- Email: `admin@dreamteamservices.com`
- Password: `AdminPass123!`
- Role: `super_admin`

**Department Manager:**
- Email: `manager@dreamteamservices.com`
- Password: `ManagerPass123!`
- Role: `admin`

## Security Rules

Update your Firestore security rules to protect admin data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin collection - only admins can read their own data
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
      allow write: if request.auth != null && 
                      request.auth.uid == adminId &&
                      get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Other collections...
  }
}
```

## Testing

1. Create the admin user in Firebase Auth
2. Add the user to the `admins` collection
3. Try logging in at `/admin/login`
4. Verify that only registered admins can access the admin panel

## Important Notes

- ✅ Admin credentials are required every time (no persistent sessions)
- ✅ Only users in the `admins` collection can access the admin panel
- ✅ Real-time logout functionality implemented
- ✅ Role-based permissions can be extended
- ✅ Active/inactive user management
- ✅ Last login tracking for security auditing

## Firebase Console Setup Commands

```javascript
// Add this to your Firebase Console > Firestore Database
// Create collection: admins
// Create document with admin UID
{
  uid: "REPLACE_WITH_ACTUAL_UID",
  email: "admin@dreamteamservices.com",
  name: "Dream Team Admin",
  role: "super_admin",
  isActive: true,
  createdAt: firebase.firestore.Timestamp.now(),
  permissions: [
    "appointments:read",
    "appointments:write", 
    "patients:read",
    "patients:write",
    "doctors:read",
    "doctors:write",
    "reports:read",
    "notifications:read",
    "notifications:write",
    "settings:read",
    "settings:write"
  ]
}
```
