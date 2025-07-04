
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';

interface DoctorSelectorProps {
  department: string;
  value: string;
  onChange: (doctor: string) => void;
}

const doctorsByDepartment: Record<string, any[]> = {
  cardiology: [
    {
      id: 'dr-sarah-johnson',
      name: 'Dr. Sarah Johnson',
      specialty: 'Interventional Cardiologist',
      experience: '15+ years',
      rating: 4.9,
      availability: 'Available Today',
      avatar: 'SJ'
    },
    {
      id: 'dr-michael-brown',
      name: 'Dr. Michael Brown',
      specialty: 'Cardiac Surgeon',
      experience: '20+ years',
      rating: 4.8,
      availability: 'Available Tomorrow',
      avatar: 'MB'
    }
  ],
  neurology: [
    {
      id: 'dr-emily-chen',
      name: 'Dr. Emily Chen',
      specialty: 'Neurologist',
      experience: '12+ years',
      rating: 4.9,
      availability: 'Available Today',
      avatar: 'EC'
    },
    {
      id: 'dr-david-kim',
      name: 'Dr. David Kim',
      specialty: 'Neurosurgeon',
      experience: '18+ years',
      rating: 4.7,
      availability: 'Available in 2 days',
      avatar: 'DK'
    }
  ],
  orthopedics: [
    {
      id: 'dr-lisa-wang',
      name: 'Dr. Lisa Wang',
      specialty: 'Orthopedic Surgeon',
      experience: '14+ years',
      rating: 4.8,
      availability: 'Available Today',
      avatar: 'LW'
    }
  ],
  pediatrics: [
    {
      id: 'dr-james-miller',
      name: 'Dr. James Miller',
      specialty: 'Pediatrician',
      experience: '10+ years',
      rating: 4.9,
      availability: 'Available Today',
      avatar: 'JM'
    }
  ],
  general: [
    {
      id: 'dr-anna-taylor',
      name: 'Dr. Anna Taylor',
      specialty: 'General Practitioner',
      experience: '8+ years',
      rating: 4.6,
      availability: 'Available Today',
      avatar: 'AT'
    }
  ],
  emergency: [
    {
      id: 'dr-emergency-team',
      name: 'Emergency Team',
      specialty: 'Emergency Medicine',
      experience: 'Available 24/7',
      rating: 4.8,
      availability: 'Always Available',
      avatar: 'ET'
    }
  ]
};

export const DoctorSelector = ({ department, value, onChange }: DoctorSelectorProps) => {
  const doctors = doctorsByDepartment[department] || [];

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No doctors available for the selected department.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose a Doctor</h3>
        <p className="text-gray-600">Select from our experienced medical professionals</p>
      </div>

      <div className="grid gap-4">
        {doctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cursor-pointer"
            onClick={() => onChange(doctor.id)}
          >
            <Card className={`border-2 transition-all duration-200 hover:shadow-md ${
              value === doctor.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {doctor.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">{doctor.name}</h4>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    <p className="text-gray-600 text-sm">{doctor.experience}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{doctor.rating}/5</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{doctor.availability}</span>
                      </div>
                    </div>
                  </div>
                  {value === doctor.id && (
                    <Badge className="bg-blue-600">Selected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
