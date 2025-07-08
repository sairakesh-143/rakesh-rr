import { create } from 'zustand';
import { User } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Hardcoded admin credentials for maximum security
const ADMIN_EMAIL = 'admin.temp.1751968826962@hospital.com';
const ADMIN_PASSWORD = 'rakesh@123';

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

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  user: null,
  adminData: null,
  isAdminAuthenticated: false,
  isLoading: false,
  
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
      
      // First check if email matches exactly (case-sensitive)
      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        console.warn('Unauthorized admin login attempt:', user.email);
        set({ 
          adminData: null, 
          isAdminAuthenticated: false 
        });
        return false;
      }
      
      // Additional strict email validation
      if (user.email !== ADMIN_EMAIL) {
        console.warn('Email case mismatch for admin login:', user.email);
        set({ 
          adminData: null, 
          isAdminAuthenticated: false 
        });
        return false;
      }
      
      // Check if password matches (if provided)
      if (password && password !== ADMIN_PASSWORD) {
        console.warn('Invalid password for admin login');
        set({ 
          adminData: null, 
          isAdminAuthenticated: false 
        });
        return false;
      }
      
      // Check if user exists in admins collection
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data() as AdminUser;
        
        // Triple-check email in Firestore data
        if (adminData.email !== ADMIN_EMAIL) {
          console.warn('Admin email mismatch in Firestore:', adminData.email);
          set({ 
            adminData: null, 
            isAdminAuthenticated: false 
          });
          return false;
        }
        
        // Check if admin is active
        if (adminData.isActive) {
          set({ 
            adminData, 
            isAdminAuthenticated: true,
            user 
          });
          
          // Update last login
          try {
            await updateDoc(adminDocRef, {
              lastLogin: serverTimestamp()
            });
          } catch (error) {
            console.error('Error updating last login:', error);
          }
          
          return true;
        } else {
          console.warn('Admin account is inactive');
          set({ 
            adminData: null, 
            isAdminAuthenticated: false 
          });
          return false;
        }
      } else {
        console.warn('User is not registered as admin');
        set({ 
          adminData: null, 
          isAdminAuthenticated: false 
        });
        return false;
      }
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
