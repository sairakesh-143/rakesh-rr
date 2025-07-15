import { motion } from 'framer-motion';
import { DoctorCard } from '@/components/ui/doctor-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Stethoscope, Clock, Star, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  department?: string;
  consultationFee?: number;
  languages?: string[];
  achievements?: string[];
}

const DoctorsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>(['All Specialties']);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    availableToday: 0,
    avgRating: 0,
    departments: 0
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const doctorsRef = collection(db, 'doctors');
        const activeQuery = query(doctorsRef, where('isActive', '==', true));
        const doctorsSnapshot = await getDocs(activeQuery);
        
        const doctorsData: Doctor[] = [];
        const specialtySet = new Set<string>();
        const departmentSet = new Set<string>();
        let totalRating = 0;
        let availableCount = 0;
        
        doctorsSnapshot.forEach((doc) => {
          const data = doc.data() as Doctor;
          const doctorData = {
            id: doc.id,
            ...data
          };
          doctorsData.push(doctorData);
          specialtySet.add(data.specialty);
          if (data.department) departmentSet.add(data.department);
          totalRating += data.rating || 0;
          if (data.availability === 'Available') availableCount++;
        });
        
        setDoctors(doctorsData);
        setSpecialties(['All Specialties', ...Array.from(specialtySet)]);
        
        // Update stats
        setStats({
          totalDoctors: doctorsData.length,
          availableToday: availableCount,
          avgRating: doctorsData.length > 0 ? totalRating / doctorsData.length : 0,
          departments: departmentSet.size
        });
        
        // Check if there's a department parameter from URL
        const departmentParam = searchParams.get('department');
        if (departmentParam) {
          const departmentToSpecialty: { [key: string]: string } = {
            'Cardiology': 'Cardiologist',
            'Neurology': 'Neurologist', 
            'Pediatrics': 'Pediatrician',
            'Orthopedics': 'Orthopedic Surgeon',
            'Oncology': 'Oncologist',
            'Emergency Care': 'Emergency Medicine',
            'General Medicine': 'General Practitioner'
          };
          
          const mappedSpecialty = departmentToSpecialty[departmentParam] || departmentParam;
          if (specialtySet.has(mappedSpecialty)) {
            setSelectedSpecialty(mappedSpecialty);
          }
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: 'Error',
          description: 'Failed to load doctors. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchParams]);

  const filteredDoctors = doctors
    .filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (doctor.education && doctor.education.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
      const matchesAvailability = selectedAvailability === 'All' || doctor.availability === selectedAvailability;
      return matchesSearch && matchesSpecialty && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All Specialties');
    setSelectedAvailability('All');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm !== '' || selectedSpecialty !== 'All Specialties' || selectedAvailability !== 'All';

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Expert Medical Team
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Meet our team of experienced healthcare professionals dedicated to providing you with the best possible care.
            Our doctors are specialists in their fields with years of experience and cutting-edge expertise.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalDoctors}</div>
              <div className="text-sm text-gray-600">Total Doctors</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.availableToday}</div>
              <div className="text-sm text-gray-600">Available Today</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.avgRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Stethoscope className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.departments}</div>
              <div className="text-sm text-gray-600">Departments</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search doctors by name, specialty, or education..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="h-12 px-6"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
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

                <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Availability</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: {searchTerm}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                      </Badge>
                    )}
                    {selectedSpecialty !== 'All Specialties' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedSpecialty}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSpecialty('All Specialties')} />
                      </Badge>
                    )}
                    {selectedAvailability !== 'All' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedAvailability}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAvailability('All')} />
                      </Badge>
                    )}
                  </div>
                  <Button onClick={clearAllFilters} variant="ghost" size="sm">
                    Clear All
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-600 text-center">
            Showing <span className="font-semibold">{filteredDoctors.length}</span> of <span className="font-semibold">{doctors.length}</span> doctors
            {selectedSpecialty !== 'All Specialties' && ` in ${selectedSpecialty}`}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600">Loading doctors...</span>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
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
              <div className="col-span-full">
                <Card className="text-center py-16">
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <Users className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No doctors found</h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your search criteria or filters to find doctors.
                      </p>
                      <Button onClick={clearAllFilters} variant="outline">
                        Clear All Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* Call to Action */}
        {!loading && filteredDoctors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-4">Need Help Choosing the Right Doctor?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Our patient care coordinators are available 24/7 to help you find the right specialist for your needs.
                  Get personalized recommendations based on your health requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-blue-600">
                    📞 Call (555) 123-4567
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    💬 Live Chat Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
