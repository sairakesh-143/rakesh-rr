
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">FB</span>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">TW</span>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">IG</span>
              </div>
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
            <h4 className="text-lg font-semibold mb-4">Patient Portal</h4>
            <ul className="space-y-2">
              <li><Link to="/patient-portal" className="text-gray-300 hover:text-blue-400 transition-colors">Portal Home</Link></li>
              <li><Link to="/health-records" className="text-gray-300 hover:text-blue-400 transition-colors">Health Records</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-blue-400 transition-colors">My Profile</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-blue-400 transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Departments</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Cardiology</li>
              <li className="text-gray-300">Neurology</li>
              <li className="text-gray-300">Orthopedics</li>
              <li className="text-gray-300">Pediatrics</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>📍 123 Healthcare St, Medical City</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@carehub.com</p>
              <p>🕐 24/7 Emergency Care</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CareHub Hospital. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};
