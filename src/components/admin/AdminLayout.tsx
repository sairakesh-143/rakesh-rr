
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Users, Settings, Home, UserCheck, BarChart3, Bell, Stethoscope, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuthStore } from '@/store/adminAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, adminData } = useAdminAuthStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      toast({
        title: "Logged out",
        description: "You have been logged out of the admin portal.",
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen gradient-secondary">
      {/* Professional Header with Navigation */}
      <header className="glass-effect shadow-professional border-b border-border/50 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center space-x-4">
              <div className="gradient-primary text-white px-6 py-3 rounded-xl font-bold text-xl shadow-professional">
                CareHub Admin
              </div>
              {adminData && (
                <div className="text-sm text-muted-foreground">
                  Welcome, {adminData.name || adminData.email}
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-2">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive
                      ? 'gradient-primary text-white shadow-professional'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`
                }
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/appointments"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive
                      ? 'gradient-primary text-white shadow-professional'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`
                }
              >
                <Calendar className="w-4 h-4 mr-2" />
                Appointments
              </NavLink>
              <NavLink
                to="/admin/patients"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive
                      ? 'gradient-primary text-white shadow-professional'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Patients
              </NavLink>
              <NavLink
                to="/admin/doctors"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive
                      ? 'gradient-primary text-white shadow-professional'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`
                }
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Doctors
              </NavLink>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive
                      ? 'gradient-primary text-white shadow-professional'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </NavLink>
              <NavLink
                to="/admin/notifications"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive
                      ? 'gradient-primary text-white shadow-professional'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`
                }
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </NavLink>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive
                      ? 'gradient-primary text-white shadow-professional'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`
                }
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </NavLink>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8">
        <div className="glass-effect rounded-xl shadow-strong border-0 min-h-[calc(100vh-200px)]">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
