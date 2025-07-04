
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DoctorCardProps {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  avatar: string;
  availability: string;
  index: number;
  doctorId?: string;
}

export const DoctorCard = ({ name, specialty, experience, rating, avatar, availability, index, doctorId }: DoctorCardProps) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/appointments');
  };

  const handleViewProfile = () => {
    if (doctorId) {
      navigate(`/doctors/${doctorId}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-blue-100">
        <CardHeader className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          <Badge variant="secondary" className="mx-auto">{specialty}</Badge>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-gray-600">{experience}</p>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
          </div>
          <p className="text-sm text-green-600 font-medium">{availability}</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={handleViewProfile}>
              View Profile
            </Button>
            <Button className="flex-1" onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
