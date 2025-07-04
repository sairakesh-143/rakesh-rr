
import { motion } from 'framer-motion';
import { DoctorCard } from '@/components/ui/doctor-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useState } from 'react';

const doctors = [
  {
    id: 'sarah-johnson',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: '15+ years experience',
    rating: 5,
    avatar: '/api/placeholder/100/100',
    availability: 'Available Today'
  },
  {
    id: 'michael-chen',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '12+ years experience',
    rating: 5,
    avatar: '/api/placeholder/100/100',
    availability: 'Available Tomorrow'
  },
  {
    id: 'emily-davis',
    name: 'Dr. Emily Davis',
    specialty: 'Pediatrician',
    experience: '10+ years experience',
    rating: 4,
    avatar: '/api/placeholder/100/100',
    availability: 'Available Today'
  },
  {
    id: 'robert-wilson',
    name: 'Dr. Robert Wilson',
    specialty: 'Orthopedic Surgeon',
    experience: '18+ years experience',
    rating: 5,
    avatar: '/api/placeholder/100/100',
    availability: 'Available Next Week'
  },
  {
    id: 'lisa-thompson',
    name: 'Dr. Lisa Thompson',
    specialty: 'Oncologist',
    experience: '14+ years experience',
    rating: 5,
    avatar: '/api/placeholder/100/100',
    availability: 'Available Today'
  },
  {
    id: 'james-brown',
    name: 'Dr. James Brown',
    specialty: 'Emergency Medicine',
    experience: '8+ years experience',
    rating: 4,
    avatar: '/api/placeholder/100/100',
    availability: 'Available 24/7'
  }
];

const specialties = ['All Specialties', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon', 'Oncologist', 'Emergency Medicine'];

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Our Doctors</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Meet our team of experienced healthcare professionals dedicated to providing you with the best possible care.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <DoctorCard
              key={index}
              name={doctor.name}
              specialty={doctor.specialty}
              experience={doctor.experience}
              rating={doctor.rating}
              avatar={doctor.avatar}
              availability={doctor.availability}
              doctorId={doctor.id}
              index={index}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('All Specialties');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
