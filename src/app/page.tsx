'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Target,
  FileText,
  BarChart,
  PlayCircle,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import imageData from '@/lib/placeholder-images.json';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const DemoBookingModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) => {
    const { toast } = useToast();
    const [phone, setPhone] = useState('');
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!phone || !className) {
            toast({ title: 'Missing Details', description: 'Please fill out all the fields to book a demo.', variant: 'destructive' });
            return;
        }

        if (phone.length < 10) {
            toast({ title: 'Invalid Phone Number', description: 'Please enter a valid 10-digit phone number.', variant: 'destructive' });
            return;
        }
        
        setLoading(true);
        
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            toast({ title: 'Error', description: 'Razorpay SDK failed to load. Are you online?', variant: 'destructive' });
            setLoading(false);
            return;
        }

        const options = {
            key: "rzp_live_6vd9RApruseTAi",
            amount: "100", // amount in the smallest currency unit (₹1)
            currency: "INR",
            name: "Blanklearn",
            description: "Demo Session",
            image: "https://i.imgur.com/8l63YxI.png",
            handler: function (response: any) {
                // Payment successful
                setLoading(false);
                toast({ title: 'Payment Successful!', description: 'Redirecting to WhatsApp...' });

                const message = `*New Demo Booking!*%0A%0A*Class:* ${className}%0A*WhatsApp Number:* ${phone}%0A*Payment ID:* ${response.razorpay_payment_id}`;
                const whatsappUrl = `https://wa.me/919235044520?text=${message}`;
                
                window.open(whatsappUrl, '_blank');
                onOpenChange(false);
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                    toast({ title: 'Payment Cancelled', description: 'Your payment was not completed.', variant: 'destructive' });
                }
            },
            prefill: {
                contact: phone,
            },
            notes: {
                class: className,
            },
            theme: {
                color: "#3F51B5"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response:any) {
            setLoading(false);
            toast({
                title: "Payment Failed",
                description: `Error: ${response.error.description}`,
                variant: "destructive",
            });
        });
        paymentObject.open();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Your Demo Session</DialogTitle>
                    <DialogDescription>Fill in the details to schedule your child's live demo for just ₹1.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div>
                        <Label htmlFor="phone">Your WhatsApp Number</Label>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your 10-digit number" />
                    </div>
                    <div>
                        <Label htmlFor="class">Class</Label>
                        <Input id="class" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g., Class 6" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handlePayment} disabled={loading} className="w-full glowing-button">
                        {loading ? 'Processing...' : 'Pay ₹1 & Book'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Section 1: Navigation Bar
const NavigationBar = ({ onBookDemoClick }: { onBookDemoClick: () => void; }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <svg width="40" height="40" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M125 0C55.9644 0 0 55.9644 0 125C0 194.036 55.9644 250 125 250C194.036 250 250 194.036 250 125C250 55.9644 194.036 0 125 0ZM197.668 90.5651L124.735 163.743C124.64 163.838 124.526 163.914 124.401 163.965C124.276 164.017 124.14 164.043 124.002 164.043C123.864 164.043 123.727 164.017 123.602 163.965C123.477 163.914 123.363 163.838 123.268 163.743L50.3346 90.5651C49.9531 90.1835 49.7466 89.6643 49.757 89.1245C49.7675 88.5847 49.9943 88.074 50.3887 87.6974C50.783 87.3208 51.3093 87.108 51.8654 87.1009C52.4215 87.0938 52.9556 87.3028 53.3599 87.6974L124.002 158.577L194.643 87.6974C195.047 87.3028 195.581 87.0938 196.137 87.1009C196.693 87.108 197.219 87.3208 197.614 87.6974C198.008 88.074 198.235 88.5847 198.245 89.1245C198.256 89.6643 198.049 90.1835 197.668 90.5651Z" fill="#3F51B5"/>
          </svg>
          <span className="text-2xl font-bold text-primary">Blanklearn</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost">Login</Button>
          <Button className="glowing-button" onClick={onBookDemoClick}>Book Demo @ ₹1</Button>
        </div>
      </div>
    </header>
  );
};


