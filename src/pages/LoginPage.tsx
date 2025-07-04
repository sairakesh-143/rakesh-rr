
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleAdminRedirect = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <AuthForm onAdminRedirect={handleAdminRedirect} />
      </div>
    </div>
  );
};

export default LoginPage;
