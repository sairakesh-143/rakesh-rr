
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
  onLearnMore?: () => void;
}

export const ServiceCard = ({ title, description, icon, index, onLearnMore }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card className="h-full relative group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="absolute w-1.5 h-full bg-blue-500 left-0 top-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        <div className="absolute bottom-0 h-1 w-full bg-blue-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 rounded-full bg-blue-50 mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
            <span className="text-4xl">{icon}</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-8">{description}</p>
          <Button 
            variant="ghost" 
            className="text-blue-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-300 hover:translate-x-1"
            onClick={onLearnMore}
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
