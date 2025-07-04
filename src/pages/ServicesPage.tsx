
import { motion } from 'framer-motion';
import { ServiceCard } from '@/components/ui/service-card';

const services = [
  {
    title: 'Emergency Care',
    description: '24/7 emergency medical services with state-of-the-art facilities and rapid response teams',
    icon: '🚨'
  },
  {
    title: 'Cardiology',
    description: 'Comprehensive heart care including diagnostics, interventional procedures, and cardiac surgery',
    icon: '❤️'
  },
  {
    title: 'Neurology',
    description: 'Expert neurological care for brain, spine, and nervous system conditions',
    icon: '🧠'
  },
  {
    title: 'Pediatrics',
    description: 'Specialized healthcare for infants, children, and adolescents with child-friendly environment',
    icon: '👶'
  },
  {
    title: 'Orthopedics',
    description: 'Advanced bone and joint treatments including sports medicine and joint replacement',
    icon: '🦴'
  },
  {
    title: 'Oncology',
    description: 'Comprehensive cancer care with cutting-edge treatment protocols and support services',
    icon: '🎗️'
  },
  {
    title: 'Radiology',
    description: 'State-of-the-art imaging services including MRI, CT, X-ray, and ultrasound',
    icon: '📡'
  },
  {
    title: 'Laboratory',
    description: 'Full-service laboratory with advanced diagnostic testing and rapid results',
    icon: '🔬'
  },
  {
    title: 'Pharmacy',
    description: 'Complete pharmacy services with medication management and counseling',
    icon: '💊'
  }
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive healthcare services delivered with expertise, compassion, and cutting-edge technology. 
            We provide specialized care across multiple medical disciplines to meet all your health needs.
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
      </div>
    </div>
  );
};

export default ServicesPage;
