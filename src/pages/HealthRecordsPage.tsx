import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Download, Upload, Search, Eye, 
  Calendar, Clock, Activity, Heart 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  type: string;
  doctor: string;
  size?: string;
  status: string;
  userId: string;
}

interface LabResult {
  id: string;
  test: string;
  date: string;
  status: string;
  values: {
    name: string;
    value: string;
    range: string;
    status: string;
  }[];
  userId: string;
}

interface VitalSign {
  id: string;
  date: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  userId: string;
}

const HealthRecordsPage = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHealthRecords = async () => {
      try {
        // Fetch medical records
        const recordsRef = collection(db, 'healthRecords');
        const recordsQuery = query(
          recordsRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const recordsSnapshot = await getDocs(recordsQuery);
        
        const recordsData: MedicalRecord[] = [];
        recordsSnapshot.forEach((doc) => {
          recordsData.push({
            id: doc.id,
            ...doc.data() as MedicalRecord
          });
        });
        
        // Fetch lab results
        const labRef = collection(db, 'labResults');
        const labQuery = query(
          labRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const labSnapshot = await getDocs(labQuery);
        
        const labData: LabResult[] = [];
        labSnapshot.forEach((doc) => {
          labData.push({
            id: doc.id,
            ...doc.data() as LabResult
          });
        });

        // Fetch vital signs
        const vitalsRef = collection(db, 'vitalSigns');
        const vitalsQuery = query(
          vitalsRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const vitalsSnapshot = await getDocs(vitalsQuery);
        
        const vitalsData: VitalSign[] = [];
        vitalsSnapshot.forEach((doc) => {
          vitalsData.push({
            id: doc.id,
            ...doc.data() as VitalSign
          });
        });
        
        setMedicalRecords(recordsData);
        setLabResults(labData);
        setVitalSigns(vitalsData);
      } catch (error) {
        console.error('Error fetching health records:', error);
        toast({
          title: 'Error',
          description: 'Failed to load health records. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [user]);

  const filteredRecords = medicalRecords.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your health records</h1>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Health Records</h1>
          <p className="text-xl text-gray-600">Access and manage your medical information</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="lab">Lab Results</TabsTrigger>
              <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search medical records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Record
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{record.title}</CardTitle>
                                <p className="text-sm text-gray-600">{record.doctor}</p>
                              </div>
                            </div>
                            <Badge variant={record.status === 'Complete' ? 'default' : 'secondary'}>
                              {record.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(record.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {record.type}
                              </span>
                              {record.size && (
                                <span>{record.size}</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No records found</h3>
                    <p className="text-gray-500">Your medical records will appear here once available.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="lab" className="space-y-6">
              <div className="grid gap-4">
                {labResults.length > 0 ? (
                  labResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow-sm"
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{result.test}</CardTitle>
                            <Badge variant={result.status === 'Normal' ? 'default' : 'destructive'}>
                              {result.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {result.values.map((value, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{value.name}</p>
                                  <p className="text-sm text-gray-600">Range: {value.range}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{value.value}</p>
                                  <Badge variant={value.status === 'Normal' ? 'default' : 'destructive'} className="text-xs">
                                    {value.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No lab results found</h3>
                    <p className="text-gray-500">Your lab results will appear here once available.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-6">
              <div className="grid gap-4">
                {vitalSigns.length > 0 ? (
                  vitalSigns.map((vital) => (
                    <motion.div
                      key={vital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow-sm"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Vital Signs
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {new Date(vital.date).toLocaleDateString()}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Blood Pressure</p>
                              <p className="font-semibold text-lg">{vital.bloodPressure}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Heart Rate</p>
                              <p className="font-semibold text-lg">{vital.heartRate}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Temperature</p>
                              <p className="font-semibold text-lg">{vital.temperature}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Weight</p>
                              <p className="font-semibold text-lg">{vital.weight}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Height</p>
                              <p className="font-semibold text-lg">{vital.height}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No vital signs found</h3>
                    <p className="text-gray-500">Your vital signs will appear here once recorded.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default HealthRecordsPage;
