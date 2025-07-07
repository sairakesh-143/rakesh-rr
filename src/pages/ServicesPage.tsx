
import { motion } from 'framer-motion';
import { ServiceCard } from '@/components/ui/service-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'react-router-dom';

const services = [
  {
    title: 'Emergency Care',
    description: '24/7 emergency medical services with state-of-the-art facilities and rapid response teams',
    icon: '🚨',
    detailedInfo: {
      fullDescription: 'Our Emergency Care department is staffed 24/7 with board-certified emergency physicians, trauma surgeons, and specialized nurses. We provide immediate care for life-threatening conditions with state-of-the-art resuscitation rooms, trauma bays, and rapid diagnostic capabilities.',
      keyFeatures: [
        'Level I Trauma Center with helicopter landing capability',
        'Separate pediatric emergency department',
        'Dedicated cardiac and stroke emergency units',
        'Average door-to-doctor time under 10 minutes',
        'Advanced life support ambulance services'
      ],
      availableTreatments: 'Critical care, trauma stabilization, cardiac emergencies, stroke intervention, respiratory distress, major injury management',
      teamInfo: 'Team of 20+ emergency physicians, 50+ emergency nurses, and trauma specialists',
      equipmentHighlights: 'Point-of-care ultrasound, rapid CT scanners, bedside laboratory testing, advanced cardiac monitoring'
    }
  },
  {
    title: 'Cardiology',
    description: 'Comprehensive heart care including diagnostics, interventional procedures, and cardiac surgery',
    icon: '❤️',
    detailedInfo: {
      fullDescription: 'Our Cardiology department delivers comprehensive care for heart conditions through prevention, diagnosis, treatment, and rehabilitation. With cutting-edge technology and specialized expertise, we manage the full spectrum of cardiovascular disease.',
      keyFeatures: [
        'Advanced cardiac catheterization laboratories',
        'Non-invasive cardiovascular imaging center',
        'Heart rhythm disorders clinic',
        'Preventive cardiology and rehabilitation programs',
        'Heart failure and transplant services'
      ],
      availableTreatments: 'Angioplasty, stent placement, pacemaker implantation, cardiac ablation, valve repair/replacement, coronary bypass surgery, heart transplantation',
      teamInfo: 'Team of interventional cardiologists, electrophysiologists, cardiac surgeons, and specialized cardiac nurses',
      equipmentHighlights: '3D echocardiography, cardiac MRI, nuclear cardiology, electrophysiology mapping systems'
    }
  },
  {
    title: 'Neurology',
    description: 'Expert neurological care for brain, spine, and nervous system conditions',
    icon: '🧠',
    detailedInfo: {
      fullDescription: 'Our Neurology department provides comprehensive care for disorders of the brain, spinal cord, peripheral nerves, and muscles. We combine clinical expertise with advanced technology to diagnose and treat complex neurological conditions.',
      keyFeatures: [
        'Comprehensive stroke center with rapid response protocols',
        'Epilepsy monitoring unit with 24/7 EEG capability',
        'Movement disorders clinic with DBS programming',
        'Neuroimmunology and multiple sclerosis center',
        'Headache and pain management specialists'
      ],
      availableTreatments: 'Stroke intervention, epilepsy management, multiple sclerosis therapies, neuromuscular disorder treatment, cognitive disorder care, headache management',
      teamInfo: 'Team of neurologists, neurosurgeons, neuroradiologists, and specialized neurological nurses',
      equipmentHighlights: 'High-resolution MRI, CT perfusion scanning, EEG monitoring, neuronavigation systems, TMS therapy'
    }
  },
  {
    title: 'Pediatrics',
    description: 'Specialized healthcare for infants, children, and adolescents with child-friendly environment',
    icon: '👶',
    detailedInfo: {
      fullDescription: 'Our Pediatrics department delivers compassionate, comprehensive care for children from birth through adolescence. We focus on creating a supportive, child-friendly environment while providing expert medical care for both routine and complex conditions.',
      keyFeatures: [
        'Dedicated pediatric emergency department',
        'Child-friendly inpatient units with family accommodation',
        'Specialized pediatric intensive care unit',
        'Developmental and behavioral health services',
        'Child life program to support emotional well-being'
      ],
      availableTreatments: 'Well-child care, immunizations, acute illness management, chronic disease management, developmental assessments, behavioral health services',
      teamInfo: 'Team of board-certified pediatricians, pediatric subspecialists, child life specialists, and pediatric nurses',
      equipmentHighlights: 'Child-sized medical equipment, pediatric-specific diagnostic tools, interactive therapy resources'
    }
  },
  {
    title: 'Orthopedics',
    description: 'Advanced bone and joint treatments including sports medicine and joint replacement',
    icon: '🦴',
    detailedInfo: {
      fullDescription: 'Our Orthopedics department provides comprehensive care for musculoskeletal conditions affecting bones, joints, muscles, ligaments, and tendons. We offer both surgical and non-surgical treatments to restore function and reduce pain.',
      keyFeatures: [
        'Joint replacement center of excellence',
        'Sports medicine and athletic injury clinic',
        'Spine center with minimally invasive capabilities',
        'Hand and upper extremity specialty center',
        'Pediatric orthopedics program'
      ],
      availableTreatments: 'Joint replacement, arthroscopic surgery, fracture care, sports injury treatment, spine surgery, hand surgery, physical therapy, orthopedic rehabilitation',
      teamInfo: 'Team of orthopedic surgeons, sports medicine physicians, physical therapists, and specialized orthopedic nurses',
      equipmentHighlights: 'Computer-assisted surgical navigation, advanced arthroscopy systems, 3D motion analysis lab'
    }
  },
  {
    title: 'Oncology',
    description: 'Comprehensive cancer care with cutting-edge treatment protocols and support services',
    icon: '🎗️',
    detailedInfo: {
      fullDescription: 'Our Oncology department delivers multidisciplinary cancer care through prevention, early detection, diagnosis, treatment, and survivorship support. We combine the latest medical advances with compassionate care for optimal outcomes.',
      keyFeatures: [
        'National Cancer Institute-designated treatment center',
        'Precision medicine and genomic profiling program',
        'Specialized tumor boards for collaborative treatment planning',
        'Clinical trials offering access to innovative therapies',
        'Comprehensive supportive care and survivorship programs'
      ],
      availableTreatments: 'Medical oncology, radiation therapy, surgical oncology, immunotherapy, targeted therapy, stem cell transplantation, palliative care',
      teamInfo: 'Team of medical oncologists, radiation oncologists, surgical oncologists, oncology nurses, genetic counselors, and supportive care specialists',
      equipmentHighlights: 'Linear accelerators with IMRT/IGRT capabilities, PET-CT imaging, genomic sequencing technology, interventional oncology suite'
    }
  },
  {
    title: 'Radiology',
    description: 'State-of-the-art imaging services including MRI, CT, X-ray, and ultrasound',
    icon: '📡',
    detailedInfo: {
      fullDescription: 'Our Radiology department utilizes advanced imaging technology and expert interpretation to aid in the diagnosis and treatment of medical conditions. We offer a comprehensive range of diagnostic and interventional services with a focus on patient comfort and safety.',
      keyFeatures: [
        'Advanced 3T MRI imaging with specialized protocols',
        'Low-dose CT technology for reduced radiation exposure',
        'Women\'s imaging center with 3D mammography',
        'Interventional radiology suite for minimally invasive procedures',
        'Pediatric-friendly imaging services'
      ],
      availableTreatments: 'Diagnostic imaging (X-ray, CT, MRI, ultrasound), nuclear medicine studies, interventional procedures, image-guided biopsies, pain management procedures',
      teamInfo: 'Team of board-certified radiologists, specialized technologists, and support staff',
      equipmentHighlights: '3T MRI scanners, multi-slice CT scanners, digital X-ray systems, 3D mammography, DEXA bone density scanners'
    }
  },
  {
    title: 'Laboratory',
    description: 'Full-service laboratory with advanced diagnostic testing and rapid results',
    icon: '🔬',
    detailedInfo: {
      fullDescription: 'Our clinical laboratory provides comprehensive diagnostic testing to support accurate diagnosis and effective treatment. With state-of-the-art technology and expert staff, we deliver reliable results with rapid turnaround times for optimal patient care.',
      keyFeatures: [
        'CAP-accredited full-service clinical laboratory',
        'Advanced molecular diagnostics and genomic testing',
        'Point-of-care testing for rapid results',
        'Specialized testing for rare disorders',
        '24/7 emergency laboratory services'
      ],
      availableTreatments: 'Clinical chemistry, hematology, microbiology, immunology, molecular diagnostics, toxicology, blood bank services',
      teamInfo: 'Team of pathologists, clinical laboratory scientists, phlebotomists, and laboratory specialists',
      equipmentHighlights: 'Automated chemistry and hematology analyzers, mass spectrometers, flow cytometry, PCR technology, next-generation sequencing platforms'
    }
  },
  {
    title: 'Pharmacy',
    description: 'Complete pharmacy services with medication management and counseling',
    icon: '💊',
    detailedInfo: {
      fullDescription: 'Our Pharmacy department provides comprehensive medication services, ensuring safe and effective drug therapy for all patients. Our pharmacists work collaboratively with healthcare providers to optimize medication regimens and provide patient education for better health outcomes.',
      keyFeatures: [
        'Inpatient pharmacy with 24/7 services',
        'Outpatient retail pharmacy with convenient hours',
        'Specialty pharmacy for complex medication management',
        'Medication therapy management programs',
        'Anticoagulation monitoring clinic'
      ],
      availableTreatments: 'Prescription dispensing, medication therapy management, anticoagulation monitoring, immunizations, compounding services, specialty medication management',
      teamInfo: 'Team of clinical pharmacists, pharmacy technicians, and pharmacy specialists',
      equipmentHighlights: 'Automated dispensing systems, electronic prescribing technology, sterile compounding facilities, refrigerated storage for specialty medications'
    }
  }
];

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLearnMore = (service: typeof services[0]) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };
  
  // Get location for monitoring URL changes
  const location = useLocation();
  
  // Handle fragment identifiers from the URL (e.g., /services#cardiology)
  useEffect(() => {
    const hashValue = window.location.hash.slice(1).toLowerCase();
    if (hashValue) {
      // Find the service that matches the hash
      const service = services.find(
        (s) => s.title.toLowerCase() === hashValue || s.title.toLowerCase().replace(/\s+/g, '-') === hashValue
      );
      
      if (service) {
        // Scroll to the element with ID matching the hash
        const element = document.getElementById(hashValue);
        if (element) {
          // Wait a bit for the page to render before scrolling
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
        
        setSelectedService(service);
        setIsDialogOpen(true);
      }
    }
  }, [location.hash]); // Re-run when the hash part of the URL changes

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive healthcare services delivered with expertise, compassion, and cutting-edge technology. 
            We provide specialized care across multiple medical disciplines to meet all your health needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} id={service.title.toLowerCase().replace(/\s+/g, '-')}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                index={index}
                onLearnMore={() => handleLearnMore(service)}
              />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        // Remove hash from URL when closing dialog to avoid reopening
        if (!open && window.location.hash) {
          // Use history.replaceState to change URL without reloading
          window.history.replaceState(null, '', window.location.pathname);
        }
      }}>
        {selectedService && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-3xl">
                <span className="text-4xl">{selectedService.icon}</span>
                {selectedService.title}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-500 mt-2">
                {selectedService.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedService.detailedInfo.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {selectedService.detailedInfo.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Treatments</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedService.detailedInfo.availableTreatments.split(', ').map((treatment, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {treatment}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Team</h3>
                  <p className="text-gray-700">{selectedService.detailedInfo.teamInfo}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Equipment & Technology</h3>
                  <p className="text-gray-700">{selectedService.detailedInfo.equipmentHighlights}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              <Button asChild variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                <Link to="/appointments">Book an Appointment</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ServicesPage;
