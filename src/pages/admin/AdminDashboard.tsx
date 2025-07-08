
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, CheckCircle, Stethoscope, BarChart3, Bell, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedToday: 0,
    totalPatients: 0,
    totalDoctors: 8,
    departmentUtilization: 85
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch appointments
      const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
      const appointments = appointmentsSnapshot.docs.map(doc => doc.data());
      
      const totalAppointments = appointments.length;
      const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      const confirmedToday = appointments.filter(apt => 
        apt.status === 'confirmed' && apt.date?.startsWith(today)
      ).length;

      // Get unique patients count
      const uniquePatients = new Set(appointments.map(apt => apt.patientEmail)).size;

      setStats(prev => ({
        ...prev,
        totalAppointments,
        pendingAppointments,
        confirmedToday,
        totalPatients: uniquePatients
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Review Appointments',
      description: 'Check and confirm pending appointments',
      icon: Calendar,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      action: () => navigate('/admin/appointments')
    },
    {
      title: 'Manage Patients',
      description: 'View and manage patient records',
      icon: Users,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      action: () => navigate('/admin/patients')
    },
    {
      title: 'Doctor Schedules',
      description: 'Update doctor schedules and availability',
      icon: Stethoscope,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      action: () => navigate('/admin/doctors')
    },
    {
      title: 'View Analytics',
      description: 'Generate reports and view analytics',
      icon: BarChart3,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      action: () => navigate('/admin/reports')
    },
    {
      title: 'Send Notifications',
      description: 'Manage appointment reminders and alerts',
      icon: Bell,
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      action: () => navigate('/admin/notifications')
    }
  ];

  const recentActivity = [
    { type: 'appointment', message: 'New appointment booked by John Doe', time: '5 minutes ago', status: 'pending' },
    { type: 'patient', message: 'Patient Sarah Johnson updated profile', time: '15 minutes ago', status: 'success' },
    { type: 'doctor', message: 'Dr. Smith updated availability', time: '1 hour ago', status: 'info' },
    { type: 'system', message: 'Daily backup completed successfully', time: '2 hours ago', status: 'success' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedToday}</div>
            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${action.color}`}
              >
                <div className="flex items-center mb-3">
                  <action.icon className="w-6 h-6 mr-3 text-gray-700" />
                  <h3 className="font-semibold text-gray-800">{action.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Activity</Button>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Cardiology', utilization: 92, appointments: 18, color: 'bg-red-500' },
                { name: 'Neurology', utilization: 85, appointments: 12, color: 'bg-purple-500' },
                { name: 'Orthopedics', utilization: 78, appointments: 15, color: 'bg-orange-500' },
                { name: 'Pediatrics', utilization: 88, appointments: 10, color: 'bg-blue-500' },
                { name: 'General Medicine', utilization: 75, appointments: 8, color: 'bg-green-500' }
              ].map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{dept.appointments} appointments</span>
                      <Badge variant="secondary">{dept.utilization}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${dept.color}`}
                      style={{ width: `${dept.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
