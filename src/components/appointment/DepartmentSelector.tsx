
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DepartmentSelectorProps {
  value: string;
  onChange: (department: string) => void;
}

const departments = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular care',
    icon: '❤️',
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Brain and nervous system',
    icon: '🧠',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Bone and joint treatments',
    icon: '🦴',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Children\'s healthcare',
    icon: '👶',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'general',
    name: 'General Medicine',
    description: 'Primary healthcare services',
    icon: '🩺',
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'emergency',
    name: 'Emergency Care',
    description: '24/7 urgent medical care',
    icon: '🚨',
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  }
];

export const DepartmentSelector = ({ value, onChange }: DepartmentSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose a Department</h3>
        <p className="text-gray-600">Select the medical specialty you need</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="cursor-pointer"
            onClick={() => onChange(dept.id)}
          >
            <Card className={`border-2 transition-all duration-200 ${
              value === dept.id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : dept.color
            }`}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{dept.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-2">{dept.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                {value === dept.id && (
                  <Badge className="bg-blue-600">Selected</Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
