
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { DepartmentSelector } from '@/components/appointment/DepartmentSelector';
import { DoctorSelector } from '@/components/appointment/DoctorSelector';
import { DateTimeSelector } from '@/components/appointment/DateTimeSelector';
import { PatientDetailsForm } from '@/components/appointment/PatientDetailsForm';
import { AppointmentSummary } from '@/components/appointment/AppointmentSummary';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

interface AppointmentData {
  department: string;
  doctor: string;
  date: Date | null;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptoms: string;
}

const AppointmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    department: '',
    doctor: '',
    date: null,
    time: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    symptoms: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const steps = [
    { number: 1, title: 'Department', icon: Stethoscope },
    { number: 2, title: 'Doctor', icon: User },
    { number: 3, title: 'Date & Time', icon: Calendar },
    { number: 4, title: 'Details', icon: Clock },
    { number: 5, title: 'Confirm', icon: Calendar }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return appointmentData.department !== '';
      case 2:
        return appointmentData.doctor !== '';
      case 3:
        return appointmentData.date !== null && appointmentData.time !== '';
      case 4:
        return appointmentData.patientName !== '' && appointmentData.patientEmail !== '' && appointmentData.patientPhone !== '';
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        userId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
        date: appointmentData.date?.toISOString()
      });

      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been submitted and is pending confirmation. You will receive a notification once it's confirmed by our staff."
      });

      // Reset form
      setAppointmentData({
        department: '',
        doctor: '',
        date: null,
        time: '',
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        symptoms: ''
      });
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DepartmentSelector
            value={appointmentData.department}
            onChange={(department) => setAppointmentData({ ...appointmentData, department })}
          />
        );
      case 2:
        return (
          <DoctorSelector
            department={appointmentData.department}
            value={appointmentData.doctor}
            onChange={(doctor) => setAppointmentData({ ...appointmentData, doctor })}
          />
        );
      case 3:
        return (
          <DateTimeSelector
            selectedDate={appointmentData.date}
            selectedTime={appointmentData.time}
            onDateChange={(date) => setAppointmentData({ ...appointmentData, date })}
            onTimeChange={(time) => setAppointmentData({ ...appointmentData, time })}
          />
        );
      case 4:
        return (
          <PatientDetailsForm
            data={appointmentData}
            onChange={setAppointmentData}
          />
        );
      case 5:
        return (
          <AppointmentSummary
            data={appointmentData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Book an Appointment</h1>
          <p className="text-xl text-gray-600">Schedule your visit with our expert medical professionals</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block absolute h-0.5 w-16 mt-6 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} style={{ left: `${(index + 1) * 20}%` }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
