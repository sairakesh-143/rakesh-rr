import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart3, Calendar, Download, TrendingUp, Users, Clock, DollarSign, Activity } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, isWithinInterval, parseISO } from 'date-fns';

interface ReportData {
  dailyAppointments: { date: string; count: number; revenue: number }[];
  departmentUtilization: { department: string; appointments: number; utilization: number }[];
  doctorPerformance: { doctor: string; appointments: number; rating: number; revenue: number }[];
  patientStats: { newPatients: number; totalPatients: number; returningPatients: number };
  revenueStats: { total: number; thisMonth: number; lastMonth: number; growth: number };
}

const AdminReports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('this-month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departmentNames: Record<string, string> = {
    all: 'All Departments',
    cardiology: 'Cardiology',
    neurology: 'Neurology',
    orthopedics: 'Orthopedics',
    pediatrics: 'Pediatrics',
    general: 'General Medicine',
    emergency: 'Emergency Care'
  };

  useEffect(() => {
    generateReports();
  }, [dateRange, selectedDepartment]);

  const generateReports = async () => {
    setLoading(true);
    try {
      const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
      const appointments = appointmentsSnapshot.docs.map(doc => doc.data());

      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      const patients = patientsSnapshot.docs.map(doc => doc.data());

      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      const doctors = doctorsSnapshot.docs.map(doc => doc.data());

      // Filter appointments by date range
      const now = new Date();
      let startDate: Date, endDate: Date;

      switch (dateRange) {
        case 'today':
          startDate = endDate = now;
          break;
        case 'this-week':
          startDate = startOfWeek(now);
          endDate = endOfWeek(now);
          break;
        case 'this-month':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case 'last-7-days':
          startDate = subDays(now, 7);
          endDate = now;
          break;
        default:
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
      }

      const filteredAppointments = appointments.filter(apt => {
        if (!apt.date) return false;
        const aptDate = new Date(apt.date);
        return isWithinInterval(aptDate, { start: startDate, end: endDate });
      });

      // Generate daily appointments data
      const dailyStats = new Map<string, { count: number; revenue: number }>();
      filteredAppointments.forEach(apt => {
        const date = format(new Date(apt.date), 'yyyy-MM-dd');
        const existing = dailyStats.get(date) || { count: 0, revenue: 0 };
        dailyStats.set(date, {
          count: existing.count + 1,
          revenue: existing.revenue + (100) // Assuming $100 per appointment
        });
      });

      const dailyAppointments = Array.from(dailyStats.entries()).map(([date, stats]) => ({
        date,
        count: stats.count,
        revenue: stats.revenue
      })).sort((a, b) => a.date.localeCompare(b.date));

      // Generate department utilization
      const departmentStats = new Map<string, number>();
      filteredAppointments.forEach(apt => {
        if (selectedDepartment === 'all' || apt.department === selectedDepartment) {
          departmentStats.set(apt.department, (departmentStats.get(apt.department) || 0) + 1);
        }
      });

      const departmentUtilization = Array.from(departmentStats.entries()).map(([dept, count]) => ({
        department: departmentNames[dept] || dept,
        appointments: count,
        utilization: Math.min(100, (count / 10) * 100) // Assuming 10 appointments = 100% utilization
      }));

      // Generate doctor performance
      const doctorStats = new Map<string, { appointments: number; revenue: number }>();
      filteredAppointments.forEach(apt => {
        const existing = doctorStats.get(apt.doctor) || { appointments: 0, revenue: 0 };
        doctorStats.set(apt.doctor, {
          appointments: existing.appointments + 1,
          revenue: existing.revenue + 100
        });
      });

      const doctorPerformance = Array.from(doctorStats.entries()).map(([doctor, stats]) => ({
        doctor: doctor.replace('dr-', 'Dr. ').replace('-', ' '),
        appointments: stats.appointments,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        revenue: stats.revenue
      }));

      // Calculate patient stats
      const totalRevenue = dailyAppointments.reduce((sum, day) => sum + day.revenue, 0);
      const thisMonthStart = startOfMonth(now);
      const lastMonthStart = startOfMonth(subDays(thisMonthStart, 1));
      const lastMonthEnd = subDays(thisMonthStart, 1);

      const thisMonthAppointments = appointments.filter(apt => 
        apt.date && isWithinInterval(new Date(apt.date), { start: thisMonthStart, end: now })
      );
      const lastMonthAppointments = appointments.filter(apt => 
        apt.date && isWithinInterval(new Date(apt.date), { start: lastMonthStart, end: lastMonthEnd })
      );

      const thisMonthRevenue = thisMonthAppointments.length * 100;
      const lastMonthRevenue = lastMonthAppointments.length * 100;
      const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      setReportData({
        dailyAppointments,
        departmentUtilization,
        doctorPerformance,
        patientStats: {
          newPatients: patients.length,
          totalPatients: patients.length,
          returningPatients: Math.floor(patients.length * 0.3)
        },
        revenueStats: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth
        }
      });
    } catch (error) {
      console.error('Error generating reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Report Generated: " + format(new Date(), 'PPP') + "\n\n"
      + "Daily Appointments\n"
      + "Date,Appointments,Revenue\n"
      + reportData.dailyAppointments.map(row => `${row.date},${row.count},${row.revenue}`).join("\n")
      + "\n\nDepartment Utilization\n"
      + "Department,Appointments,Utilization %\n"
      + reportData.departmentUtilization.map(row => `${row.department},${row.appointments},${row.utilization}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Generating reports...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">No data available for reports</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into hospital operations</p>
        </div>
        <div className="flex space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(departmentNames).map(([key, name]) => (
                <SelectItem key={key} value={key}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${reportData.revenueStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              {reportData.revenueStats.growth > 0 ? '+' : ''}{reportData.revenueStats.growth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData.patientStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.patientStats.newPatients} new this period
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {reportData.dailyAppointments.reduce((sum, day) => sum + day.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(reportData.departmentUtilization.reduce((sum, dept) => sum + dept.utilization, 0) / reportData.departmentUtilization.length || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Daily Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.dailyAppointments.slice(-7).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{format(new Date(day.date), 'MMM dd')}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{day.count} appointments</span>
                    <Badge variant="outline">${day.revenue}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Department Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.departmentUtilization.map((dept, index) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{dept.appointments} appointments</span>
                      <Badge variant="secondary">{Math.round(dept.utilization)}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        dept.utilization >= 80 ? 'bg-green-500' :
                        dept.utilization >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, dept.utilization)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Doctor Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Doctor</th>
                  <th className="text-left py-2">Appointments</th>
                  <th className="text-left py-2">Rating</th>
                  <th className="text-left py-2">Revenue</th>
                  <th className="text-left py-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {reportData.doctorPerformance.slice(0, 10).map((doctor, index) => (
                  <tr key={doctor.doctor} className="border-b">
                    <td className="py-3">
                      <div className="font-medium">{doctor.doctor}</div>
                    </td>
                    <td className="py-3">{doctor.appointments}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <span className="text-sm">{doctor.rating.toFixed(1)}</span>
                        <div className="flex ml-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >★</div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">${doctor.revenue.toLocaleString()}</td>
                    <td className="py-3">
                      <Badge variant={
                        doctor.appointments >= 10 ? 'default' :
                        doctor.appointments >= 5 ? 'secondary' : 'outline'
                      }>
                        {doctor.appointments >= 10 ? 'Excellent' :
                         doctor.appointments >= 5 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;