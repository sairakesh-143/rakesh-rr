
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  selectedTime: string;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string) => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export const DateTimeSelector = ({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange 
}: DateTimeSelectorProps) => {
  const [showCalendar, setShowCalendar] = useState(true);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Date & Time</h3>
        <p className="text-gray-600">Choose your preferred appointment slot</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              📅 Select Date
              {selectedDate && (
                <Badge variant="secondary" className="ml-2">
                  {format(selectedDate, 'PPP')}
                </Badge>
              )}
            </h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              disabled={isDateDisabled}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              🕐 Select Time
              {selectedTime && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTime}
                </Badge>
              )}
            </h4>
            
            {!selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                <p>Please select a date first</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time, index) => (
                  <motion.div
                    key={time}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={`w-full ${
                        selectedTime === time 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'hover:bg-blue-50'
                      }`}
                      onClick={() => onTimeChange(time)}
                    >
                      {time}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-green-800 font-medium">
                ✅ Appointment scheduled for {format(selectedDate, 'EEEE, MMMM do, yyyy')} at {selectedTime}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
