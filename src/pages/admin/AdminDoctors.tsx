import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, Plus, Edit, Trash2, Calendar, Clock, Star, Search } from 'lucide-react';

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

const AdminDoctors = () => {
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
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentNames[doctor.department]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm]);

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const doctorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      
      doctorsData.sort((a, b) => b.joinedDate?.toDate() - a.joinedDate?.toDate());
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

  const handleAddDoctor = async () => {
    try {
      await addDoc(collection(db, 'doctors'), {
        ...formData,
        joinedDate: new Date()
      });

      toast({
        title: "Success",
        description: "Doctor added successfully"
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
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
      await updateDoc(doc(db, 'doctors', selectedDoctor.id), formData);

      toast({
        title: "Success",
        description: "Doctor updated successfully"
      });

      setIsEditDialogOpen(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update doctor",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await deleteDoc(doc(db, 'doctors', doctorId));

      toast({
        title: "Success",
        description: "Doctor deleted successfully"
      });

      fetchDoctors();
    } catch (error) {
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

  const openEditDialog = (doctor: Doctor) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'on-leave':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>
          <p className="text-gray-600">Manage doctor profiles, schedules, and specializations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
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
                  placeholder="e.g., 10+ years"
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
                <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({...formData, consultationFee: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'on-leave') => setFormData({...formData, status: value})}>
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
              <div className="col-span-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  placeholder="Medical degrees and institutions"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  placeholder="Board certifications and licenses"
                />
              </div>
              
              {/* Schedule */}
              <div className="col-span-2">
                <Label className="text-lg font-semibold">Weekly Schedule</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(formData.schedule).map(([day, time]) => (
                    <div key={day}>
                      <Label htmlFor={day} className="capitalize">{day}</Label>
                      <Input
                        id={day}
                        value={time}
                        onChange={(e) => setFormData({
                          ...formData,
                          schedule: { ...formData.schedule, [day]: e.target.value }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDoctor}>Add Doctor</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  <TableHead>Department</TableHead>
                  <TableHead>Experience</TableHead>
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
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.specialty}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {departmentNames[doctor.department]}
                      </Badge>
                    </TableCell>
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        {doctor.rating}
                      </div>
                    </TableCell>
                    <TableCell>${doctor.consultationFee}</TableCell>
                    <TableCell>
                      {getStatusBadge(doctor.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(doctor)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteDoctor(doctor.id)}
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
          {filteredDoctors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No doctors found
            </div>
          )}
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
              <Label htmlFor="editName">Full Name</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editSpecialty">Specialty</Label>
              <Input
                id="editSpecialty"
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editDepartment">Department</Label>
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
              <Label htmlFor="editExperience">Experience</Label>
              <Input
                id="editExperience"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editPhone">Phone</Label>
              <Input
                id="editPhone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editConsultationFee">Consultation Fee ($)</Label>
              <Input
                id="editConsultationFee"
                type="number"
                value={formData.consultationFee}
                onChange={(e) => setFormData({...formData, consultationFee: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="editStatus">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'on-leave') => setFormData({...formData, status: value})}>
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
            <div className="col-span-2">
              <Label htmlFor="editEducation">Education</Label>
              <Textarea
                id="editEducation"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="editCertifications">Certifications</Label>
              <Textarea
                id="editCertifications"
                value={formData.certifications}
                onChange={(e) => setFormData({...formData, certifications: e.target.value})}
              />
            </div>
            
            {/* Schedule */}
            <div className="col-span-2">
              <Label className="text-lg font-semibold">Weekly Schedule</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Object.entries(formData.schedule).map(([day, time]) => (
                  <div key={day}>
                    <Label htmlFor={`edit${day}`} className="capitalize">{day}</Label>
                    <Input
                      id={`edit${day}`}
                      value={time}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule, [day]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>
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