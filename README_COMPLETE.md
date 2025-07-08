# 🏥 Hospital Management System

A comprehensive, modern hospital website built with React, TypeScript, and Firebase. This system provides complete healthcare management solutions for both patients and administrators.

## 🚀 Live Demo
- **Main Website:** `http://localhost:8082`
- **Admin Portal:** `http://localhost:8082/admin/login`

## 👤 Admin Access
- **Email:** `dwarampudisai@gmail.com`
- **Password:** `rakesh@123`

## ✨ Features

### 🔐 Authentication System
- **User Registration/Login** with Firebase Authentication
- **Admin Portal** with role-based access control
- **Google Sign-In** integration
- **Secure session management**

### 👨‍⚕️ Doctor Management
- **Dynamic doctor profiles** loaded from Firestore
- **Department-based filtering** and search
- **Admin-only doctor management** (Add, Edit, Activate/Deactivate)
- **No hardcoded data** - fully dynamic system

### 📅 Appointment System
- **Online appointment booking** with step-by-step process
- **My Appointments** page for users
- **Admin appointment management**
- **Status tracking** (Pending, Confirmed, Completed, Cancelled)

### 📋 Health Records
- **Personal medical records** management
- **Lab results** with normal/abnormal indicators
- **Vital signs** tracking
- **User-specific secure access**

### 📱 Mobile-Responsive Design
- **Responsive navigation** with mobile hamburger menu
- **Touch-friendly interface**
- **Professional healthcare UI**
- **Accessible design**

## 🛠️ Technology Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Firebase Authentication + Firestore Database
- **Styling:** Tailwind CSS + Framer Motion
- **Routing:** React Router v6
- **UI Components:** Shadcn/UI
- **Icons:** Lucide React

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sairakesh-143/rakesh-rr.git
   cd rakesh-rr
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore
   - Update `src/lib/firebase.ts` with your config

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Admin Setup

### Quick Setup
1. Open `admin-setup.html` in your browser
2. Update Firebase configuration
3. Click "Create Admin User"

### Manual Setup
1. Go to Firebase Console → Authentication
2. Add user: `dwarampudisai@gmail.com` / `rakesh@123`
3. In Firestore, create `admins` collection
4. Add document with admin permissions

See `ADMIN_SETUP_NEW.md` for detailed instructions.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── admin/           # Admin-specific components
│   └── appointment/     # Appointment booking components
├── pages/
│   ├── admin/           # Admin portal pages
│   ├── HomePage.tsx     # Landing page
│   ├── DoctorsPage.tsx  # Doctor listing with filters
│   ├── AppointmentPage.tsx # Appointment booking
│   ├── MyAppointmentsPage.tsx # User appointments
│   └── HealthRecordsPage.tsx # Health records
├── store/               # State management
├── hooks/               # Custom React hooks
└── lib/                 # Utilities and Firebase config
```

## 🔒 Security Features

- **Role-based access control** for admin routes
- **Firestore security rules** for data protection
- **Input validation** and sanitization
- **Secure authentication** with Firebase
- **Protected routes** for sensitive pages

## 🌐 Pages & Routes

### Public Routes
- `/` - Homepage
- `/services` - Services overview
- `/doctors` - Doctor listing with search/filter
- `/contact` - Contact form
- `/login` - User authentication

### Protected User Routes
- `/appointments` - Book appointments
- `/my-appointments` - View user appointments
- `/health-records` - Personal health records
- `/profile` - User profile management

### Admin Routes
- `/admin/login` - Admin authentication
- `/admin` - Admin dashboard
- `/admin/doctors` - Doctor management
- `/admin/appointments` - Appointment management

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables for Firebase

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Firebase Configuration

Update `src/lib/firebase.ts` with your Firebase project configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 📊 Database Collections

### Firestore Structure
- `admins` - Admin user permissions
- `users` - Patient user profiles
- `doctors` - Doctor profiles and information
- `appointments` - Appointment bookings
- `healthRecords` - Medical records
- `labResults` - Laboratory test results
- `vitalSigns` - Patient vital signs

## 🎯 Key Features Implemented

✅ **Secure admin authentication system**  
✅ **Dynamic doctor management (no hardcoded data)**  
✅ **Department navigation with auto-filtering**  
✅ **Complete appointment booking system**  
✅ **Personal health records management**  
✅ **Mobile-responsive design**  
✅ **Professional healthcare UI/UX**  
✅ **Contact form with Firestore integration**  
✅ **User registration with profile creation**  
✅ **Admin doctor CRUD operations**  

## 📞 Support

For support or questions:
- Check the documentation in `/docs` folder
- Review Firebase console for data issues
- Check browser console for error messages

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Hospital Management System - Complete & Production Ready!**
