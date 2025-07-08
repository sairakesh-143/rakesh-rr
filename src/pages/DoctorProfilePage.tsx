import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, 
  Star, Award, BookOpen, Users, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { useState } from 'react';

// Mock doctor data - in a real app, this would come from a database
const doctorData = {
  'sarah-johnson': {
    id: 'sarah-johnson',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    qualifications: ['MD - Cardiology', 'PhD - Internal Medicine', 'FACC - Fellow of American College of Cardiology'],
    experience: '15+ years',
    rating: 4.9,
    reviewCount: 324,
    avatar: '/api/placeholder/300/300',
    languages: ['English', 'Spanish', 'French'],
    hospitalAffiliations: ['City General Hospital', 'Heart Care Center'],
    bio: `Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating complex cardiovascular conditions. She specializes in interventional cardiology, heart failure management, and preventive cardiology. Dr. Johnson completed her medical degree at Harvard Medical School and her cardiology fellowship at Mayo Clinic.

She is passionate about providing personalized, evidence-based care to her patients and has published over 50 research papers in peer-reviewed journals. Dr. Johnson is also actively involved in medical education and serves as a clinical instructor at the university medical center.`,
    education: [
      { degree: 'MD', institution: 'Harvard Medical School', year: '2005' },
      { degree: 'Residency - Internal Medicine', institution: 'Johns Hopkins Hospital', year: '2008' },
      { degree: 'Fellowship - Cardiology', institution: 'Mayo Clinic', year: '2011' }
    ],
    certifications: [
      'Board Certified - Internal Medicine',
      'Board Certified - Cardiovascular Disease',
      'Fellow of American College of Cardiology (FACC)',
      'Advanced Cardiac Life Support (ACLS)'
    ],
    availability: {
      monday: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
      tuesday: ['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'],
      wednesday: ['10:00 AM', '2:00 PM', '3:00 PM'],
      thursday: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'],
      friday: ['9:00 AM', '1:00 PM', '2:00 PM'],
      saturday: ['10:00 AM', '11:00 AM'],
      sunday: []
    },
    officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM, Saturday: 10:00 AM - 2:00 PM',
    contact: {
      phone: '(555) 123-4567',
      email: 'dr.johnson@healthcare.com',
      address: '123 Medical Plaza, Suite 200, Medical City, MC 12345'
    }
  }
};

const DoctorProfilePage = () => {
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // In a real app, you'd fetch this data based on the doctorId
  const doctor = doctorData[doctorId as keyof typeof doctorData];

  if (!doctor) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
          <Link to="/doctors">
            <Button>Back to Doctors</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getTodayAvailability = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase().slice(0, 3);
    const dayMap: { [key: string]: keyof typeof doctor.availability } = {
      'mon': 'monday',
      'tue': 'tuesday', 
      'wed': 'wednesday',
      'thu': 'thursday',
      'fri': 'friday',
      'sat': 'saturday',
      'sun': 'sunday'
    };
    return doctor.availability[dayMap[today]] || [];
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/doctors" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback className="text-2xl">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {doctor.specialty}
                        </Badge>
                        <span className="text-gray-600">• {doctor.experience}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {doctor.rating} ({doctor.reviewCount} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.languages.map((lang, index) => (
                          <Badge key={index} variant="outline">{lang}</Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button size="lg" asChild>
                          <Link to="/appointments">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    About Dr. {doctor.name.split(' ')[1]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {doctor.bio}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Education & Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {doctor.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {doctor.certifications.map((cert, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Hospital Affiliations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Hospital Affiliations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {doctor.hospitalAffiliations.map((hospital, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {hospital}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Today */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Available Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getTodayAvailability().length > 0 ? (
                      getTodayAvailability().map((time, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                        >
                          {time}
                        </Button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No availability today</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Contact & Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{doctor.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{doctor.contact.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{doctor.contact.address}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-gray-700">Office Hours</p>
                      <p className="text-sm text-gray-600">{doctor.officeHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;