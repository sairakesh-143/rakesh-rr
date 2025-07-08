
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/authStore';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, User, Mail, Phone, 
  FileText, Bell, Settings, LogOut, CheckCircle,
  AlertCircle, XCircle, Edit3, Stethoscope
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

// Appointment interface
interface Appointment {
  id: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptoms: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

const departmentNames: Record<string, string> = {
  cardiology: 'Cardiology',
  neurology: 'Neurology',
  orthopedics: 'Orthopedics',
  pediatrics: 'Pediatrics',
  general: 'General Medicine',
  emergency: 'Emergency Care'
};

const doctorNames: Record<string, string> = {
  'dr-sarah-johnson': 'Dr. Sarah Johnson',
  'dr-michael-brown': 'Dr. Michael Brown',
  'dr-emily-chen': 'Dr. Emily Chen',
  'dr-david-kim': 'Dr. David Kim',
  'dr-lisa-wang': 'Dr. Lisa Wang',
  'dr-james-miller': 'Dr. James Miller',
  'dr-anna-taylor': 'Dr. Anna Taylor',
  'dr-emergency-team': 'Emergency Team'
};

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserAppointments();
    }
  }, [user]);

  const fetchUserAppointments = async () => {
    if (!user?.email) return;
    
    try {
      const q = query(
        collection(db, 'appointments'),
        where('patientEmail', '==', user.email)
      );
      
      const querySnapshot = await getDocs(q);
      const userAppointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      // Sort by creation date, newest first
      userAppointments.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'cancelled'
      });

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );

      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const userInitials = user.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
              <div className="flex flex-col md:flex-row items-center gap-6 text-white">
                <Avatar className="w-24 h-24 border-4 border-white/20">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {user.displayName || 'Patient'}
                  </h1>
                  <div className="flex flex-col md:flex-row gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/appointments">
                    <Calendar className="w-4 h-4 mr-3" />
                    Book New Appointment
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/health-records">
                    <FileText className="w-4 h-4 mr-3" />
                    View Medical Records
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </Button>
                <Separator />
                <Button 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                  variant="ghost"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <Card className="shadow-lg border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Appointments</span>
                  <Badge variant="outline" className="font-semibold">{appointments.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <Badge variant="secondary" className="font-semibold bg-yellow-100 text-yellow-800">
                    {appointments.filter(a => a.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confirmed</span>
                  <Badge variant="default" className="font-semibold">
                    {appointments.filter(a => a.status === 'confirmed').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cancelled</span>
                  <Badge variant="destructive" className="font-semibold">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appointments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  My Appointments
                </CardTitle>
                <p className="text-gray-600">View and manage your booked appointments</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-lg">Loading appointments...</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                      >
                        {/* Status indicator line */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${
                          appointment.status === 'confirmed' ? 'bg-green-500' :
                          appointment.status === 'pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Doctor Info */}
                            <div className="flex-1">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                  <Stethoscope className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {doctorNames[appointment.doctor] || appointment.doctor}
                                  </h3>
                                  <p className="text-blue-600 font-medium mb-2">
                                    {departmentNames[appointment.department] || appointment.department}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(appointment.status)}
                                    <Badge 
                                      variant={getStatusBadgeVariant(appointment.status)} 
                                      className="text-xs font-medium"
                                    >
                                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Appointment Details Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                    <p className="font-semibold text-gray-900">
                                      {format(new Date(appointment.date), 'MMM dd, yyyy')}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                                    <p className="font-semibold text-gray-900">{appointment.time}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Symptoms */}
                              {appointment.symptoms && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                  <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Symptoms/Reason</p>
                                      <p className="text-sm text-blue-800">{appointment.symptoms}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex lg:flex-col gap-3 lg:w-48">
                              {appointment.status === 'pending' && (
                                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                  <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                  <p className="text-sm text-yellow-800 font-medium">Awaiting Confirmation</p>
                                  <p className="text-xs text-yellow-600 mt-1">We'll notify you once confirmed</p>
                                </div>
                              )}
                              
                              {appointment.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1 lg:w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              )}
                              
                              {appointment.status === 'cancelled' && (
                                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                  <p className="text-sm text-red-800 font-medium">Cancelled</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {!loading && appointments.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Appointments Yet</h3>
                    <p className="text-gray-500 mb-6">You haven't booked any appointments yet.</p>
                    <Button asChild>
                      <Link to="/appointments">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Your First Appointment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
