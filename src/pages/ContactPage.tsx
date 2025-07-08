
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Star, User, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  department: z.string().min(1, 'Please select a department'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  service: z.string().min(1, 'Please select a service'),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;
type FeedbackForm = z.infer<typeof feedbackSchema>;

const ContactPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'support', message: 'Hello! How can I help you today?', time: '2:30 PM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const { register: registerContact, handleSubmit: handleContactSubmit, formState: { errors: contactErrors }, reset: resetContact } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const { register: registerFeedback, handleSubmit: handleFeedbackSubmit, formState: { errors: feedbackErrors }, reset: resetFeedback } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema)
  });

  const onContactSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...data,
        userId: user?.uid || null,
        status: 'new',
        createdAt: serverTimestamp(),
        ipAddress: 'user-ip' // You can implement IP detection if needed
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting Dream Team Services Hospital. We'll get back to you within 24 hours.",
      });
      resetContact();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or call us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFeedbackSubmit = async (data: FeedbackForm) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        ...data,
        userId: user?.uid || null,
        status: 'new',
        createdAt: serverTimestamp()
      });

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback. It helps us improve our services at Dream Team Services Hospital.",
      });
      resetFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        sender: 'user',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, userMessage]);
      setNewMessage('');
      
      // Simulate response
      setTimeout(() => {
        const supportMessage = {
          id: messages.length + 2,
          sender: 'support',
          message: 'Thank you for your message. A support representative will be with you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, supportMessage]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Contact & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for appointments, questions, or feedback. We're here to help with all your healthcare needs.
          </p>
        </motion.div>

        <Tabs defaultValue="contact" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>Our Location</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      123 Healthcare Street<br />
                      Medical City, MC 12345<br />
                      United States
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>Phone Numbers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Main:</span>
                        <span className="font-medium">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Emergency:</span>
                        <Badge variant="destructive">+1 (555) 911-0000</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Appointments:</span>
                        <span className="font-medium">+1 (555) 123-APPT</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>Email Addresses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">General:</span>
                        <span className="font-medium">info@healthcare.com</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Appointments:</span>
                        <span className="font-medium">appointments@healthcare.com</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Support:</span>
                        <span className="font-medium">support@healthcare.com</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>Opening Hours</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monday - Friday:</span>
                        <span className="font-medium">8:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Saturday:</span>
                        <span className="font-medium">9:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sunday:</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-gray-600">Emergency:</span>
                        <Badge variant="destructive">24/7</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit(onContactSubmit)} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="Your Name"
                            {...registerContact('name')}
                            className={contactErrors.name ? 'border-red-500' : ''}
                          />
                          {contactErrors.name && (
                            <p className="text-red-500 text-sm mt-1">{contactErrors.name.message}</p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="Your Email"
                            type="email"
                            {...registerContact('email')}
                            className={contactErrors.email ? 'border-red-500' : ''}
                          />
                          {contactErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{contactErrors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="Your Phone Number"
                            {...registerContact('phone')}
                            className={contactErrors.phone ? 'border-red-500' : ''}
                          />
                          {contactErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">{contactErrors.phone.message}</p>
                          )}
                        </div>
                        <div>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="appointments">Appointments</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Input
                          placeholder="Subject"
                          {...registerContact('subject')}
                          className={contactErrors.subject ? 'border-red-500' : ''}
                        />
                        {contactErrors.subject && (
                          <p className="text-red-500 text-sm mt-1">{contactErrors.subject.message}</p>
                        )}
                      </div>

                      <div>
                        <Textarea
                          placeholder="Your Message"
                          rows={6}
                          {...registerContact('message')}
                          className={contactErrors.message ? 'border-red-500' : ''}
                        />
                        {contactErrors.message && (
                          <p className="text-red-500 text-sm mt-1">{contactErrors.message.message}</p>
                        )}
                      </div>

                      <Button type="submit" className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Share Your Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFeedbackSubmit(onFeedbackSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          placeholder="Your Name"
                          {...registerFeedback('name')}
                          className={feedbackErrors.name ? 'border-red-500' : ''}
                        />
                        {feedbackErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{feedbackErrors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          placeholder="Your Email"
                          type="email"
                          {...registerFeedback('email')}
                          className={feedbackErrors.email ? 'border-red-500' : ''}
                        />
                        {feedbackErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{feedbackErrors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency Care</SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="oncology">Oncology</SelectItem>
                          <SelectItem value="general">General Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate Your Experience
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className="p-1"
                          >
                            <Star className="w-8 h-8 text-yellow-400 hover:text-yellow-500" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Textarea
                        placeholder="Tell us about your experience..."
                        rows={6}
                        {...registerFeedback('feedback')}
                        className={feedbackErrors.feedback ? 'border-red-500' : ''}
                      />
                      {feedbackErrors.feedback && (
                        <p className="text-red-500 text-sm mt-1">{feedbackErrors.feedback.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span>Live Chat Support</span>
                  </CardTitle>
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-80 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-800 border'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendChatMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    <p>Average response time: 2-5 minutes</p>
                    <p>Support hours: Monday - Friday, 8:00 AM - 8:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContactPage;
