
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, Bell } from 'lucide-react';

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
  userId?: string; // Add userId field for notifications
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

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      // Sort by creation date, newest first
      appointmentsData.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
      
      setAppointments(appointmentsData);
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

  const updateAppointmentStatus = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) return;

      // Update appointment status
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: status,
        updatedAt: serverTimestamp(),
        ...(status === 'confirmed' && { confirmedAt: serverTimestamp() })
      });

      // Send notification to user
      await sendNotificationToUser(appointment, status);

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );

      toast({
        title: "Success",
        description: `Appointment ${status} successfully. Notification sent to patient.`,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive"
      });
    }
  };

  const sendNotificationToUser = async (appointment: Appointment, status: 'confirmed' | 'cancelled') => {
    try {
      const doctorName = doctorNames[appointment.doctor] || appointment.doctor;
      const departmentName = departmentNames[appointment.department] || appointment.department;
      
      let message: string;
      let notificationType: string;

      if (status === 'confirmed') {
        message = `Hello ${appointment.patientName}, your appointment on ${format(new Date(appointment.date), 'MMMM dd, yyyy')} at ${appointment.time} with ${doctorName} (${departmentName}) has been confirmed. Thank you for choosing Dream Team Services Hospital!`;
        notificationType = 'appointment-confirmed';
      } else {
        message = `Hello ${appointment.patientName}, your appointment on ${format(new Date(appointment.date), 'MMMM dd, yyyy')} at ${appointment.time} with ${doctorName} has been cancelled. Please contact us to reschedule.`;
        notificationType = 'appointment-cancelled';
      }

      await addDoc(collection(db, 'notifications'), {
        userId: appointment.userId || appointment.patientEmail, // Use userId or email as fallback
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        appointmentId: appointment.id,
        type: notificationType,
        title: `Appointment ${status === 'confirmed' ? 'Confirmed' : 'Cancelled'}`,
        message: message,
        createdAt: serverTimestamp(),
        read: false,
        appointment: {
          doctor: doctorName,
          department: departmentName,
          date: appointment.date,
          time: appointment.time
        }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const rescheduleAppointment = async (appointmentId: string, newDate: string, newTime: string) => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) return;

      await updateDoc(doc(db, 'appointments', appointmentId), {
        date: newDate,
        time: newTime,
        status: 'confirmed', // Auto-confirm when rescheduled by admin
        updatedAt: serverTimestamp(),
        confirmedAt: serverTimestamp()
      });

      // Send reschedule notification
      await sendRescheduleNotification(appointment, newDate, newTime);

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, date: newDate, time: newTime, status: 'confirmed' } : apt
        )
      );

      toast({
        title: "Success",
        description: "Appointment rescheduled successfully. Notification sent to patient.",
      });
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment",
        variant: "destructive"
      });
    }
  };

  const sendRescheduleNotification = async (appointment: Appointment, newDate: string, newTime: string) => {
    try {
      const doctorName = doctorNames[appointment.doctor] || appointment.doctor;
      const departmentName = departmentNames[appointment.department] || appointment.department;
      
      const message = `Hello ${appointment.patientName}, your appointment with ${doctorName} (${departmentName}) has been rescheduled to ${format(new Date(newDate), 'MMMM dd, yyyy')} at ${newTime}. Your appointment is confirmed. Thank you for choosing Dream Team Services Hospital!`;

      await addDoc(collection(db, 'notifications'), {
        userId: appointment.userId || appointment.patientEmail,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        appointmentId: appointment.id,
        type: 'appointment-rescheduled',
        title: 'Appointment Rescheduled',
        message: message,
        createdAt: serverTimestamp(),
        read: false,
        appointment: {
          doctor: doctorName,
          department: departmentName,
          date: newDate,
          time: newTime
        }
      });
    } catch (error) {
      console.error('Error sending reschedule notification:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Appointment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.patientName}</div>
                        <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                        <div className="text-sm text-gray-500">{appointment.patientPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2 text-blue-600" />
                        {departmentNames[appointment.department]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-green-600" />
                        {doctorNames[appointment.doctor]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-600" />
                        <div>
                          <div>{format(new Date(appointment.date), 'MMM dd, yyyy')}</div>
                          <div className="text-sm text-gray-500">{appointment.time}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newDate = prompt('Enter new date (YYYY-MM-DD):', appointment.date);
                                const newTime = prompt('Enter new time:', appointment.time);
                                if (newDate && newTime) {
                                  rescheduleAppointment(appointment.id, newDate, newTime);
                                }
                              }}
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newDate = prompt('Enter new date (YYYY-MM-DD):', appointment.date);
                                const newTime = prompt('Enter new time:', appointment.time);
                                if (newDate && newTime) {
                                  rescheduleAppointment(appointment.id, newDate, newTime);
                                }
                              }}
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'cancelled' && (
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppointments;
