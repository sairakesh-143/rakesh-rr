import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Bell, Plus, Edit, Trash2, Send, Clock, CheckCircle, Users, Mail, MessageSquare } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'appointment-reminder' | 'appointment-confirmation' | 'appointment-cancellation' | 'general';
  subject: string;
  message: string;
  triggerTime: string; // e.g., "24-hours-before", "1-hour-before"
  isActive: boolean;
  createdAt: any;
}

interface NotificationHistory {
  id: string;
  templateName: string;
  recipient: string;
  type: 'email' | 'sms';
  status: 'sent' | 'failed' | 'pending';
  sentAt: any;
  message: string;
}

const AdminNotifications = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'appointment-reminder' as 'appointment-reminder' | 'appointment-confirmation' | 'appointment-cancellation' | 'general',
    subject: '',
    message: '',
    triggerTime: '24-hours-before',
    isActive: true
  });
  const [sendForm, setSendForm] = useState({
    recipients: '',
    type: 'email' as 'email' | 'sms',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const notificationTypes = [
    { value: 'appointment-reminder', label: 'Appointment Reminder' },
    { value: 'appointment-confirmation', label: 'Appointment Confirmation' },
    { value: 'appointment-cancellation', label: 'Appointment Cancellation' },
    { value: 'general', label: 'General Notification' }
  ];

  const triggerTimes = [
    { value: '1-hour-before', label: '1 Hour Before' },
    { value: '24-hours-before', label: '24 Hours Before' },
    { value: '48-hours-before', label: '48 Hours Before' },
    { value: '1-week-before', label: '1 Week Before' },
    { value: 'immediate', label: 'Immediate' }
  ];

  const defaultTemplates = [
    {
      name: 'Appointment Reminder',
      type: 'appointment-reminder',
      subject: 'Reminder: Your Appointment Tomorrow',
      message: 'Dear {patientName},\n\nThis is a friendly reminder about your appointment scheduled for {appointmentDate} at {appointmentTime} with {doctorName} in the {department} department.\n\nPlease arrive 15 minutes early for check-in.\n\nIf you need to reschedule, please call us at (555) 123-4567.\n\nThank you,\nHospital Management',
      triggerTime: '24-hours-before'
    },
    {
      name: 'Appointment Confirmation',
      type: 'appointment-confirmation',
      subject: 'Appointment Confirmed',
      message: 'Dear {patientName},\n\nYour appointment has been confirmed for {appointmentDate} at {appointmentTime} with {doctorName}.\n\nDepartment: {department}\nLocation: Hospital Main Building\n\nPlease bring a valid ID and insurance card.\n\nThank you,\nHospital Management',
      triggerTime: 'immediate'
    },
    {
      name: 'Appointment Cancellation',
      type: 'appointment-cancellation',
      subject: 'Appointment Cancelled',
      message: 'Dear {patientName},\n\nWe regret to inform you that your appointment scheduled for {appointmentDate} at {appointmentTime} has been cancelled.\n\nPlease call us at (555) 123-4567 to reschedule.\n\nWe apologize for any inconvenience.\n\nThank you,\nHospital Management',
      triggerTime: 'immediate'
    }
  ];

  useEffect(() => {
    fetchTemplates();
    fetchHistory();
    initializeDefaultTemplates();
  }, []);

  const initializeDefaultTemplates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notificationTemplates'));
      if (querySnapshot.empty) {
        // Add default templates
        for (const template of defaultTemplates) {
          await addDoc(collection(db, 'notificationTemplates'), {
            ...template,
            isActive: true,
            createdAt: new Date()
          });
        }
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error initializing templates:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notificationTemplates'));
      const templatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationTemplate[];
      
      setTemplates(templatesData.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()));
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notification templates",
        variant: "destructive"
      });
    }
  };

  const fetchHistory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notificationHistory'));
      const historyData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationHistory[];
      
      setHistory(historyData.sort((a, b) => b.sentAt?.toDate() - a.sentAt?.toDate()));
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      await addDoc(collection(db, 'notificationTemplates'), {
        ...templateForm,
        createdAt: new Date()
      });

      toast({
        title: "Success",
        description: "Notification template created successfully"
      });

      setIsTemplateDialogOpen(false);
      resetTemplateForm();
      fetchTemplates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive"
      });
    }
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      await updateDoc(doc(db, 'notificationTemplates', selectedTemplate.id), templateForm);

      toast({
        title: "Success",
        description: "Template updated successfully"
      });

      setIsEditDialogOpen(false);
      resetTemplateForm();
      fetchTemplates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await deleteDoc(doc(db, 'notificationTemplates', templateId));

      toast({
        title: "Success",
        description: "Template deleted successfully"
      });

      fetchTemplates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const handleToggleTemplate = async (templateId: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'notificationTemplates', templateId), { isActive });

      toast({
        title: "Success",
        description: `Template ${isActive ? 'activated' : 'deactivated'} successfully`
      });

      fetchTemplates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive"
      });
    }
  };

  const handleSendNotification = async () => {
    try {
      const recipients = sendForm.recipients.split(',').map(r => r.trim());
      
      for (const recipient of recipients) {
        await addDoc(collection(db, 'notificationHistory'), {
          templateName: 'Manual Send',
          recipient,
          type: sendForm.type,
          status: 'sent',
          sentAt: new Date(),
          message: sendForm.message,
          subject: sendForm.subject
        });
      }

      toast({
        title: "Success",
        description: `Notification sent to ${recipients.length} recipient(s)`
      });

      setIsSendDialogOpen(false);
      resetSendForm();
      fetchHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      type: 'appointment-reminder',
      subject: '',
      message: '',
      triggerTime: '24-hours-before',
      isActive: true
    });
    setSelectedTemplate(null);
  };

  const resetSendForm = () => {
    setSendForm({
      recipients: '',
      type: 'email',
      subject: '',
      message: ''
    });
  };

  const openEditDialog = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      type: template.type,
      subject: template.subject,
      message: template.message,
      triggerTime: template.triggerTime,
      isActive: template.isActive
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'appointment-reminder': 'bg-blue-100 text-blue-800',
      'appointment-confirmation': 'bg-green-100 text-green-800',
      'appointment-cancellation': 'bg-red-100 text-red-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    
    return <Badge variant="secondary" className={colors[type as keyof typeof colors]}>{type.replace('-', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notification Management</h2>
          <p className="text-gray-600">Manage appointment reminders and notification templates</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Custom Notification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipients">Recipients (comma-separated emails/phones)</Label>
                  <Textarea
                    id="recipients"
                    value={sendForm.recipients}
                    onChange={(e) => setSendForm({...sendForm, recipients: e.target.value})}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="sendType">Type</Label>
                  <Select value={sendForm.type} onValueChange={(value: 'email' | 'sms') => setSendForm({...sendForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sendSubject">Subject</Label>
                  <Input
                    id="sendSubject"
                    value={sendForm.subject}
                    onChange={(e) => setSendForm({...sendForm, subject: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="sendMessage">Message</Label>
                  <Textarea
                    id="sendMessage"
                    value={sendForm.message}
                    onChange={(e) => setSendForm({...sendForm, message: e.target.value})}
                    rows={6}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSendNotification}>Send Notification</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Notification Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="templateType">Type</Label>
                  <Select value={templateForm.type} onValueChange={(value: any) => setTemplateForm({...templateForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="triggerTime">Trigger Time</Label>
                  <Select value={templateForm.triggerTime} onValueChange={(value) => setTemplateForm({...templateForm, triggerTime: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTimes.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="templateSubject">Subject</Label>
                  <Input
                    id="templateSubject"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="templateMessage">Message</Label>
                  <Textarea
                    id="templateMessage"
                    value={templateForm.message}
                    onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                    rows={8}
                    placeholder="Use variables like {patientName}, {appointmentDate}, {appointmentTime}, {doctorName}, {department}"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={templateForm.isActive}
                    onCheckedChange={(checked) => setTemplateForm({...templateForm, isActive: checked})}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveTemplate}>Create Template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Templates ({templates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Trigger Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.subject}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(template.type)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {triggerTimes.find(t => t.value === template.triggerTime)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={template.isActive}
                          onCheckedChange={(checked) => handleToggleTemplate(template.id, checked)}
                        />
                        <span className="text-sm">{template.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {template.createdAt?.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(template)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteTemplate(template.id)}
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
          {templates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No notification templates found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Notifications ({history.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.slice(0, 20).map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="font-medium">{notification.templateName}</div>
                    </TableCell>
                    <TableCell>{notification.recipient}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {notification.type === 'email' ? (
                          <Mail className="w-4 h-4 mr-1" />
                        ) : (
                          <MessageSquare className="w-4 h-4 mr-1" />
                        )}
                        {notification.type.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(notification.status)}
                    </TableCell>
                    <TableCell>
                      {notification.sentAt?.toDate().toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {history.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No notification history found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Notification Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTemplateName">Template Name</Label>
              <Input
                id="editTemplateName"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editTemplateType">Type</Label>
              <Select value={templateForm.type} onValueChange={(value: any) => setTemplateForm({...templateForm, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editTriggerTime">Trigger Time</Label>
              <Select value={templateForm.triggerTime} onValueChange={(value) => setTemplateForm({...templateForm, triggerTime: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {triggerTimes.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editTemplateSubject">Subject</Label>
              <Input
                id="editTemplateSubject"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editTemplateMessage">Message</Label>
              <Textarea
                id="editTemplateMessage"
                value={templateForm.message}
                onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                rows={8}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={templateForm.isActive}
                onCheckedChange={(checked) => setTemplateForm({...templateForm, isActive: checked})}
              />
              <Label>Active</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTemplate}>Update Template</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNotifications;