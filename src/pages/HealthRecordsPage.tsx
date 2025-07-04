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

const medicalRecords = [
  {
    id: 1,
    title: 'Annual Physical Exam',
    date: '2023-12-10',
    type: 'Report',
    doctor: 'Dr. Emily Davis',
    size: '2.4 MB',
    status: 'Complete'
  },
  {
    id: 2,
    title: 'Cardiac Stress Test',
    date: '2023-11-15',
    type: 'Test Result',
    doctor: 'Dr. Sarah Johnson',
    size: '1.8 MB',
    status: 'Complete'
  },
  {
    id: 3,
    title: 'Blood Work Panel',
    date: '2023-10-20',
    type: 'Lab Result',
    doctor: 'Dr. Michael Chen',
    size: '1.2 MB',
    status: 'Complete'
  }
];

const labResults = [
  {
    id: 1,
    test: 'Complete Blood Count (CBC)',
    date: '2023-12-10',
    status: 'Normal',
    values: [
      { name: 'White Blood Cells', value: '7,200/mcL', range: '4,500-11,000/mcL', status: 'Normal' },
      { name: 'Red Blood Cells', value: '4.8 million/mcL', range: '4.5-5.5 million/mcL', status: 'Normal' },
      { name: 'Hemoglobin', value: '14.2 g/dL', range: '12-16 g/dL', status: 'Normal' },
      { name: 'Platelets', value: '275,000/mcL', range: '150,000-450,000/mcL', status: 'Normal' }
    ]
  },
  {
    id: 2,
    test: 'Lipid Panel',
    date: '2023-11-15',
    status: 'Attention Needed',
    values: [
      { name: 'Total Cholesterol', value: '245 mg/dL', range: '<200 mg/dL', status: 'High' },
      { name: 'LDL Cholesterol', value: '165 mg/dL', range: '<100 mg/dL', status: 'High' },
      { name: 'HDL Cholesterol', value: '45 mg/dL', range: '>40 mg/dL', status: 'Normal' },
      { name: 'Triglycerides', value: '180 mg/dL', range: '<150 mg/dL', status: 'High' }
    ]
  }
];

const vitalSigns = [
  {
    date: '2023-12-10',
    bloodPressure: '118/75',
    heartRate: '72 bpm',
    temperature: '98.6°F',
    weight: '165 lbs',
    height: '5\'8"'
  },
  {
    date: '2023-11-15',
    bloodPressure: '125/80',
    heartRate: '76 bpm',
    temperature: '98.4°F',
    weight: '167 lbs',
    height: '5\'8"'
  }
];

const HealthRecordsPage = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Health Records</h1>
          <p className="text-xl text-gray-600">
            Access your complete medical history, lab results, and health documents.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your medical documents here, or click to browse
                </p>
                <Button variant="outline">Choose Files</Button>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="labs">Lab Results</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Search Bar */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search medical records..." className="pl-10" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Medical Records</h2>
              <div className="space-y-4">
                {medicalRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                {record.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {record.date}
                                </div>
                                <Badge variant="secondary">{record.type}</Badge>
                                <span>by {record.doctor}</span>
                              </div>
                              <p className="text-sm text-gray-500">Size: {record.size}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="labs" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lab Results</h2>
              <div className="space-y-6">
                {labResults.map((lab, index) => (
                  <motion.div
                    key={lab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{lab.test}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500">{lab.date}</span>
                              <Badge 
                                variant={lab.status === 'Normal' ? 'default' : 'destructive'}
                                className="ml-2"
                              >
                                {lab.status}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {lab.values.map((value, valueIndex) => (
                            <div 
                              key={valueIndex}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <span className="font-medium text-gray-800">{value.name}</span>
                                <p className="text-sm text-gray-600">Reference: {value.range}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-800">{value.value}</span>
                                <Badge 
                                  variant={value.status === 'Normal' ? 'default' : 'destructive'}
                                  className="ml-2"
                                >
                                  {value.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vital Signs History</h2>
              <div className="space-y-4">
                {vitalSigns.map((vital, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Activity className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-800">Visit Date: {vital.date}</span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Blood Pressure</p>
                            <p className="font-semibold text-gray-800">{vital.bloodPressure}</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Heart Rate</p>
                            <p className="font-semibold text-gray-800">{vital.heartRate}</p>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Temperature</p>
                            <p className="font-semibold text-gray-800">{vital.temperature}</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Weight</p>
                            <p className="font-semibold text-gray-800">{vital.weight}</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Height</p>
                            <p className="font-semibold text-gray-800">{vital.height}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthRecordsPage;