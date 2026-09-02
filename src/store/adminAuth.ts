import { create } from 'zustand';
import { User } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Authorized admin credentials
const ADMIN_EMAILS = [
  'dwarampudirakesh@gmail.com',
  'admin.temp.1751968826962@hospital.com'
];
const ADMIN_PASSWORDS = [
  'rakesh@1234',
  'rakesh@123'
];

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: any;
  lastLogin?: any;
  permissions: string[];
}

interface AdminAuthState {
  user: User | null;
  adminData: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAdminData: (adminData: AdminUser | null) => void;
  setLoading: (loading: boolean) => void;
  checkAdminAccess: (user: User, password?: string) => Promise<boolean>;
  logout: () => void;
  clearAuthState: () => void;
}

const DEFAULT_PERMISSIONS = [
  'appointments:read',
  'appointments:write',
  'patients:read',
  'patients:write',
  'doctors:read',
  'doctors:write',
  'reports:read',
  'settings:read',
  'settings:write',
  'manage_doctors',
  'manage_patients',
  'manage_appointments',
  'view_reports',
  'manage_notifications',
  'manage_settings',
  'full_access'
];

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  user: null,
  adminData: null,
  isAdminAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => {
    set({ user });
    if (!user) {
      set({ adminData: null, isAdminAuthenticated: false });
    }
  },
  
  setAdminData: (adminData) => {
    set({ 
      adminData, 
      isAdminAuthenticated: !!adminData?.isActive 
    });
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  checkAdminAccess: async (user: User, password?: string) => {
    try {
      set({ isLoading: true });
      
      const userEmail = user.email?.toLowerCase().trim() || '';
      const isAuthorizedEmail = ADMIN_EMAILS.some(e => e.toLowerCase() === userEmail);
      
      if (!isAuthorizedEmail) {
        console.warn('Unauthorized admin login attempt:', user.email);
        set({ 
          adminData: null, 
          isAdminAuthenticated: false 
        });
        return false;
      }
      
      // Check if password matches (if provided)
      if (password && !ADMIN_PASSWORDS.includes(password)) {
        console.warn('Invalid password for admin login');
        set({ 
          adminData: null, 
          isAdminAuthenticated: false 
        });
        return false;
      }
      
      // Default fallback admin record for authorized admin email
      let adminRecord: AdminUser = {
        uid: user.uid,
        email: user.email || 'dwarampudirakesh@gmail.com',
        name: 'Rakesh Reddy',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        permissions: DEFAULT_PERMISSIONS
      };
      
      // Try to check/fetch Firestore record if available
      try {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);
        
        if (adminDoc.exists()) {
          const data = adminDoc.data() as AdminUser;
          if (data.isActive !== false) {
            adminRecord = {
              ...adminRecord,
              ...data,
              isActive: true,
              permissions: data.permissions || DEFAULT_PERMISSIONS
            };
            
            // Try updating last login
            try {
              await updateDoc(adminDocRef, {
                lastLogin: serverTimestamp()
              });
            } catch {
              // Ignore lastLogin write errors
            }
          } else {
            console.warn('Admin account is marked inactive in Firestore');
            set({ adminData: null, isAdminAuthenticated: false });
            return false;
          }
        }
      } catch (firestoreError) {
        // If Firestore rules deny direct reads, fallback gracefully since Firebase Auth verified the user
        console.info('Firestore admin doc check skipped/fallback used:', firestoreError);
      }
      
      set({ 
        adminData: adminRecord, 
        isAdminAuthenticated: true,
        user 
      });
      return true;
    } catch (error) {
      console.error('Error checking admin access:', error);
      set({ 
        adminData: null, 
        isAdminAuthenticated: false 
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    set({ 
      user: null, 
      adminData: null, 
      isAdminAuthenticated: false,
      isLoading: false 
    });
  },
  
  clearAuthState: () => {
    set({ 
      user: null, 
      adminData: null, 
      isAdminAuthenticated: false,
      isLoading: false 
    });
  }
}));
