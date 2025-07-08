import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User, Stethoscope } from 'lucide-react';

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  specialty: z.string().min(2, 'Specialty is required'),
  department: z.string().min(1, 'Please select a department'),
  experience: z.string().min(1, 'Experience is required'),
  education: z.string().min(5, 'Education details are required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  availability: z.string().min(1, 'Availability is required'),
});

type DoctorForm = z.infer<typeof doctorSchema>;

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
  experience: string;
  education: string;
  bio: string;
  availability: string;
  rating: number;
  isActive: boolean;
  createdAt: any;
}

const AdminDoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const departments = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'general', label: 'General Medicine' },
    { value: 'emergency', label: 'Emergency Care' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'dermatology', label: 'Dermatology' }
  ];

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<DoctorForm>({
    resolver: zodResolver(doctorSchema)
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const doctorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      
      // Sort by creation date, newest first
      doctorsData.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
      
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DoctorForm) => {
    setIsSubmitting(true);
    try {
      if (editingDoctor) {
        // Update existing doctor
        await updateDoc(doc(db, 'doctors', editingDoctor.id), {
          ...data,
          updatedAt: serverTimestamp()
        });

        setDoctors(prev => 
          prev.map(doctor => 
            doctor.id === editingDoctor.id 
              ? { ...doctor, ...data }
              : doctor
          )
        );

        toast({
          title: "Success",
          description: "Doctor profile updated successfully",
        });
      } else {
        // Add new doctor
        const docRef = await addDoc(collection(db, 'doctors'), {
          ...data,
          rating: 5, // Default rating
          isActive: true,
          createdAt: serverTimestamp()
        });

        const newDoctor = {
          id: docRef.id,
          ...data,
          rating: 5,
          isActive: true,
          createdAt: new Date()
        } as Doctor;

        setDoctors(prev => [newDoctor, ...prev]);

        toast({
          title: "Success",
          description: "Doctor profile created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingDoctor(null);
      reset();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast({
        title: "Error",
        description: "Failed to save doctor profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    
    // Populate form with doctor data
    Object.keys(doctor).forEach(key => {
      if (key !== 'id' && key !== 'rating' && key !== 'isActive' && key !== 'createdAt') {
        setValue(key as keyof DoctorForm, doctor[key as keyof Doctor] as any);
      }
    });
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'doctors', doctorId));
        setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
        
        toast({
          title: "Success",
          description: "Doctor profile deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting doctor:', error);
        toast({
          title: "Error",
          description: "Failed to delete doctor profile",
          variant: "destructive"
        });
      }
    }
  };

  const toggleStatus = async (doctorId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'doctors', doctorId), {
        isActive: !currentStatus,
        updatedAt: serverTimestamp()
      });

      setDoctors(prev => 
        prev.map(doctor => 
          doctor.id === doctorId 
            ? { ...doctor, isActive: !currentStatus }
            : doctor
        )
      );

      toast({
        title: "Success",
        description: `Doctor ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating doctor status:', error);
      toast({
        title: "Error",
        description: "Failed to update doctor status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditingDoctor(null);
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading doctors...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Management</h1>
          <p className="text-muted-foreground">Manage doctor profiles and information</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={resetForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Doctor
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="Dr. John Doe"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="doctor@hospital.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    {...register('phone')}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialty</label>
                  <Input
                    placeholder="e.g., Cardiologist"
                    {...register('specialty')}
                    className={errors.specialty ? 'border-destructive' : ''}
                  />
                  {errors.specialty && (
                    <p className="text-destructive text-sm">{errors.specialty.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select onValueChange={(value) => setValue('department', value)}>
                  <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-destructive text-sm">{errors.department.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience</label>
                  <Input
                    placeholder="e.g., 15+ years experience"
                    {...register('experience')}
                    className={errors.experience ? 'border-destructive' : ''}
                  />
                  {errors.experience && (
                    <p className="text-destructive text-sm">{errors.experience.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <Input
                    placeholder="e.g., Available Today"
                    {...register('availability')}
                    className={errors.availability ? 'border-destructive' : ''}
                  />
                  {errors.availability && (
                    <p className="text-destructive text-sm">{errors.availability.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Education</label>
                <Input
                  placeholder="e.g., MD - Harvard Medical School"
                  {...register('education')}
                  className={errors.education ? 'border-destructive' : ''}
                />
                {errors.education && (
                  <p className="text-destructive text-sm">{errors.education.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  placeholder="Brief description of the doctor's expertise and approach..."
                  rows={4}
                  {...register('bio')}
                  className={errors.bio ? 'border-destructive' : ''}
                />
                {errors.bio && (
                  <p className="text-destructive text-sm">{errors.bio.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            All Doctors ({doctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No doctors found. Add the first doctor to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell className="capitalize">{doctor.department}</TableCell>
                      <TableCell>{doctor.experience}</TableCell>
                      <TableCell>
                        <Badge
                          variant={doctor.isActive ? "default" : "secondary"}
                          className={doctor.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(doctor)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={doctor.isActive ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleStatus(doctor.id, doctor.isActive)}
                          >
                            {doctor.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doctor.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminDoctorManagement;
