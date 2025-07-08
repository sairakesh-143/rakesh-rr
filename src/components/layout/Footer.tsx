
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">CareHub</h3>
            <p className="text-gray-300 mb-4">
              Providing world-class healthcare services with compassion and excellence.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full flex items-center justify-center">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full flex items-center justify-center">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full flex items-center justify-center">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link to="/doctors" className="text-gray-300 hover:text-blue-400 transition-colors">Find a Doctor</Link></li>
              <li><Link to="/appointments" className="text-gray-300 hover:text-blue-400 transition-colors">Book Appointment</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Patient Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/my-appointments" className="text-gray-300 hover:text-blue-400 transition-colors">My Appointments</Link></li>
              <li><Link to="/health-records" className="text-gray-300 hover:text-blue-400 transition-colors">Health Records</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-blue-400 transition-colors">My Profile</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-blue-400 transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Departments</h4>
            <ul className="space-y-2">
              <li><Link to="/services#cardiology" className="text-gray-300 hover:text-blue-400 transition-colors">Cardiology</Link></li>
              <li><Link to="/services#neurology" className="text-gray-300 hover:text-blue-400 transition-colors">Neurology</Link></li>
              <li><Link to="/services#orthopedics" className="text-gray-300 hover:text-blue-400 transition-colors">Orthopedics</Link></li>
              <li><Link to="/services#pediatrics" className="text-gray-300 hover:text-blue-400 transition-colors">Pediatrics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <a href="https://maps.google.com/?q=123+Healthcare+St,+Medical+City" target="_blank" rel="noopener noreferrer" className="flex hover:text-blue-400 transition-colors">
                <span>📍 123 Healthcare St, Medical City</span>
              </a>
              <a href="tel:+15551234567" className="flex hover:text-blue-400 transition-colors">
                <span>📞 +1 (555) 123-4567</span>
              </a>
              <a href="mailto:info@carehub.com" className="flex hover:text-blue-400 transition-colors">
                <span>✉️ info@carehub.com</span>
              </a>
              <Link to="/contact" className="flex hover:text-blue-400 transition-colors">
                <span>🕐 24/7 Emergency Care</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} <Link to="/" className="hover:text-blue-400 transition-colors">CareHub Hospital</Link>. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};
