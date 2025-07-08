
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, Mail, Phone, AlertCircle } from 'lucide-react';

interface AppointmentSummaryProps {
  data: {
    department: string;
    doctor: string;
    date: Date | null;
    time: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    symptoms: string;
  };
  onSubmit: () => void;
  isSubmitting: boolean;
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

export const AppointmentSummary = ({ data, onSubmit, isSubmitting }: AppointmentSummaryProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Appointment</h3>
        <p className="text-gray-600">Please review your appointment details carefully</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-blue-800 flex items-center text-xl">
              <Stethoscope className="w-6 h-6 mr-2" />
              Appointment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Department & Doctor */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm font-medium">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Department
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800">
                    {departmentNames[data.department] || data.department}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Doctor
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-800">
                    {doctorNames[data.doctor] || data.doctor}
                  </p>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="font-semibold text-purple-800">
                    {data.date ? format(data.date, 'EEEE, MMMM do, yyyy') : 'Not selected'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  Time
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="font-semibold text-orange-800">{data.time}</p>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="border-t pt-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Patient Information</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm font-medium">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <span className="font-medium">{data.patientName}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm font-medium">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <span className="font-medium">{data.patientEmail}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm font-medium">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <span className="font-medium">{data.patientPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            {data.symptoms && (
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Symptoms/Reason for Visit</h4>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{data.symptoms}</p>
                </div>
              </div>
            )}

            {/* Status Notice */}
            <div className="flex items-center justify-center pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <Badge variant="secondary" className="bg-transparent text-yellow-800 font-medium">
                  Status: Pending Confirmation
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Button */}
      <div className="text-center space-y-4">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !data.date}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Booking Appointment...
            </>
          ) : (
            'Confirm & Book Appointment'
          )}
        </Button>
        
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Notice:</p>
              <p>You will receive a confirmation email after booking. Your appointment status will be "Pending" until confirmed by our medical staff.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
