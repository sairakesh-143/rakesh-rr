
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PatientDetailsFormProps {
  data: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    symptoms: string;
  };
  onChange: (data: any) => void;
}

export const PatientDetailsForm = ({ data, onChange }: PatientDetailsFormProps) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Patient Information</h3>
        <p className="text-gray-600">Please provide your contact details</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Full Name *</Label>
              <Input
                id="patientName"
                value={data.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="patientEmail">Email Address *</Label>
              <Input
                id="patientEmail"
                type="email"
                value={data.patientEmail}
                onChange={(e) => handleChange('patientEmail', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="patientPhone">Phone Number *</Label>
            <Input
              id="patientPhone"
              type="tel"
              value={data.patientPhone}
              onChange={(e) => handleChange('patientPhone', e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="symptoms">Symptoms or Reason for Visit</Label>
            <Textarea
              id="symptoms"
              value={data.symptoms}
              onChange={(e) => handleChange('symptoms', e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the appointment"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
