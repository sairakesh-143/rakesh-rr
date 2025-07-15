import { motion } from 'framer-motion';
import { DoctorCard } from '@/components/ui/doctor-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  avatar: string;
  availability: string;
  phone?: string;
  email?: string;
  education?: string;
  isActive?: boolean;
}

const DoctorsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>(['All Specialties']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener for active doctors
    const doctorsRef = collection(db, 'doctors');
    const activeQuery = query(
      doctorsRef, 
      where('isActive', '==', true),
      orderBy('joinedDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(activeQuery, (snapshot) => {
      const doctorsData: Doctor[] = [];
      const specialtySet = new Set<string>();
      
      snapshot.forEach((doc) => {
        const data = doc.data() as Doctor;
        doctorsData.push({
          id: doc.id,
          ...data
        });
        specialtySet.add(data.specialty);
      });
      
      setDoctors(doctorsData);
      setSpecialties(['All Specialties', ...Array.from(specialtySet)]);
      setLoading(false);
      
      // Check if there's a department parameter from URL
      const departmentParam = searchParams.get('department');
      if (departmentParam) {
        // Map department names to specialty names
        const departmentToSpecialty: { [key: string]: string } = {
          'Cardiology': 'Cardiologist',
          'Neurology': 'Neurologist', 
          'Pediatrics': 'Pediatrician',
          'Orthopedics': 'Orthopedic Surgeon',
          'Oncology': 'Oncologist',
          'Emergency Care': 'Emergency Medicine'
        };
        
        const mappedSpecialty = departmentToSpecialty[departmentParam] || departmentParam;
        if (specialtySet.has(mappedSpecialty)) {
          setSelectedSpecialty(mappedSpecialty);
        }
      }
    }, (error) => {
      console.error('Error listening to doctors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load doctors. Please refresh the page.',
        variant: 'destructive'
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchParams, toast]);

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
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            Meet our team of experienced healthcare professionals dedicated to providing you with the best possible care.
          </p>
          
          {/* Doctors Count and Live Update Indicator */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {doctors.length} Doctors Available
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <UserCheck className="w-3 h-3 mr-1" />
              Live Updates
            </Badge>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select specialty" />
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DoctorCard
                    name={doctor.name}
                    specialty={doctor.specialty}
                    experience={doctor.experience}
                    rating={doctor.rating}
                    avatar={doctor.avatar}
                    availability={doctor.availability}
                    index={index}
                    doctorId={doctor.id}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