// Section 2: Hero Header
const HeroHeader = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-primary/5 opacity-50 -z-1"></div>
    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-accent/5 opacity-50 -z-1"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Your Child’s After-School Studies, Fully Managed While You Work.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
            Interactive Live Classes in Small Groups (Max 8 Students). Homework help, concept clearing, and skill building—all inside one app.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="w-full sm:w-auto glowing-button text-lg h-14 px-8" onClick={onBookDemoClick}>
              Book 1-Hour Live Demo for ₹1
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500 font-semibold">
            Trusted by 500+ Working Parents | No Hidden Charges
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Image
                src={imageData.heroStudent.src}
                alt="Child learning on tablet"
                width={imageData.heroStudent.width}
                height={imageData.heroStudent.height}
                className="rounded-2xl shadow-xl transform rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-transform duration-300"
                data-ai-hint={imageData.heroStudent.aiHint}
            />
            <Image
                src={imageData.heroParent.src}
                alt="Parent working on laptop"
                width={imageData.heroParent.width}
                height={imageData.heroParent.height}
                className="rounded-2xl shadow-xl transform rotate-[3deg] hover:rotate-0 hover:scale-105 transition-transform duration-300 mt-8"
                data-ai-hint={imageData.heroParent.aiHint}
            />
        </div>
      </div>
    </div>
  </section>
);

// Section 3: Pain & Solution
const PainAndSolution = () => (
  <section className="py-20 md:py-28 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">End the Evening Homework Struggle.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <Card className="bg-white shadow-lg rounded-2xl p-6 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 border-red-200">
          <CardHeader>
            <div className="mx-auto bg-red-100 rounded-full p-3 w-fit">
              <Clock className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="mt-4 text-xl md:text-2xl">The Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">You come home tired, only to find pending homework and looming exams. The daily battle drains your energy and strains family time.</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg rounded-2xl p-6 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 border-yellow-200">
          <CardHeader>
            <div className="mx-auto bg-yellow-100 rounded-full p-3 w-fit">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <CardTitle className="mt-4 text-xl md:text-2xl">The Gap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Big coaching centers have 50+ kids where your child is just a number, lost in the crowd and unable to get personal attention.</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-white shadow-xl rounded-2xl p-6 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 ring-4 ring-primary/20">
          <CardHeader>
            <div className="mx-auto bg-white/20 rounded-full p-3 w-fit">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="mt-4 text-xl md:text-2xl">The Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="opacity-90">Our small-batch "Micro-Classrooms" ensure your child gets the attention they deserve while you reclaim your personal time and peace of mind.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);


// Section 4: Product Features
const features = [
  {
    icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
    title: "1:8 Interaction Ratio",
    description: "Every child's camera is on. Every child speaks. Every child is heard. No one is left behind.",
  },
  {
    icon: <FileText className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
    title: "Homework Assistance",
    description: "We help finish school assignments so your family time stays stress-free and enjoyable.",
  },
  {
    icon: <Target className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
    title: "Concept Mastery",
    description: "Using 3D visuals, interactive simulations, and storytelling to make Math and Science fun.",
  },
  {
    icon: <BarChart className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
    title: "Daily Progress Reports",
    description: "Automated WhatsApp updates on your child’s participation, performance, and areas of improvement.",
  },
];

