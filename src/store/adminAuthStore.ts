import { create } from 'zustand';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  checkAdminAccess: (user: User) => Promise<boolean>;
  logout: () => void;
}

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
  
  checkAdminAccess: async (user: User) => {
    try {
      set({ isLoading: true });
      
      // Check if user exists in admins collection
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data() as AdminUser;
        
        // Check if admin is active
        if (adminData.isActive) {
          set({ 
            adminData, 
            isAdminAuthenticated: true,
            user 
          });
          
          // Update last login
          try {
            await import('firebase/firestore').then(({ updateDoc, serverTimestamp }) => {
              updateDoc(adminDocRef, {
                lastLogin: serverTimestamp()
              });
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
  }
}));
