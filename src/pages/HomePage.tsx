import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/ui/service-card';
import { DoctorCard } from '@/components/ui/doctor-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import FirebaseTest from '@/components/FirebaseTest';
import { 
  ArrowRight, Heart, Shield, Clock, Users, Calendar, 
  FileText, MessageCircle, Phone, MapPin, Mail,
  Stethoscope, UserCheck, BookOpen, Star
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
  return (
    <div className="min-h-screen">
      {/* Firebase Test - Remove after debugging */}
      <div className="container mx-auto px-4 py-4">
        <FirebaseTest />
      </div>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-blue-500/10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                Your Health, Our
                <span className="text-blue-200"> Priority</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl mb-8 text-blue-100"
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
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                  <Link to="/appointments">
                    <Calendar className="mr-2 w-5 h-5" />
                    Book Appointment
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Quick Access Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">Quick Access</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20" asChild>
                  <Link to="/appointments">
                    <Calendar className="mr-3 w-4 h-4" />
                    Schedule Appointment
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20" asChild>
                  <Link to="/contact">
                    <MessageCircle className="mr-3 w-4 h-4" />
                    Live Chat Support
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20" asChild>
                  <Link to="/contact">
                    <Phone className="mr-3 w-4 h-4" />
                    Emergency Contact
                  </Link>
                </Button>
              </div>
              
              {/* Opening Hours */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="font-medium text-white mb-2">Today's Hours</h4>
                <p className="text-blue-100 text-sm">8:00 AM - 10:00 PM</p>
                <p className="text-blue-200 text-xs mt-1">Emergency: 24/7</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, number: '50,000+', label: 'Patients Served' },
              { icon: Heart, number: '15+', label: 'Specializations' },
              { icon: Shield, number: '99.9%', label: 'Success Rate' },
              { icon: Clock, number: '24/7', label: 'Emergency Care' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6"
              >
                <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services delivered with expertise, compassion, and cutting-edge technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button size="lg" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Experts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of experienced healthcare professionals is dedicated to providing you with the best possible care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" asChild>
              <Link to="/doctors">
                View All Doctors
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>


      {/* Contact & Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact & Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help. Get in touch with us through multiple channels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Emergency Line</h3>
                <p className="text-gray-600 mb-4">24/7 emergency support</p>
                <Badge variant="destructive" className="mb-4">Emergency: 911</Badge>
                <p className="text-gray-600">General: (555) 123-4567</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Instant support online</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">Start Chat</Link>
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contact Form</h3>
                <p className="text-gray-600 mb-4">Send us your enquiries</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">Send Message</Link>
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Hospital Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 bg-gray-50 rounded-2xl p-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Hospital Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">123 Healthcare Street, Medical City, MC 12345</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">info@healthcare.com</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Opening Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-700">8:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday - Sunday</span>
                    <span className="text-gray-700">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-medium">Emergency</span>
                    <span className="text-red-600 font-medium">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Book your appointment today and take the first step towards better health
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
              <Link to="/appointments">
                Book Appointment Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
