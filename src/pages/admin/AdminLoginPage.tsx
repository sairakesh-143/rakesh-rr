import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/adminAuth';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Shield, AlertCircle, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, checkAdminAccess, clearAuthState } = useAdminAuthStore();

  // Clear any existing admin session when component mounts
  useEffect(() => {
    const clearSession = async () => {
      try {
        await signOut(auth);
        clearAuthState();
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    };
    clearSession();
  }, [clearAuthState]);

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleAdminLogin = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      // Validate credentials client-side first
      if (data.email !== 'admin.temp.1751968826962@hospital.com' || data.password !== 'rakesh@123') {
        toast({
          title: "Access denied",
          description: "Invalid admin credentials. Only authorized administrators can access this portal.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // First authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Then check if user is registered as admin in Firestore with password validation
      const isAdmin = await checkAdminAccess(userCredential.user, data.password);
      
      if (isAdmin) {
        setUser(userCredential.user);
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin dashboard.",
        });
        navigate('/admin');
      } else {
        // Sign out the user if they're not an admin
        await signOut(auth);
        clearAuthState();
        toast({
          title: "Access denied",
          description: "This account is not authorized for admin access or invalid credentials.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      let errorMessage = error.message;
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        errorMessage = "Invalid admin credentials. Only authorized administrators can access this portal.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect admin password. Please try again.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This admin account has been disabled. Please contact support.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      toast({
        title: "Admin login failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Clear any auth state on error
      try {
        await signOut(auth);
        clearAuthState();
      } catch (signOutError) {
        console.error('Error signing out:', signOutError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-effect shadow-strong border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-2 shadow-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Secure Admin Portal
              </CardTitle>
              <p className="text-muted-foreground mt-2">Authorized healthcare personnel only</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <Lock className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-200">
                <strong>Restricted Access:</strong> Only pre-registered administrators with valid credentials can access this portal. All login attempts are monitored and logged.
              </AlertDescription>
            </Alert>

            <form onSubmit={form.handleSubmit(handleAdminLogin)} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Administrator Email (dwarampudirakesh@gmail.com)"
                    type="email"
                    {...form.register('email')}
                    className={`transition-smooth ${
                      form.formState.errors.email ? 'border-destructive ring-destructive/20' : ''
                    }`}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Administrator Password"
                    type="password"
                    {...form.register('password')}
                    className={`transition-smooth ${
                      form.formState.errors.password ? 'border-destructive ring-destructive/20' : ''
                    }`}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-destructive text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="premium"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Access Admin Dashboard'}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                ← Back to Patient Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;