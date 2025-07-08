import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, MapPin, Bell, CheckCircle, AlertCircle } from 'lucide-react';

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
  confirmedAt?: any;
  updatedAt?: any;
  userId?: string;
}

interface Notification {
  id: string;
  userId: string;
  patientName: string;
  patientEmail: string;
  appointmentId: string;
  type: string;
  title: string;
  message: string;
  createdAt: any;
  read: boolean;
  appointment: {
    doctor: string;
    department: string;
    date: string;
    time: string;
  };
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

const UserAppointmentsPage = () => {
  const [confirmedAppointments, setConfirmedAppointments] = useState<Appointment[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserAppointments();
      fetchUserNotifications();
      
      // Set up real-time listeners
      const unsubscribeAppointments = setupAppointmentListener();
      const unsubscribeNotifications = setupNotificationListener();
      
      return () => {
        unsubscribeAppointments();
        unsubscribeNotifications();
      };
    }
  }, [user]);

  const fetchUserAppointments = async () => {
    if (!user) return;
    
    try {
      // Fetch confirmed appointments
      const confirmedQuery = query(
        collection(db, 'appointments'),
        where('userId', '==', user.uid),
        where('status', '==', 'confirmed'),
        orderBy('date', 'desc')
      );
      
      const confirmedSnapshot = await getDocs(confirmedQuery);
      const confirmedData = confirmedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      // Fetch pending appointments (for reference)
      const pendingQuery = query(
        collection(db, 'appointments'),
        where('userId', '==', user.uid),
        where('status', '==', 'pending'),
        orderBy('date', 'desc')
      );
      
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingData = pendingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      setConfirmedAppointments(confirmedData);
      setPendingAppointments(pendingData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNotifications = async () => {
    if (!user) return;
    
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationsData = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const setupAppointmentListener = () => {
    if (!user) return () => {};
    
    const appointmentQuery = query(
      collection(db, 'appointments'),
      where('userId', '==', user.uid)
    );
    
    return onSnapshot(appointmentQuery, (snapshot) => {
      const appointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      const confirmed = appointments.filter(apt => apt.status === 'confirmed');
      const pending = appointments.filter(apt => apt.status === 'pending');
      
      setConfirmedAppointments(confirmed);
      setPendingAppointments(pending);
    });
  };

  const setupNotificationListener = () => {
    if (!user) return () => {};
    
    const notificationQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(notificationQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(notificationsData);
      
      // Show toast for new notifications
      const newNotifications = notificationsData.filter(n => !n.read);
      if (newNotifications.length > 0) {
        const latest = newNotifications[0];
        toast({
          title: latest.title,
          description: "You have a new notification about your appointment",
        });
      }
    });
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Stethoscope className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-lg">
                  {doctorNames[appointment.doctor] || appointment.doctor}
                </h3>
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                  Confirmed
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{departmentNames[appointment.department] || appointment.department}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(appointment.date), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Dream Team Services Hospital</span>
                </div>
              </div>
              {appointment.symptoms && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm"><strong>Symptoms:</strong> {appointment.symptoms}</p>
                </div>
              )}
              {appointment.confirmedAt && (
                <div className="mt-2 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Confirmed on {format(appointment.confirmedAt.toDate(), 'MMM dd, yyyy')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`mb-3 ${!notification.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Bell className="h-4 w-4 text-blue-500 mr-2" />
                <h4 className="font-semibold">{notification.title}</h4>
                {!notification.read && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
              <div className="text-xs text-gray-500">
                {format(notification.createdAt.toDate(), 'MMM dd, yyyy - hh:mm a')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Please Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You need to be signed in to view your appointments.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading your appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">View your confirmed appointments and notifications</p>
          </div>

          <Tabs defaultValue="confirmed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="confirmed">
                Confirmed Appointments ({confirmedAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications ({notifications.filter(n => !n.read).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="confirmed" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Confirmed Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {confirmedAppointments.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You don't have any confirmed appointments yet. Your appointments will appear here once they are confirmed by our staff.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {confirmedAppointments.map(appointment => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    Pending Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingAppointments.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You don't have any pending appointments.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          These appointments are pending confirmation from our staff. You'll receive a notification once they're confirmed.
                        </AlertDescription>
                      </Alert>
                      {pendingAppointments.map(appointment => (
                        <Card key={appointment.id} className="mb-4">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <Stethoscope className="h-5 w-5 text-blue-500 mr-2" />
                                  <h3 className="font-semibold text-lg">
                                    {doctorNames[appointment.doctor] || appointment.doctor}
                                  </h3>
                                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                                    Pending
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>{departmentNames[appointment.department] || appointment.department}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{format(new Date(appointment.date), 'MMMM dd, yyyy')}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 text-blue-500 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You don't have any notifications yet.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map(notification => (
                        <NotificationCard key={notification.id} notification={notification} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default UserAppointmentsPage;
