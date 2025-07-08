import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, FileText, MapPin, Phone, Mail, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  userId: string;
  createdAt: any;
}

const MyAppointmentsPage = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, 'appointments');
        const appointmentsQuery = query(
          appointmentsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        const appointmentsData: Appointment[] = [];
        appointmentsSnapshot.forEach((doc) => {
          appointmentsData.push({
            id: doc.id,
            ...doc.data() as Appointment
          });
        });
        
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointments. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'pending' || apt.status === 'confirmed'
  );
  
  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );

  if (!user) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your appointments</h1>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-xl text-gray-600">Manage your healthcare appointments</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Appointments ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              {appointment.doctor}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{appointment.department}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">
                                {new Date(appointment.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">Date</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.time}</p>
                              <p className="text-sm text-gray-600">Time</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-gray-600">Patient</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.patientPhone}</p>
                              <p className="text-sm text-gray-600">Phone</p>
                            </div>
                          </div>
                        </div>

                        {appointment.symptoms && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Symptoms/Notes:</p>
                            <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {appointment.status === 'pending' && (
                            <Button variant="outline" size="sm">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-500 mb-4">Book your first appointment to get started.</p>
                  <Button asChild>
                    <a href="/appointments">Book Appointment</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-gray-600" />
                              {appointment.doctor}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{appointment.department}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">
                                {new Date(appointment.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">Date</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.time}</p>
                              <p className="text-sm text-gray-600">Time</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            View Report
                          </Button>
                          {appointment.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              Book Follow-up
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No past appointments</h3>
                  <p className="text-gray-500">Your appointment history will appear here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
