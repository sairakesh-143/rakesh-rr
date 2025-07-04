
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

export const ServiceCard = ({ title, description, icon, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-blue-100">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">{icon}</div>
          <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6 text-center">{description}</p>
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
