import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, Plus, Edit, Trash2, Search, Users, UserPlus, CheckCircle, Star } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: string;
  email: string;
  phone: string;
  education: string;
  certifications: string;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  rating: number;
  consultationFee: number;
  status: 'active' | 'inactive' | 'on-leave';
  joinedDate: any;
}

const departments = [
  'cardiology',
  'neurology', 
  'orthopedics',
  'pediatrics',
  'general',
  'emergency'
];

const departmentNames: Record<string, string> = {
  cardiology: 'Cardiology',
  neurology: 'Neurology',
  orthopedics: 'Orthopedics',
  pediatrics: 'Pediatrics',
  general: 'General Medicine',
  emergency: 'Emergency Care'
};

const AdminDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    department: '',
    experience: '',
    email: '',
    phone: '',
    education: '',
    certifications: '',
    schedule: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Off'
    },
    rating: 4.5,
    consultationFee: 100,
    status: 'active' as 'active' | 'inactive' | 'on-leave'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set up real-time listener for doctors
    const doctorsRef = collection(db, 'doctors');
    const q = query(doctorsRef, orderBy('joinedDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const doctorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      
      setDoctors(doctorsData);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors data",
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentNames[doctor.department]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm]);

  const handleAddDoctor = async () => {
    try {
      const doctorData = {
        ...formData,
        joinedDate: new Date(),
        isActive: true,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2563eb&color=fff&size=200`,
        availability: "Available",
        department: formData.department || 'general',
        specialty: formData.specialty || 'General Medicine'
      };

      await addDoc(collection(db, 'doctors'), doctorData);

      toast({
        title: "Success",
        description: `Dr. ${formData.name} added successfully and is now visible to patients`,
        duration: 3000
      });

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast({
        title: "Error",
        description: "Failed to add doctor",
        variant: "destructive"
      });
    }
  };

  const handleEditDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      const updatedData = {
        ...formData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2563eb&color=fff&size=200`,
        availability: formData.status === 'active' ? 'Available' : 'Unavailable',
        isActive: formData.status === 'active'
      };

      await updateDoc(doc(db, 'doctors', selectedDoctor.id), updatedData);

      toast({
        title: "Success",
        description: `Dr. ${formData.name} updated successfully`,
        duration: 3000
      });

      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast({
        title: "Error",
        description: "Failed to update doctor",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDoctor = async (doctorId: string, doctorName: string) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone.`)) return;

    try {
      await deleteDoc(doc(db, 'doctors', doctorId));

      toast({
        title: "Success",
        description: `Dr. ${doctorName} deleted successfully`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      department: '',
      experience: '',
      email: '',
      phone: '',
      education: '',
      certifications: '',
      schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Off'
      },
      rating: 4.5,
      consultationFee: 100,
      status: 'active'
    });
    setSelectedDoctor(null);
  };

  const handleEditClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      department: doctor.department,
      experience: doctor.experience,
      email: doctor.email,
      phone: doctor.phone,
      education: doctor.education,
      certifications: doctor.certifications,
      schedule: doctor.schedule,
      rating: doctor.rating,
      consultationFee: doctor.consultationFee,
      status: doctor.status
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>
          <p className="text-gray-600">Manage doctor profiles, schedules, and specializations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{doctors.length} Total Doctors</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>{doctors.filter(d => d.status === 'active').length} Active</span>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {departmentNames[dept]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="fee">Consultation Fee</Label>
                  <Input
                    id="fee"
                    type="number"
                    min="0"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({...formData, consultationFee: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'inactive' | 'on-leave'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDoctor}>Add Doctor</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search doctors by name, specialty, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Doctors ({filteredDoctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.education}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{departmentNames[doctor.department]}</TableCell>
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{doctor.email}</div>
                        <div className="text-gray-500">{doctor.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {doctor.rating}
                      </div>
                    </TableCell>
                    <TableCell>${doctor.consultationFee}</TableCell>
                    <TableCell>
                      <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'}>
                        {doctor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditClick(doctor)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-specialty">Specialty</Label>
              <Input
                id="edit-specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {departmentNames[dept]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-experience">Experience</Label>
              <Input
                id="edit-experience"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-education">Education</Label>
              <Input
                id="edit-education"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-certifications">Certifications</Label>
              <Input
                id="edit-certifications"
                value={formData.certifications}
                onChange={(e) => setFormData({...formData, certifications: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-rating">Rating</Label>
              <Input
                id="edit-rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="edit-fee">Consultation Fee</Label>
              <Input
                id="edit-fee"
                type="number"
                min="0"
                value={formData.consultationFee}
                onChange={(e) => setFormData({...formData, consultationFee: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'inactive' | 'on-leave'})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditDoctor}>Update Doctor</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDoctors;