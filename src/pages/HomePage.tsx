import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/ui/service-card';
import { DoctorCard } from '@/components/ui/doctor-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Heart, Shield, Clock, Users, Calendar, 
  FileText, MessageCircle, Phone, MapPin, Mail,
  Stethoscope, UserCheck, BookOpen, Star, ChevronRight
} from 'lucide-react';

const services = [
  {
    title: 'Emergency Care',
    description: '24/7 emergency medical services with state-of-the-art facilities',
    icon: '🚨'
  },
  {
    title: 'Cardiology',
    description: 'Comprehensive heart care with advanced diagnostic and treatment options',
    icon: '❤️'
  },
  {
    title: 'Neurology',
    description: 'Expert neurological care for brain and nervous system conditions',
    icon: '🧠'
  },
  {
    title: 'Pediatrics',
    description: 'Specialized healthcare for infants, children, and adolescents',
    icon: '👶'
  },
  {
    title: 'Orthopedics',
    description: 'Advanced bone and joint treatments with minimally invasive procedures',
    icon: '🦴'
  },
  {
    title: 'Oncology',
    description: 'Comprehensive cancer care with cutting-edge treatment protocols',
    icon: '🎗️'
  }
];

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
  }
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleDepartmentClick = (department: string) => {
    navigate(`/doctors?department=${encodeURIComponent(department)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Redesigned */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-28 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.07 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-blue-800/30 to-transparent"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="inline-block bg-blue-500/20 backdrop-blur-sm px-4 py-1 rounded-full mb-6"
              >
                <span className="text-blue-100 text-sm font-medium tracking-wide">Trusted Healthcare Since 1995</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Your Health, Our
                <span className="text-blue-200 block md:inline"> Priority</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl mb-8 text-blue-100 leading-relaxed max-w-xl"
              >
                Experience world-class healthcare with compassionate care, 
                cutting-edge technology, and expert medical professionals.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link to="/appointments">
                    <Calendar className="mr-2 w-5 h-5" />
                    Book Appointment
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 transition-all duration-300" asChild>
                  <Link to="/services">
                    <Stethoscope className="mr-2 w-5 h-5" />
                    Our Services
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Quick Access Panel - Redesigned */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">Quick Access</h3>
              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/20 transition-all duration-300 py-3 pl-4" asChild>
                  <Link to="/appointments">
                    <div className="flex items-center">
                      <Calendar className="mr-3 w-5 h-5 text-blue-200" />
                      <span>Schedule Appointment</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-75" />
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/20 transition-all duration-300 py-3 pl-4" asChild>
                  <Link to="/contact">
                    <div className="flex items-center">
                      <MessageCircle className="mr-3 w-5 h-5 text-green-200" />
                      <span>Live Chat Support</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-75" />
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/20 transition-all duration-300 py-3 pl-4" asChild>
                  <Link to="/contact">
                    <div className="flex items-center">
                      <Phone className="mr-3 w-5 h-5 text-red-200" />
                      <span>Emergency Contact</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-75" />
                  </Link>
                </Button>
              </div>
              
              {/* Opening Hours - Redesigned */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h4 className="font-medium text-white mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-200" />
                  Today's Hours
                </h4>
                <p className="text-blue-100 text-sm font-medium">8:00 AM - 10:00 PM</p>
                <div className="flex items-center mt-2">
                  <Badge variant="outline" className="text-red-200 border-red-200 bg-red-500/10">
                    Emergency: 24/7
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats - Redesigned */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                icon: Users, 
                number: '50,000+', 
                label: 'Patients Served', 
                color: 'blue',
                description: 'Satisfied patients who trust our care' 
              },
              { 
                icon: Heart, 
                number: '15+', 
                label: 'Specializations', 
                color: 'red',
                description: 'Expert departments covering all medical fields' 
              },
              { 
                icon: Shield, 
                number: '99.9%', 
                label: 'Success Rate', 
                color: 'green',
                description: 'Procedures with positive outcomes' 
              },
              { 
                icon: Clock, 
                number: '24/7', 
                label: 'Emergency Care', 
                color: 'amber',
                description: 'Round-the-clock emergency medical services' 
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 relative group"
              >
                <div className={`absolute inset-0 bg-${stat.color}-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                  <p className="text-lg font-medium text-gray-700 mb-2">{stat.label}</p>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Redesigned */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-medium tracking-wide">Our Medical Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Comprehensive Healthcare Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Expert medical care delivered with state-of-the-art technology, compassion, and a patient-centered approach
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  index={index}
                  onLearnMore={() => handleDepartmentClick(service.title)}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-xl transition-all duration-300" asChild>
              <Link to="/services">
                Explore All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Doctors - Redesigned */}
      <section className="py-24 bg-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white to-transparent"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-medium tracking-wide">Our Medical Experts</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Meet Our Specialists</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our team of board-certified healthcare professionals is dedicated to providing you with exceptional care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DoctorCard
                  name={doctor.name}
                  specialty={doctor.specialty}
                  experience={doctor.experience}
                  rating={doctor.rating}
                  avatar={doctor.avatar}
                  availability={doctor.availability}
                  doctorId={doctor.id}
                  index={index}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300" asChild>
              <Link to="/doctors">
                View All Specialists
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>


      {/* Contact & Support - Redesigned */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-medium tracking-wide">24/7 Support</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Contact & Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're here to help. Get in touch with our team through multiple channels for assistance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
                <div className="mb-6 w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                  <Phone className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Emergency Line</CardTitle>
                <p className="text-gray-600 mb-6">24/7 emergency medical support available</p>
                <Badge variant="destructive" className="mb-4 py-1 px-3 text-base">Emergency: 911</Badge>
                <p className="text-gray-600 font-medium">General: (555) 123-4567</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-600"></div>
                <div className="mb-6 w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Live Chat</CardTitle>
                <p className="text-gray-600 mb-6">Instant online support for your questions</p>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50" asChild>
                  <Link to="/contact">
                    Start Chat
                    <MessageCircle className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600"></div>
                <div className="mb-6 w-20 h-20 mx-auto rounded-full bg-purple-50 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Contact Form</CardTitle>
                <p className="text-gray-600 mb-6">Send us your inquiries and feedback</p>
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50" asChild>
                  <Link to="/contact">
                    Send Message
                    <Mail className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Hospital Information - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 bg-gray-50 rounded-2xl p-10 shadow-md"
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                  Hospital Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="min-w-[40px] h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="text-gray-700 font-medium">123 Healthcare Street, Medical City, MC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="min-w-[40px] h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-700 font-medium">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="min-w-[40px] h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-gray-700 font-medium">info@healthcare.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 mr-2" />
                  Opening Hours
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-100 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600 font-medium">Monday - Friday</p>
                        <p className="text-sm text-gray-500">Weekdays</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700 font-bold">8:00 AM - 10:00 PM</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-100 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600 font-medium">Saturday - Sunday</p>
                        <p className="text-sm text-gray-500">Weekends</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700 font-bold">9:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-red-100 bg-red-50 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 font-medium">Emergency</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600 font-bold">24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-24 bg-gradient-to-br from-blue-700 to-blue-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full bg-blue-400"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute -left-40 -bottom-40 w-[600px] h-[600px] rounded-full bg-blue-500"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="border-blue-300 text-blue-100 mb-6 py-1.5 px-4 text-base">Schedule Today</Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Ready to Experience Better Healthcare?</h2>
              <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
                Book your appointment today and take the first step towards improved health and wellness with our expert team
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link to="/appointments">
                    <Calendar className="mr-3 w-5 h-5" />
                    Book Appointment Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg py-6 px-8 transition-all duration-300" asChild>
                  <Link to="/contact">
                    <Phone className="mr-3 w-5 h-5" />
                    Call Us
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-10">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-200 mr-2" />
                  <span className="text-blue-100">Certified Doctors</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-200 mr-2" />
                  <span className="text-blue-100">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-blue-200 mr-2" />
                  <span className="text-blue-100">Top-Rated Care</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