const ProductFeatures = () => (
  <section className="py-20 md:py-28 bg-slate-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Not Just a Class, An All-In-One Growth Hub.</h2>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          We provide a holistic learning ecosystem designed for real growth and understanding.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm md:text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Section 5: The "₹1 Demo" Breakdown
const DemoBreakdown = () => (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Experience the Magic for just ₹1.</h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Completely transparent. See if we're the right fit for your child.
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-8 left-0 w-full h-0.5 bg-border -translate-y-1/2 -z-10 hidden md:block"></div>
          <div className="grid md:grid-cols-4 gap-x-8 gap-y-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">1</div>
              <h3 className="font-bold text-lg md:text-xl">Pay ₹1</h3>
              <p className="text-slate-600 mt-2 text-sm md:text-base">A nominal fee to ensure a focused, small-group environment for committed learners.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">2</div>
              <h3 className="font-bold text-lg md:text-xl">Pick a Slot</h3>
              <p className="text-slate-600 mt-2 text-sm md:text-base">Choose a convenient time that fits perfectly with your child's school schedule.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">3</div>
              <h3 className="font-bold text-lg md:text-xl">Join via App</h3>
              <p className="text-slate-600 mt-2 text-sm md:text-base">Download our App and enter the live interactive classroom with just one simple tap.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">4</div>
              <h3 className="font-bold text-lg md:text-xl">Get a Report</h3>
              <p className="text-slate-600 mt-2 text-sm md:text-base">After 60 minutes, receive an AI-generated analysis of your child's strengths and areas for growth.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
);


// Section 6: Meet the Mentors
const mentors = [
  {
    name: "Priya Sharma",
    experience: "8+ Years in Child Pedagogy",
    expertise: "Specialist in Singapore Math",
    image: imageData.mentor1
  },
  {
    name: "Rohan Verma",
    experience: "10+ Years in Primary Education",
    expertise: "Expert in Phonics & Reading",
    image: imageData.mentor2
  },
  {
    name: "Anjali Singh",
    experience: "7+ Years in Science Education",
    expertise: "Makes complex science fun",
    image: imageData.mentor3
  }
];

const MeetTheMentors = () => (
  <section className="py-20 md:py-28 bg-slate-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Taught by Experts, Not Just Tutors.</h2>
         <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          Our mentors are certified educators passionate about helping children succeed.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map((mentor, index) => (
          <Card key={index} className="overflow-hidden text-center rounded-2xl shadow-lg group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="relative">
              <Image
                src={mentor.image.src}
                alt={mentor.name}
                width={mentor.image.width}
                height={mentor.image.height}
                className="w-full h-80 object-cover object-top"
                data-ai-hint={mentor.image.aiHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                 <PlayCircle className="w-16 h-16 md:w-20 md:h-20 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
              </div>
            </div>
            <CardContent className="p-6 bg-white">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">{mentor.name}</h3>
              <p className="text-primary font-semibold mt-1 text-sm md:text-base">{mentor.experience}</p>
              <p className="text-slate-600 mt-2 text-sm md:text-base">{mentor.expertise}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// Section 7: Social Proof
const SocialProof = () => (
  <section className="py-20 md:py-28 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">What Other Busy Parents Say.</h2>
         <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          Real stories from parents who've reclaimed their evenings.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 text-center lg:text-left">Video Testimonials</h3>
          <div className="space-y-6">
            {[imageData.testimonialParent1, imageData.testimonialParent2, imageData.testimonialParent3].map((testimonial, index) => (
               <div key={index} className="relative rounded-2xl overflow-hidden shadow-lg group">
                  <Image src={testimonial.src} alt={`Testimonial ${index + 1}`} width={testimonial.width} height={testimonial.height} data-ai-hint={testimonial.aiHint} className="w-full" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-white/80" />
                  </div>
               </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 text-center lg:text-left">Real Parent Feedback</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[imageData.whatsappChat1, imageData.whatsappChat2, imageData.whatsappChat3].map((chat, index) => (
                <Image key={index} src={chat.src} alt={`WhatsApp Chat ${index+1}`} width={chat.width} height={chat.height} data-ai-hint={chat.aiHint} className="rounded-xl shadow-md w-full transition-transform hover:scale-105" />
              ))}
          </div>
          <div className="mt-8 bg-slate-50 rounded-2xl p-6 md:p-8 text-center shadow-inner">
            <div className="flex justify-center items-center gap-1 text-yellow-400">
                <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-900 mt-2">4.9 / 5.0</p>
            <p className="text-slate-600 text-sm md:text-base">Based on App Store & Play Store Reviews</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);


// Section 8: The Pricing Plan
const PricingPlan = () => (
    <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing.</h2>
                <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                    Choose the plan that's right for your child. No hidden fees.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Plan 1: Small Group */}
                <Card className="rounded-2xl shadow-lg bg-white transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col">
                    <CardHeader className="text-center p-6 md:p-8">
                        <p className="font-semibold text-base md:text-lg text-primary">Small Group Class</p>
                        <CardTitle className="text-3xl md:text-4xl font-extrabold text-slate-800">₹2,000<span className="text-base font-medium text-slate-500">/month</span></CardTitle>
                         <p className="text-sm text-slate-500">(Max 5 Students)</p>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 flex-grow">
                        <ul className="space-y-4 text-slate-600 text-sm md:text-base">
                            <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> 20 Live Interactive Classes</li>
                            <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Daily Homework Help</li>
                            <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> 24/7 Recording Access</li>
                            <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Monthly Parent-Teacher Meeting</li>
                        </ul>
                    </CardContent>
                    <div className="p-6 md:p-8 pt-0">
                         <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center text-sm font-semibold mb-6 flex items-center justify-center gap-2">
                            <Gift className="w-5 h-5" />
                            <span>₹500 OFF on your first month. Join in 5 days!</span>
                         </div>
                        <Button size="lg" className="w-full h-12 text-lg">Choose Plan</Button>
                        <p className="mt-6 text-xs md:text-sm text-center text-slate-500">Pause or Cancel Anytime with one click.</p>
                    </div>
                </Card>

                {/* Plan 2: 1-on-1 */}
                <Card className="rounded-2xl shadow-2xl border-2 border-primary bg-white transition-all hover:shadow-primary/20 hover:-translate-y-2 flex flex-col">
                    <CardHeader className="text-center p-6 md:p-8 bg-primary text-primary-foreground rounded-t-xl">
                        <p className="font-semibold text-base md:text-lg opacity-90">1-on-1 Private Class</p>
                        <CardTitle className="text-3xl md:text-4xl font-extrabold">₹4,000<span className="text-base font-medium opacity-80">/month</span></CardTitle>
                        <p className="text-sm opacity-80">(Undivided Attention)</p>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 flex-grow">
                        <ul className="space-y-4 text-slate-600 text-sm md:text-base">
                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> <strong>All Small Group features, plus:</strong></li>
                            <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Fully Personalized Curriculum</li>
                            <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Flexible Class Scheduling</li>
                            <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Dedicated Academic Mentor</li>
                        </ul>
                    </CardContent>
                    <div className="p-6 md:p-8 pt-0">
                        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center text-sm font-semibold mb-6 flex items-center justify-center gap-2">
                            <Gift className="w-5 h-5" />
                            <span>₹500 OFF on your first month. Join in 5 days!</span>
                        </div>
                        <Button size="lg" className="w-full h-12 text-lg glowing-button">Choose Plan</Button>
                        <p className="mt-6 text-xs md:text-sm text-center text-slate-500">Pause or Cancel Anytime with one click.</p>
                    </div>
                </Card>
            </div>
        </div>
    </section>
);



// Section 9: The Final FAQ
const faqItems = [
    {
        question: "What if my child misses a class?",
        answer: "No problem! All sessions are recorded and available on the app instantly. Your child can catch up anytime, anywhere."
    },
    {
        question: "Can I change the teacher or batch?",
        answer: "Yes, absolutely. We want the perfect fit for your child. You can request a batch or teacher change directly through the app."
    },
    {
        question: "Is my payment secure?",
        answer: "We use Razorpay, one of the most secure and trusted payment gateways in India. Your financial details are 100% safe."
    },
     {
        question: "What subjects and grades do you cover?",
        answer: "We cover Maths, Science, and English for Grades 1-8 across CBSE, ICSE, and major state boards. Our curriculum is designed to complement school studies."
    }
];

const FinalFAQ = () => (
    <section className="py-20 md:py-28 bg-white">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    Frequently Asked Questions
                </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`} className="bg-slate-50 rounded-xl shadow-sm px-4 md:px-6 border hover:bg-white transition-colors">
                        <AccordionTrigger className="text-left font-semibold text-base md:text-lg hover:no-underline">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-slate-600 pt-2 text-sm md:text-base">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
);


// Section 10: The Footer
const Footer = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <footer className="bg-slate-800 text-slate-300">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Don't let another evening go to waste.</h2>
        <div className="mt-8">
            <Button size="lg" className="glowing-button h-14 px-8 md:px-10 text-lg" onClick={onBookDemoClick}>
                Book Your ₹1 Demo Session Now
            </Button>
        </div>
    </div>
    <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
               <svg width="32" height="32" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M125 0C55.9644 0 0 55.9644 0 125C0 194.036 55.9644 250 125 250C194.036 250 250 194.036 250 125C250 55.9644 194.036 0 125 0ZM197.668 90.5651L124.735 163.743C124.64 163.838 124.526 163.914 124.401 163.965C124.276 164.017 124.14 164.043 124.002 164.043C123.864 164.043 123.727 164.017 123.602 163.965C123.477 163.914 123.363 163.838 123.268 163.743L50.3346 90.5651C49.9531 90.1835 49.7466 89.6643 49.757 89.1245C49.7675 88.5847 49.9943 88.074 50.3887 87.6974C50.783 87.3208 51.3093 87.108 51.8654 87.1009C52.4215 87.0938 52.9556 87.3028 53.3599 87.6974L124.002 158.577L194.643 87.6974C195.047 87.3028 195.581 87.0938 196.137 87.1009C196.693 87.108 197.219 87.3208 197.614 87.6974C198.008 88.074 198.235 88.5847 198.245 89.1245C198.256 89.6643 198.049 90.1835 197.668 90.5651Z" fill="#3F51B5"/>
                </svg>
                <span className="text-xl font-bold">Blanklearn</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 sm:mt-0">
                <a href="#" className="hover:text-white text-sm">Terms of Service</a>
                <a href="#" className="hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="hover:text-white text-sm">Contact Us</a>
            </div>
            <p className="mt-4 sm:mt-0 text-sm text-slate-500 text-center">&copy; {new Date().getFullYear()} Blanklearn. All rights reserved.</p>
        </div>
    </div>
  </footer>
);

const StickyBookingBar = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [slotsLeft, setSlotsLeft] = useState(3);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const toggleVisibility = () => {
            const footer = document.querySelector('footer');
            if (!footer) return;
            const footerReached = window.scrollY + window.innerHeight > footer.offsetTop;

            if (window.scrollY > 300 && !footerReached) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSlotsLeft(prev => (prev > 1 ? prev - 1 : 3));
        }, 5000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t p-3 z-40 transform transition-transform duration-300 md:hidden",
            isVisible ? 'translate-y-0' : 'translate-y-full'
        )}>
            <div className="container mx-auto px-4 flex justify-between items-center gap-4">
                <div>
                     <p className="font-bold text-primary animate-pulse">Only {slotsLeft} slots left!</p>
                     <p className="text-sm text-slate-600">For Grade 4 this week</p>
                </div>
                <Button className="glowing-button flex-shrink-0" onClick={onBookDemoClick}>
                    Book @ ₹1
                </Button>
            </div>
        </div>
    )
}


export default function HomePage() {
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  
  const handleBookDemoClick = () => {
    setDemoModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground">
      <Suspense fallback={<div>Loading...</div>}>
        <DemoBookingModal open={isDemoModalOpen} onOpenChange={setDemoModalOpen} />
      </Suspense>
      <NavigationBar onBookDemoClick={handleBookDemoClick} />
      <main>
        <HeroHeader onBookDemoClick={handleBookDemoClick} />
        <PainAndSolution />
        <ProductFeatures />
        <DemoBreakdown />
        <MeetTheMentors />
        <SocialProof />
        <PricingPlan />
        <FinalFAQ />
      </main>
      <Footer onBookDemoClick={handleBookDemoClick} />
      <StickyBookingBar onBookDemoClick={handleBookDemoClick} />
    </div>
  );
}
