import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, FileText, Pill, Download, Eye, MapPin } from 'lucide-react';

const upcomingAppointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2024-01-15',
    time: '10:00 AM',
    location: 'Room 204, Cardiology Wing',
    type: 'Follow-up'
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    date: '2024-01-22',
    time: '2:30 PM',
    location: 'Room 305, Neurology Wing',
    type: 'Consultation'
  }
];

const pastVisits = [
  {
    id: 1,
    doctor: 'Dr. Emily Davis',
    specialty: 'Pediatrician',
    date: '2023-12-10',
    diagnosis: 'Annual Checkup',
    notes: 'All vitals normal. Continue current medications.'
  },
  {
    id: 2,
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2023-11-15',
    diagnosis: 'Hypertension Management',
    notes: 'Blood pressure well controlled. Schedule follow-up in 2 months.'
  }
];

const prescriptions = [
  {
    id: 1,
    medication: 'Lisinopril 10mg',
    prescribedBy: 'Dr. Sarah Johnson',
    date: '2023-11-15',
    instructions: 'Take once daily with food',
    refills: 2,
    status: 'Active'
  },
  {
    id: 2,
    medication: 'Vitamin D3 2000IU',
    prescribedBy: 'Dr. Emily Davis',
    date: '2023-12-10',
    instructions: 'Take once daily',
    refills: 5,
    status: 'Active'
  }
];

const PatientPortalPage = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Patient Portal</h1>
          <p className="text-xl text-gray-600">
            Welcome back, John Doe. Manage your health information and appointments.
          </p>
        </motion.div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="visits">Past Visits</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {appointment.doctor}
                              </h3>
                              <Badge variant="secondary">{appointment.type}</Badge>
                            </div>
                            <p className="text-gray-600 mb-1">{appointment.specialty}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {appointment.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="destructive" size="sm">Cancel</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Visits</h2>
              <div className="space-y-4">
                {pastVisits.map((visit, index) => (
                  <motion.div
                    key={visit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {visit.doctor}
                            </h3>
                            <p className="text-gray-600 mb-2">{visit.specialty}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                              <Calendar className="w-4 h-4" />
                              {visit.date}
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-gray-700">Diagnosis: </span>
                                <span className="text-gray-600">{visit.diagnosis}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Notes: </span>
                                <span className="text-gray-600">{visit.notes}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Prescriptions</h2>
              <div className="space-y-4">
                {prescriptions.map((prescription, index) => (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Pill className="w-5 h-5 text-blue-600" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                {prescription.medication}
                              </h3>
                              <Badge variant={prescription.status === 'Active' ? 'default' : 'secondary'}>
                                {prescription.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-1">Prescribed by {prescription.prescribedBy}</p>
                            <div className="space-y-1 text-sm text-gray-500">
                              <p>Date: {prescription.date}</p>
                              <p>Instructions: {prescription.instructions}</p>
                              <p>Refills remaining: {prescription.refills}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Request Refill</Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientPortalPage;