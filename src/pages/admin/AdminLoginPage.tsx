import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/adminAuth';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, checkAdminAccess } = useAdminAuthStore();

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema)
  });

  const handleAdminLogin = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      // First authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Then check if user is registered as admin in Firestore
      const isAdmin = await checkAdminAccess(userCredential.user);
      
      if (isAdmin) {
        setUser(userCredential.user);
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin dashboard.",
        });
        navigate('/admin');
      } else {
        // Sign out the user if they're not an admin
        await auth.signOut();
        toast({
          title: "Access denied",
          description: "This account is not registered as an admin user.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      let errorMessage = error.message;
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        errorMessage = "Invalid admin credentials. Please check your email and password.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
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
                Admin Portal
              </CardTitle>
              <p className="text-muted-foreground mt-2">Authorized healthcare personnel only</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Only registered administrators can access this portal. Your credentials must be pre-registered in the system database.
              </AlertDescription>
            </Alert>

            <form onSubmit={form.handleSubmit(handleAdminLogin)} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Administrator Email"
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