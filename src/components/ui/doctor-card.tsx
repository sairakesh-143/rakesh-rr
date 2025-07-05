import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, UserRound, Clock } from 'lucide-react';
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

export const DoctorCard = ({ name, specialty, experience, rating, avatar, index, doctorId, availability }: DoctorCardProps) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/appointments');
  };

  const handleViewProfile = () => {
    if (doctorId) {
      navigate(`/doctors/${doctorId}`);
    }
  };

  const isAvailableToday = availability.toLowerCase().includes('today');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        {isAvailableToday && (
          <Badge 
            className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 px-3 py-1.5 z-10"
          >
            Available Today
          </Badge>
        )}
        
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        <CardHeader className="text-center pt-16 pb-4 relative">
          <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-white shadow-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
          <Badge variant="secondary" className="mx-auto bg-blue-100 text-blue-700 hover:bg-blue-200">{specialty}</Badge>
        </CardHeader>
        
        <CardContent className="text-center pb-4 space-y-4">
          <div className="flex items-center justify-center text-gray-600">
            <UserRound className="w-4 h-4 mr-2 text-blue-500" />
            <p>{experience}</p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2 font-medium">({rating}/5)</span>
          </div>
          
          {!isAvailableToday && (
            <div className="flex items-center justify-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              <p className="text-sm font-medium text-orange-600">{availability}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-2 pb-5 px-5 border-t border-gray-100">
          <Button 
            variant="outline" 
            className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleBookAppointment}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
