'use client';
import { ref, onValue, push, set } from "firebase/database";
import { realtimeDb } from "@/lib/firebase"; 
import ReactPixel from 'react-facebook-pixel'; 
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
  Loader2,
  Play, 
  Quote,
  ShieldCheck,
  Sparkles,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- FREE DEMO BOOKING MODAL (PREMIUM UI) ---
// const DemoBookingModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) => {
//     const { toast } = useToast();
    
//     const [name, setName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [className, setClassName] = useState('');
//     const [selectedPlan, setSelectedPlan] = useState('999'); 
//     const [selectedSlot, setSelectedSlot] = useState('');

//     const [loading, setLoading] = useState(false);
//     const [isSuccess, setIsSuccess] = useState(false);

//     useEffect(() => {
//         if (!open) {
//             setTimeout(() => {
//                 setIsSuccess(false);
//                 setName('');
//                 setPhone('');
//                 setClassName('');
//                 setSelectedPlan('999');
//                 setSelectedSlot('');
//             }, 300);
//         }
//     }, [open]);

//     const handleFreeBooking = async () => {
//         if (!name || !phone || !className || !selectedSlot) {
//             toast({ title: 'Incomplete Details', description: 'Please fill all details to generate your pass.', variant: 'destructive' });
//             return;
//         }
//         if (phone.length < 10) {
//             toast({ title: 'Invalid Phone', description: 'Enter valid 10-digit WhatsApp number.', variant: 'destructive' });
//             return;
//         }

//         setLoading(true);

//         try {
//             const sanitizedPhone = phone.replace(/\D/g, '');
//             const bookingRef = ref(realtimeDb, `DemoBookings/${sanitizedPhone}`);
            
//             await set(bookingRef, {
//                 studentName: name,
//                 mobileNumber: phone,
//                 studentClass: className,
//                 interestedPlan: selectedPlan === '999' ? 'Small Group (999)' : 'Semi-Private (2999)',
//                 demoTime: selectedSlot,
//                 status: "booked_free",
//                 bookingDate: new Date().toLocaleString(),
//                 isAppRegistered: false
//             });
            
//             // Pixel Tracking
//             import("react-facebook-pixel").then((x) => x.default).then((ReactPixel) => {
//                 ReactPixel.track('Lead', { value: 0, currency: 'INR' });
//             });

//             setTimeout(() => {
//                 setLoading(false);
//                 setIsSuccess(true);
//                 toast({ title: 'Success!', description: 'Your Admit Pass is ready.' });
//             }, 1500);

//         } catch (error) {
//             console.error("Error", error);
//             setLoading(false);
//             toast({ title: 'Error', description: 'Network issue. Try again.', variant: 'destructive' });
//         }
//     }

//     const planFeatures = selectedPlan === '999' ? [
//         "📚 1 Hr Live Class (Daily)",
//         "📅 5 Days/Week (Mon-Fri)",
//         "👥 Max 8 Students Batch",
//         "🎥 Recording Access"
//     ] : [
//         "📚 1 Hr Live Class (Daily)",
//         "📅 6 Days/Week (Mon-Sat)",
//         "💎 Max 3 Students (VIP)",
//         "🤝 Weekly Parent Meeting",
//         "🎯 Personal Curriculum"
//     ];

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden">
//                 {!isSuccess ? (
//                     <>
//                         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
//                             <DialogTitle className="text-2xl font-bold">Book Free Trial</DialogTitle>
//                             <DialogDescription className="text-blue-100 mt-1">Join 2000+ Happy Students today.</DialogDescription>
//                         </div>
                        
//                         <div className="p-6 space-y-5">
//                             {/* Plan Selection */}
//                             <div className="space-y-2">
//                                 <Label className="text-slate-900 font-semibold text-sm uppercase tracking-wider">Select Interest</Label>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <div 
//                                         onClick={() => setSelectedPlan('999')}
//                                         className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all relative ${selectedPlan === '999' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
//                                     >
//                                         {selectedPlan === '999' && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">BEST VALUE</div>}
//                                         <p className="font-bold text-slate-900">Small Group</p>
//                                         <p className="text-xs text-slate-500">₹999/mo</p>
//                                     </div>
//                                     <div 
//                                         onClick={() => setSelectedPlan('2999')}
//                                         className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all relative ${selectedPlan === '2999' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
//                                     >
//                                         {selectedPlan === '2999' && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">PREMIUM</div>}
//                                         <p className="font-bold text-slate-900">Semi-Private</p>
//                                         <p className="text-xs text-slate-500">₹2,999/mo</p>
//                                     </div>
//                                 </div>
                                
//                                 {/* Dynamic Features */}
//                                 <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
//                                     <div className="grid grid-cols-2 gap-x-2 gap-y-2">
//                                         {planFeatures.map((feature, idx) => (
//                                             <p key={idx} className="text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
//                                                 <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" /> {feature}
//                                             </p>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>

//                              {/* Time Slot */}
//                              <div className="space-y-2">
//                                 <Label className="text-slate-900 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
//                                     <Clock className="w-4 h-4 text-blue-600" /> Time Slot (Tomorrow)
//                                 </Label>
//                                 <div className="grid grid-cols-2 gap-2">
//                                     {['4:00 PM - 5:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'].map((slot) => (
//                                         <div 
//                                             key={slot}
//                                             onClick={() => setSelectedSlot(slot)}
//                                             className={`cursor-pointer border rounded-lg p-2 text-center text-xs font-medium transition-all ${selectedSlot === slot ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 hover:border-slate-300'}`}
//                                         >
//                                             {slot}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Inputs */}
//                             <div className="space-y-3">
//                                 <Input className="h-11 bg-slate-50" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" />
//                                 <Input className="h-11 bg-slate-50" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number (10-digit)" />
//                                 <Input className="h-11 bg-slate-50" id="class" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (e.g. 5th)" />
//                             </div>
//                         </div>

//                         <DialogFooter className="p-6 pt-0">
//                             <Button onClick={handleFreeBooking} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-200">
//                                 {loading ? (
//                                     <span className="flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5"/> Generating Pass...</span>
//                                 ) : 'Confirm Free Seat'}
//                             </Button>
//                         </DialogFooter>
//                     </>
//                 ) : (
//                     // SUCCESS SCREEN (ADMIT CARD)
//                     <div className="flex flex-col items-center justify-center text-center p-6 space-y-5 animate-in fade-in zoom-in duration-300 bg-slate-50 min-h-[400px]">
                        
//                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
//                             <CheckCircle className="w-8 h-8 text-green-600" />
//                         </div>
                        
//                         <div>
//                             <DialogTitle className="text-2xl font-extrabold text-slate-800">Booking Confirmed!</DialogTitle>
//                             <p className="text-slate-500 text-sm mt-1">Take a screenshot of your pass.</p>
//                         </div>

//                         {/* TICKET DESIGN */}
//                         <div className="bg-white border border-slate-200 p-0 rounded-2xl w-full text-left relative overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02]">
//                             <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
//                                 <span className="text-xs font-bold tracking-widest">BLANKLEARN PASS</span>
//                                 <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">ADMIT</span>
//                             </div>
//                             <div className="p-5 relative">
//                                 <div className="absolute top-4 right-4 opacity-10">
//                                     <QrCode className="w-16 h-16" />
//                                 </div>
//                                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Student Name</p>
//                                 <p className="font-bold text-xl text-slate-900 mb-3">{name}</p>
                                
//                                 <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
//                                     <div>
//                                         <p className="text-[10px] text-slate-400 uppercase font-bold">Class</p>
//                                         <p className="font-semibold text-slate-800">{className}</p>
//                                     </div>
//                                     <div className="text-right">
//                                         <p className="text-[10px] text-slate-400 uppercase font-bold">Time</p>
//                                         <p className="font-semibold text-blue-600">{selectedSlot}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-blue-50 p-2 text-center border-t border-slate-100">
//                                 <p className="text-xs text-blue-700 font-medium">Plan: {selectedPlan === '999' ? 'Small Group (₹999)' : 'Semi-Private (₹2999)'}</p>
//                             </div>
//                         </div>
                        
//                         <div className="w-full space-y-3">
//                             <Button 
//                                 className="w-full h-12 bg-black hover:bg-slate-800 text-white gap-2 shadow-lg"
//                                 onClick={() => window.open('https://play.google.com/store/apps/details?id=com.blank_learn.dark', '_blank')}
//                             >
//                                 <PlayCircle className="fill-current w-5 h-5" />
//                                 Download App to Join
//                             </Button>
//                             <p className="text-xs text-slate-400 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 inline-block">
//                                 🔔 Class link activates 10 mins before time
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </DialogContent>
//         </Dialog>
//     );
// };
// --- UPDATED DEMO BOOKING MODAL (SCROLL FIX) ---
const DemoBookingModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) => {
    const { toast } = useToast();
    
    // Form States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [className, setClassName] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('999'); 
    const [selectedSlot, setSelectedSlot] = useState('');

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setIsSuccess(false);
                setName('');
                setPhone('');
                setClassName('');
                setSelectedPlan('999');
                setSelectedSlot('');
            }, 300);
        }
    }, [open]);

    const handleFreeBooking = async () => {
        if (!name || !phone || !className || !selectedSlot) {
            toast({ title: 'Details Missing', description: 'Please fill all details.', variant: 'destructive' });
            return;
        }
        if (phone.length < 10) {
            toast({ title: 'Invalid Phone', description: 'Enter valid 10-digit number.', variant: 'destructive' });
            return;
        }

        setLoading(true);

        try {
            const sanitizedPhone = phone.replace(/\D/g, '');
            const bookingRef = ref(realtimeDb, `DemoBookings/${sanitizedPhone}`);
            
            await set(bookingRef, {
                studentName: name,
                mobileNumber: phone,
                studentClass: className,
                interestedPlan: selectedPlan === '999' ? 'Small Group (999)' : 'Semi-Private (2999)',
                demoTime: selectedSlot,
                status: "booked_free",
                bookingDate: new Date().toLocaleString(),
                isAppRegistered: false
            });
            
            import("react-facebook-pixel").then((x) => x.default).then((ReactPixel) => {
                ReactPixel.track('Lead', { value: 0, currency: 'INR' });
            });

            setTimeout(() => {
                setLoading(false);
                setIsSuccess(true);
                toast({ title: 'Success!', description: 'Your Admit Pass is ready.' });
            }, 1500);

        } catch (error) {
            console.error("Error", error);
            setLoading(false);
            toast({ title: 'Error', description: 'Network error. Try again.', variant: 'destructive' });
        }
    }

    const planFeatures = selectedPlan === '999' ? [
        "📚 1 Hr Live Class (Daily)",
        "📅 5 Days/Week (Mon-Fri)",
        "👥 Max 8 Students Batch",
        "🎥 Recording Access"
    ] : [
        "📚 1 Hr Live Class (Daily)",
        "📅 6 Days/Week (Mon-Sat)",
        "💎 Max 3 Students (VIP)",
        "🤝 Weekly Parent Meeting",
        "🎯 Personal Curriculum"
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                {!isSuccess ? (
                    <>
                        {/* HEADER - Fixed at Top */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center flex-shrink-0">
                            <DialogTitle className="text-2xl font-bold">Book Free Trial</DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">Join 2000+ Happy Students today.</DialogDescription>
                        </div>
                        
                        {/* SCROLLABLE CONTENT - Middle Part */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* 1. Plan Selection */}
                            <div className="space-y-2">
                                <Label className="text-slate-900 font-semibold text-xs uppercase tracking-wider">SELECT INTEREST</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div 
                                        onClick={() => setSelectedPlan('999')}
                                        className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all relative ${selectedPlan === '999' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        {selectedPlan === '999' && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</div>}
                                        <p className="font-bold text-slate-900 text-sm">Small Group</p>
                                        <p className="text-xs text-slate-500">₹999/mo</p>
                                    </div>
                                    <div 
                                        onClick={() => setSelectedPlan('2999')}
                                        className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all relative ${selectedPlan === '2999' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        {selectedPlan === '2999' && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">PREMIUM</div>}
                                        <p className="font-bold text-slate-900 text-sm">Semi-Private</p>
                                        <p className="text-xs text-slate-500">₹2,999/mo</p>
                                    </div>
                                </div>
                                
                                {/* Dynamic Features List */}
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                                        {planFeatures.map((feature, idx) => (
                                            <p key={idx} className="text-[10px] md:text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" /> {feature}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                             {/* 2. Time Slot */}
                             <div className="space-y-2">
                                <Label className="text-slate-900 font-semibold flex items-center gap-2 text-xs uppercase tracking-wider">
                                    <Clock className="w-3 h-3 text-blue-600" /> TIME SLOT (TOMORROW)
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['4:00 PM - 5:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'].map((slot) => (
                                        <div 
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`cursor-pointer border rounded-lg p-2 text-center text-[11px] font-medium transition-all ${selectedSlot === slot ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 hover:border-slate-300'}`}
                                        >
                                            {slot}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Inputs */}
                            <div className="space-y-3 pb-2">
                                <Input className="h-10 bg-slate-50 text-sm" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" />
                                <Input className="h-10 bg-slate-50 text-sm" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number (10-digit)" />
                                <Input className="h-10 bg-slate-50 text-sm" id="class" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (e.g. 5th)" />
                            </div>
                        </div>

                        {/* FOOTER - Fixed at Bottom */}
                        <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                            <Button onClick={handleFreeBooking} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-bold shadow-lg shadow-blue-200">
                                {loading ? (
                                    <span className="flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Confirming...</span>
                                ) : 'Confirm Free Seat'}
                            </Button>
                        </div>
                    </>
                ) : (
                    // SUCCESS SCREEN (ADMIT CARD) - Scrollable if needed
                    <div className="flex flex-col items-center justify-center text-center p-6 space-y-5 animate-in fade-in zoom-in duration-300 bg-slate-50 h-full overflow-y-auto">
                        
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner mt-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        
                        <div>
                            <DialogTitle className="text-2xl font-extrabold text-slate-800">Booking Confirmed!</DialogTitle>
                            <p className="text-slate-500 text-sm mt-1">Take a screenshot of your pass.</p>
                        </div>

                        {/* TICKET DESIGN */}
                        <div className="bg-white border border-slate-200 p-0 rounded-2xl w-full text-left relative overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02]">
                            <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
                                <span className="text-xs font-bold tracking-widest">BLANKLEARN PASS</span>
                                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">ADMIT</span>
                            </div>
                            <div className="p-5 relative">
                                <div className="absolute top-4 right-4 opacity-10">
                                    <QrCode className="w-16 h-16" />
                                </div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Student Name</p>
                                <p className="font-bold text-xl text-slate-900 mb-3">{name}</p>
                                
                                <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Class</p>
                                        <p className="font-semibold text-slate-800">{className}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Time</p>
                                        <p className="font-semibold text-blue-600">{selectedSlot}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-2 text-center border-t border-slate-100">
                                <p className="text-xs text-blue-700 font-medium">Plan: {selectedPlan === '999' ? 'Small Group (₹999)' : 'Semi-Private (₹2999)'}</p>
                            </div>
                        </div>
                        
                        <div className="w-full space-y-3 pb-4">
                            <Button 
                                className="w-full h-12 bg-black hover:bg-slate-800 text-white gap-2 shadow-lg"
                                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.blank_learn.dark', '_blank')}
                            >
                                <PlayCircle className="fill-current w-5 h-5" />
                                Download App to Join
                            </Button>
                            <p className="text-xs text-slate-400 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 inline-block">
                                🔔 Class link activates 10 mins before time
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
// --- COMPONENTS ---

const NavigationBar = ({ onBookDemoClick }: { onBookDemoClick: () => void; }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-lg shadow-sm" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Blanklearn</span>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200/50" onClick={onBookDemoClick}>
            Book Free Demo
        </Button>
      </div>
    </header>
  );
};

const HeroHeader = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 via-white to-white relative overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-6 border border-yellow-200 shadow-sm">
             <Star className="w-3 h-3 fill-current" /> 4.9/5 Rated by Parents
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Stop the Homework <span className="text-blue-600">Struggle.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Live interactive classes that kids actually love. Homework help, concept clarity, and confidence building—starting at just <span className="font-bold text-slate-900">₹999/mo</span>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold shadow-xl shadow-blue-200" onClick={onBookDemoClick}>
              Book Free Live Demo
            </Button>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600" /> No credit card needed
            </p>
          </div>
        </div>
        <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="grid grid-cols-2 gap-4">
                <Image src="/img2.png" alt="Child" width={500} height={400} className="rounded-2xl shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 border-4 border-white" />
                <Image src="/img1.png" alt="Parent" width={500} height={400} className="rounded-2xl shadow-2xl transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 mt-12 border-4 border-white" />
            </div>
        </div>
      </div>
    </div>
  </section>
);

const StudentHighlights = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    const videosRef = ref(realtimeDb, 'VideoUploads');
    const unsubscribe = onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const videoList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          url: value.videoUrl || value.postUrl || value.url,
          thumbnail: value.thumbnail || value.image || "", 
        }));
        setVideos(videoList);
      } else {
        setVideos([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePlay = (id: string) => {
    Object.keys(videoRefs.current).forEach((key) => {
      if (key !== id && videoRefs.current[key]) videoRefs.current[key]?.pause();
    });
    if (videoRefs.current[id]) videoRefs.current[id]?.play();
    setPlayingId(id);
  };

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold tracking-wider uppercase mb-4">
                Raw & Unscripted 🎥
            </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            See the Magic <span className="text-blue-400">Live.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Watch how our expert mentors make tough concepts easy in real-time.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.length > 0 ? videos.map((video) => (
                <div key={video.id} className={`relative group rounded-2xl overflow-hidden bg-black border border-slate-700 transition-all duration-300 ${playingId === video.id ? 'ring-2 ring-blue-500 shadow-2xl scale-105 z-10' : 'hover:scale-[1.02]'}`} style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    className="w-full h-full object-cover"
                    src={video.url}
                    controls={playingId === video.id}
                    controlsList="nodownload noremoteplayback"
                    playsInline
                    poster={video.thumbnail}
                    onPlay={() => setPlayingId(video.id)}
                    onEnded={() => setPlayingId(null)}
                  />
                  {playingId !== video.id && (
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer" onClick={() => handlePlay(video.id)}>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-xl group-hover:scale-110 transition-transform">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner text-blue-600"><Play className="w-5 h-5 fill-current ml-1" /></div>
                      </div>
                    </div>
                  )}
                </div>
              )) : <p className="text-center col-span-full text-slate-500">No videos available.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

const PainAndSolution = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Why Parents Choose Us?</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-red-50/50 border-red-100 hover:shadow-lg transition-all">
          <CardHeader><div className="mx-auto bg-white rounded-full p-4 shadow-sm w-fit"><Clock className="w-8 h-8 text-red-500" /></div><CardTitle className="mt-4 text-xl text-center">The Struggle</CardTitle></CardHeader>
          <CardContent><p className="text-center text-slate-600">Coming home tired to pending homework battles. It drains family time.</p></CardContent>
        </Card>
        <Card className="bg-yellow-50/50 border-yellow-100 hover:shadow-lg transition-all">
          <CardHeader><div className="mx-auto bg-white rounded-full p-4 shadow-sm w-fit"><AlertTriangle className="w-8 h-8 text-yellow-500" /></div><CardTitle className="mt-4 text-xl text-center">The Crowd</CardTitle></CardHeader>
          <CardContent><p className="text-center text-slate-600">Local tuitions pack 50+ kids. Your child is just a number lost in the crowd.</p></CardContent>
        </Card>
        <Card className="bg-blue-600 text-white shadow-xl shadow-blue-200 cursor-pointer hover:scale-105 transition-transform border-none" onClick={onBookDemoClick}>
          <CardHeader><div className="mx-auto bg-white/20 rounded-full p-4 w-fit"><CheckCircle className="w-8 h-8 text-white" /></div><CardTitle className="mt-4 text-xl text-center">The Solution</CardTitle></CardHeader>
          <CardContent>
            <p className="text-center opacity-90">Small Batches (Max 8). Personal attention. Homework done in class.<br/><span className="font-bold underline mt-4 inline-block">Try Free Demo →</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

const ProductFeatures = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => {
    const features = [
        { icon: <Users className="w-8 h-8 text-blue-600" />, title: "Small Batches (1:8)", desc: "Every child speaks. Every child is heard. No backbenchers here." },
        { icon: <FileText className="w-8 h-8 text-blue-600" />, title: "Homework Support", desc: "We finish school homework during class so your evenings are free." },
        { icon: <Target className="w-8 h-8 text-blue-600" />, title: "Visual Learning", desc: "No rote memorization. We use 3D models & stories to explain concepts." },
        { icon: <BarChart className="w-8 h-8 text-blue-600" />, title: "Progress Reports", desc: "Weekly WhatsApp updates on exactly how your child is improving." },
    ];
    return (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">More Than Just Tuition.</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <div key={i} onClick={onBookDemoClick} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="mb-6 bg-blue-50 w-fit p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">{f.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    );
};

const SocialProof = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  
  useEffect(() => {
    const reviewsRef = ref(realtimeDb, 'reviews');
    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setReviews(Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          name: value.name || "Parent",
          attribution: value.attribution || "",
          imageUrl: value.imageUrl || "", 
          rating: value.rating || 5,      
          reviewText: value.reviewText || value.text || "No review.", 
          tag: value.statusTag || ""      
        })));
      }
    });
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">What Parents Are Saying</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors relative">
                  <Quote className="w-10 h-10 text-blue-100 absolute top-4 right-4" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                        {review.imageUrl ? <img src={review.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500 text-lg font-bold">{review.name[0]}</div>}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                        <div className="flex text-yellow-400 gap-0.5 mt-1">{Array(5).fill(0).map((_,i)=><Star key={i} className={`w-3 h-3 ${i<review.rating?'fill-current':''}`}/>)}</div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed relative z-10">"{review.reviewText}"</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

const PricingPlan = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Simple, Affordable Pricing.</h2>
                <p className="mt-4 text-slate-600">Quality education shouldn't be expensive.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Plan 1 */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
                    <div className="p-8 text-center border-b border-slate-50">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                        <h3 className="text-2xl font-bold text-slate-900 mt-4">Small Group</h3>
                        <div className="flex justify-center items-baseline mt-4 gap-1">
                            <span className="text-5xl font-extrabold text-slate-900">₹999</span>
                            <span className="text-slate-500">/mo</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-2">Max 8 Students • Daily Classes</p>
                    </div>
                    <div className="p-8 bg-slate-50/50">
                        <ul className="space-y-4 mb-8">
                            {['Live Classes (Mon-Fri)', 'Homework Help Included', 'Recording Access', 'Monthly PTM'].map((f, i)=>(
                                <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0"/> {f}</li>
                            ))}
                        </ul>
                        <Button onClick={onBookDemoClick} className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg">Choose Plan</Button>
                    </div>
                </div>

                {/* Plan 2 */}
                <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-600 overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="bg-blue-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">Premium Attention</div>
                    <div className="p-8 text-center border-b border-slate-50">
                        <h3 className="text-2xl font-bold text-slate-900">Semi-Private</h3>
                        <div className="flex justify-center items-baseline mt-4 gap-1">
                            <span className="text-5xl font-extrabold text-slate-900">₹2,999</span>
                            <span className="text-slate-500">/mo</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-2">Max 3 Students • VIP Focus</p>
                    </div>
                    <div className="p-8 bg-blue-50/30">
                        <ul className="space-y-4 mb-8">
                            {['Live Classes (Mon-Sat)', 'Dedicated Mentor', 'Personalized Curriculum', 'Weekly Parents Meeting'].map((f, i)=>(
                                <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0"/> {f}</li>
                            ))}
                        </ul>
                        <Button onClick={onBookDemoClick} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-200">Choose Plan</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FinalFAQ = () => (
    <section className="py-24 bg-white">
        <div className="container max-w-3xl mx-auto px-4">
            <div className="text-center mb-12"><h2 className="text-3xl font-extrabold text-slate-900">Common Questions</h2></div>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                    {q: "Is it Live or Recorded?", a: "100% Live & Interactive on our App."},
                    {q: "What if I miss a class?", a: "Recordings are available instantly on the App."},
                    {q: "Is there a Refund Policy?", a: "Yes! 7-Day Money Back Guarantee. No questions asked."},
                    {q: "Do I need a laptop?", a: "Not at all. Our App runs smoothly on any Android phone."},
                    {q: "Which boards do you cover?", a: "We cover CBSE, ICSE, and major State Boards curriculum."},
                ].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-slate-50 rounded-xl px-6 border-none data-[state=open]:bg-blue-50 transition-colors">
                        <AccordionTrigger className="font-semibold text-slate-900 text-lg py-4 hover:no-underline">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-slate-600 pb-4 leading-relaxed">{item.a}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
);

const Footer = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
    <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Ready to boost your child's grades?</h2>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-10 text-lg font-bold shadow-lg shadow-blue-500/30 mb-12" onClick={onBookDemoClick}>
            Book Free Demo Now
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-800 pt-8 gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded opacity-80" />
              <span className="font-bold text-white">Blanklearn</span>
            </div>
            <div className="flex gap-6 text-sm">
                <a href="/policies" className="hover:text-white transition-colors">Privacy</a>
                <a href="/policies" className="hover:text-white transition-colors">Terms</a>
                <a href="/policies" className="hover:text-white transition-colors">Refunds</a>
            </div>
            <p className="text-xs text-slate-500">© 2025 Blanklearn Education.</p>
        </div>
    </div>
  </footer>
);

const StickyBookingBar = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const toggle = () => setIsVisible(window.scrollY > 400);
        window.addEventListener('scroll', toggle);
        return () => window.removeEventListener('scroll', toggle);
    }, []);

    return (
        <div className={cn("fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 transition-transform md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]", isVisible ? 'translate-y-0' : 'translate-y-full')}>
            <div className="flex justify-between items-center">
                <div><p className="font-bold text-slate-900 text-sm">🔥 Limited Seats</p><p className="text-xs text-green-600 font-medium">Free for today</p></div>
                <Button className="bg-blue-600 text-white font-bold" onClick={onBookDemoClick}>Book Now</Button>
            </div>
        </div>
    )
}

export default function HomePage() {
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const handleBookDemoClick = () => setDemoModalOpen(true);
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <Suspense fallback={null}>
        <DemoBookingModal open={isDemoModalOpen} onOpenChange={setDemoModalOpen} />
      </Suspense>
      <NavigationBar onBookDemoClick={handleBookDemoClick} />
      <main>
        <HeroHeader onBookDemoClick={handleBookDemoClick} />
        <StudentHighlights />
        <PainAndSolution onBookDemoClick={handleBookDemoClick} />
        <ProductFeatures onBookDemoClick={handleBookDemoClick} />
        <SocialProof />
        <PricingPlan onBookDemoClick={handleBookDemoClick} />
        <FinalFAQ />
      </main>
      <Footer onBookDemoClick={handleBookDemoClick} />
      <StickyBookingBar onBookDemoClick={handleBookDemoClick} />
    </div>
  );
}
// 'use client';
// import { ref, onValue, push, set } from "firebase/database";

// import { realtimeDb } from "@/lib/firebase"; 
// import { Quote } from 'lucide-react'; // Icon ke liye
// import ReactPixel from 'react-facebook-pixel'; // Top par add karein
// import React, { useState, useEffect, useRef, Suspense } from 'react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';
// import {
//   Users,
//   Target,
//   FileText,
//   BarChart,
//   PlayCircle,
//   Star,
//   CheckCircle,
//   Clock,
//   AlertTriangle,
//   Gift,
//   Loader2, // <--- YE ADD KAREIN
//   Play, 
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import imageData from '@/lib/placeholder-images.json';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const loadScript = (src: string) => {
//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = src;
//     script.onload = () => {
//       resolve(true);
//     };
//     script.onerror = () => {
//       resolve(false);
//     };
//     document.body.appendChild(script);
//   });
// };
// const DemoBookingModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) => {
//     const { toast } = useToast();
//     const [phone, setPhone] = useState('');
//     const [className, setClassName] = useState('');
//     const [loading, setLoading] = useState(false);
    
//     // Ye naya state hai: Check karega ki booking ho gayi ya nahi
//     const [isSuccess, setIsSuccess] = useState(false);

//     // Jab modal close ho, to form reset kar do
//     useEffect(() => {
//         if (!open) {
//             setTimeout(() => {
//                 setIsSuccess(false);
//                 setPhone('');
//                 setClassName('');
//             }, 300);
//         }
//     }, [open]);

//     const handlePayment = async () => {
//         // Validation
//         if (!phone || !className) {
//             toast({ title: 'Details Missing', description: 'Please enter Number and Class.', variant: 'destructive' });
//             return;
//         }

//         setLoading(true);
        
//         const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
//         if (!res) {
//             setLoading(false);
//             return;
//         }

//         const options = {
//             key: "rzp_live_6vd9RApruseTAi", // Aapki Key
//             amount: "100",
//             currency: "INR",
//             name: "Blanklearn",

//             description: "Demo Class Booking",
            
//             // --- SUCCESS HANDLER ---
//             handler: function (response: any) {
//                 setLoading(false);
                
//                 // 1. Firebase Save Logic
//                 try {
//                     const bookingsRef = ref(realtimeDb, 'DemoBookings');
//                     const newBookingRef = push(bookingsRef);
//                     set(newBookingRef, {
//                         mobileNumber: phone,
//                         studentClass: className,
//                         paymentId: response.razorpay_payment_id,
//                         timestamp: new Date().toLocaleString()
//                     });
//                 } catch (error) {
//                     console.error("Database save failed", error);
//                 }

//                 // 2. WhatsApp HATA DIYA hai.
//                  import("react-facebook-pixel").then((x) => x.default).then((ReactPixel) => {
//         ReactPixel.track('Purchase', { 
//             value: 10.00, 
//             currency: 'INR',
//             content_name: 'Demo Class Booking'
//         });
//     });
//                 // 3. Success Screen dikhana
//                 setIsSuccess(true);
//                 toast({ title: 'Booking Confirmed!', description: 'Please download the app.' });
//             },
//             prefill: {
//                 contact: phone,
//             },
//             theme: {
//                 color: "#3F51B5"
//             }
//         };

//         const paymentObject = new window.Razorpay(options);
//         paymentObject.open();
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-md">
                
//                 {/* LOGIC: Agar Success nahi hua to Form dikhao, nahi to App Download dikhao */}
//                 {!isSuccess ? (
//                     <>
//                         <DialogHeader>
//                             <DialogTitle>Book Your Demo Session</DialogTitle>
//                             <DialogDescription>Fill details to schedule live demo for ₹10.</DialogDescription>
//                         </DialogHeader>
//                         <div className="space-y-4 py-4">
//                             <div>
//                                 <Label htmlFor="phone">Your WhatsApp Number</Label>
//                                 <Input 
//                                     id="phone" 
//                                     type="tel" 
//                                     value={phone} 
//                                     onChange={(e) => setPhone(e.target.value)} 
//                                     placeholder="Enter 10-digit number" 
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="class">Class / Grade</Label>
//                                 <Input 
//                                     id="class" 
//                                     value={className} 
//                                     onChange={(e) => setClassName(e.target.value)} 
//                                     placeholder="e.g., Class 5" 
//                                 />
//                             </div>
//                         </div>
//                         <DialogFooter>
//                             <Button onClick={handlePayment} disabled={loading} className="w-full glowing-button">
//                                 {loading ? 'Processing...' : 'Pay ₹10 & Book'}
//                             </Button>
//                         </DialogFooter>
//                     </>
//                 ) : (
//                     // --- SUCCESS SCREEN (App Download) ---
//                     <div className="flex flex-col items-center justify-center text-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
//                         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
//                             <CheckCircle className="w-10 h-10 text-green-600" />
//                         </div>
                        
//                         <DialogTitle className="text-2xl font-bold text-green-700">Booking Confirmed!</DialogTitle>
                        
//                         <p className="text-slate-600">
//                             Thank you! To join your class, please download the <span className="font-bold text-slate-900">Blanklearn App</span> now.
//                         </p>
                        
//                         <div className="w-full pt-4">
//                             <Button 
//                                 className="w-full h-14 text-lg bg-black hover:bg-slate-800 text-white gap-2 shadow-xl"
//                                 onClick={() => window.open('https://play.google.com/store/apps/details?id=com.blank_learn.dark', '_blank')}
//                             >
//                                 <PlayCircle className="fill-current" />
//                                 Download Android App
//                             </Button>
//                         </div>
                        
//                         <p className="text-xs text-slate-400 mt-4">
//                             Your class details will be visible inside the app.
//                         </p>
//                     </div>
//                 )}

//             </DialogContent>
//         </Dialog>
//     );
// };

// // Section 1: Navigation Bar
// // Section 1: Navigation Bar
// const NavigationBar = ({ onBookDemoClick }: { onBookDemoClick: () => void; }) => {
//   return (
//     <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
//         {/* LOGO WALA HISSA */}
//         <div className="flex items-center gap-2">
           
//            {/* Purana SVG hata diya, ab ye Image tag lagayein */}
//            <Image 
//              src="/logo.jpg" 
//              alt="Blanklearn Logo" 
//              width={40} 
//              height={40} 
//              className="rounded-full object-cover" // Thoda gol (round) dikhne ke liye
//            />

//           <span className="text-2xl font-bold text-primary">Blanklearn</span>
//         </div>

//         <div className="flex items-center gap-2 md:gap-4">
//           {/* ... Login Button code ... */}
//           <Button className="glowing-button" onClick={onBookDemoClick}>Book Demo @ ₹10</Button>
//         </div>
//       </div>
//     </header>
//   );
// };


// // Section 2: Hero Header
// const HeroHeader = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
//   <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
//     <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-primary/5 opacity-50 -z-1"></div>
//     <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-accent/5 opacity-50 -z-1"></div>
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="grid lg:grid-cols-2 gap-12 items-center">
//         <div className="text-center lg:text-left">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
//             Your Child’s After-School Studies, Fully Managed While You Work.
//           </h1>
//           <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
//             Interactive Live Classes in Small Groups (Max 5 Students). Homework help, concept clearing, and skill building—all inside one app.
//           </p>
//           <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
//             <Button size="lg" className="w-full sm:w-auto glowing-button text-lg h-14 px-8" onClick={onBookDemoClick}>
//               Book 1-Hour Live Demo for ₹10
//             </Button>
//           </div>
//           <p className="mt-4 text-sm text-slate-500 font-semibold">
//             Trusted by 2000+ Working Parents | No Hidden Charges
//           </p>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//     {/* Pehli Image: Bachha (img2) */}
//     <Image
//         src="/img2.png"
//         alt="Child learning on tablet"
//         width={500}
//         height={400}
//         className="rounded-2xl shadow-xl transform rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-transform duration-300"
//     />
    
//     {/* Dusri Image: Parent (img1) */}
//     <Image
//         src="/img1.png"
//         alt="Parent working on laptop"
//         width={500}
//         height={400}
//         className="rounded-2xl shadow-xl transform rotate-[3deg] hover:rotate-0 hover:scale-105 transition-transform duration-300 mt-8"
//     />
// </div>
//       </div>
//     </div>
//   </section>
// );

// // Section 3: Pain & Solution
// const PainAndSolution = () => (
//   <section className="py-20 md:py-28 bg-white">
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="text-center mb-12 md:mb-16">
//         <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">End the Evening Homework Struggle.</h2>
//       </div>
//       <div className="grid md:grid-cols-3 gap-8 text-center">
//         <Card className="bg-white shadow-lg rounded-2xl p-6 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 border-red-200">
//           <CardHeader>
//             <div className="mx-auto bg-red-100 rounded-full p-3 w-fit">
//               <Clock className="w-8 h-8 text-red-500" />
//             </div>
//             <CardTitle className="mt-4 text-xl md:text-2xl">The Problem</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-slate-600">You come home tired, only to find pending homework and looming exams. The daily battle drains your energy and strains family time.</p>
//           </CardContent>
//         </Card>
//         <Card className="bg-white shadow-lg rounded-2xl p-6 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 border-yellow-200">
//           <CardHeader>
//             <div className="mx-auto bg-yellow-100 rounded-full p-3 w-fit">
//               <AlertTriangle className="w-8 h-8 text-yellow-500" />
//             </div>
//             <CardTitle className="mt-4 text-xl md:text-2xl">The Gap</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-slate-600">Big coaching centers have 50+ kids where your child is just a number, lost in the crowd and unable to get personal attention.</p>
//           </CardContent>
//         </Card>
//         <Card className="bg-primary text-white shadow-xl rounded-2xl p-6 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 ring-4 ring-primary/20">
//           <CardHeader>
//             <div className="mx-auto bg-white/20 rounded-full p-3 w-fit">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <CardTitle className="mt-4 text-xl md:text-2xl">The Solution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="opacity-90">Our small-batch "Micro-Classrooms" ensure your child gets the attention they deserve while you reclaim your personal time and peace of mind.</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   </section>
// );


// // Section 4: Product Features
// const features = [
//   {
//     icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
//     title: "1:5 Interaction Ratio",
//     description: "Every child's camera is on. Every child speaks. Every child is heard. No one is left behind.",
//   },
//   {
//     icon: <FileText className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
//     title: "Homework Assistance",
//     description: "We help finish school assignments so your family time stays stress-free and enjoyable.",
//   },
//   {
//     icon: <Target className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
//     title: "Concept Mastery",
//     description: "Using 3D visuals, interactive simulations, and storytelling to make Math and Science fun.",
//   },
//   {
//     icon: <BarChart className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
//     title: "Daily Progress Reports",
//     description: "Automated WhatsApp updates on your child’s participation, performance, and areas of improvement.",
//   },
// ];

// const ProductFeatures = () => (
//   <section className="py-20 md:py-28 bg-slate-50">
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="text-center mb-12 md:mb-16">
//         <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Not Just a Class, An All-In-One Growth Hub.</h2>
//         <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
//           We provide a holistic learning ecosystem designed for real growth and understanding.
//         </p>
//       </div>
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {features.map((feature, index) => (
//           <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
//             <div className="mb-4">{feature.icon}</div>
//             <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
//             <p className="text-slate-600 text-sm md:text-base">{feature.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// // Section 5: The "₹1 Demo" Breakdown
// const DemoBreakdown = () => (
//     <section className="py-20 md:py-28 bg-white">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Experience the Magic for just ₹10.</h2>
//           <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
//             Completely transparent. See if we're the right fit for your child.
//           </p>
//         </div>
//         <div className="relative max-w-4xl mx-auto">
//             <div className="absolute top-8 left-0 w-full h-0.5 bg-border -translate-y-1/2 -z-10 hidden md:block"></div>
//           <div className="grid md:grid-cols-4 gap-x-8 gap-y-12">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">1</div>
//               <h3 className="font-bold text-lg md:text-xl">Pay ₹10</h3>
//               <p className="text-slate-600 mt-2 text-sm md:text-base">A nominal fee to ensure a focused, small-group environment for committed learners.</p>
//             </div>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">2</div>
//               <h3 className="font-bold text-lg md:text-xl">Pick a Slot</h3>
//               <p className="text-slate-600 mt-2 text-sm md:text-base">Choose a convenient time that fits perfectly with your child's school schedule.</p>
//             </div>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">3</div>
//               <h3 className="font-bold text-lg md:text-xl">Join via App</h3>
//               <p className="text-slate-600 mt-2 text-sm md:text-base">Download our App and enter the live interactive classroom with just one simple tap.</p>
//             </div>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-md z-10">4</div>
//               <h3 className="font-bold text-lg md:text-xl">Get a Report</h3>
//               <p className="text-slate-600 mt-2 text-sm md:text-base">After 60 minutes, receive an AI-generated analysis of your child's strengths and areas for growth.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
// );


// // Section 6: Meet the Mentors
// const mentors = [
//   {
//     name: "Priya Sharma",
//     experience: "8+ Years in Child Pedagogy",
//     expertise: "Specialist in Singapore Math",
//     image: imageData.mentor1
//   },
//   {
//     name: "Rohan Verma",
//     experience: "10+ Years in Primary Education",
//     expertise: "Expert in Phonics & Reading",
//     image: imageData.mentor2
//   },
//   {
//     name: "Anjali Singh",
//     experience: "7+ Years in Science Education",
//     expertise: "Makes complex science fun",
//     image: imageData.mentor3
//   }
// ];

// // Imports check kar lein (top of file):
// // import { ref, onValue } from "firebase/database";
// // import { realtimeDb } from "@/lib/firebase";
// // import { Play, Pause, Loader2 } from "lucide-react"; // Icons chahiye honge

// const StudentHighlights = () => {
//   const [videos, setVideos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // Kaunsa video play ho raha hai, uska ID track karne ke liye
//   const [playingId, setPlayingId] = useState<string | null>(null);
  
//   // Saare videos ko control karne ke liye Refs
//   const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

//   useEffect(() => {
//     const videosRef = ref(realtimeDb, 'VideoUploads');

//     const unsubscribe = onValue(videosRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const videoList = Object.entries(data).map(([key, value]: [string, any]) => ({
//           id: key,
//           url: value.videoUrl || value.postUrl || value.url,
//           // Agar thumbnail hai to use karein, nahi to blank
//           thumbnail: value.thumbnail || value.image || "", 
//         }));
//         setVideos(videoList);
//       } else {
//         setVideos([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Function: Jab user kisi video par click kare
//   const handlePlay = (id: string) => {
//     // 1. Agar koi aur video chal raha hai, to usse pause karo
//     Object.keys(videoRefs.current).forEach((key) => {
//       if (key !== id && videoRefs.current[key]) {
//         videoRefs.current[key]?.pause();
//       }
//     });

//     // 2. Current video ko play karo
//     if (videoRefs.current[id]) {
//       videoRefs.current[id]?.play();
//     }
    
//     // 3. State set karo
//     setPlayingId(id);
//   };

//   // Function: Jab video pause ho jaye
//   const handlePause = (id: string) => {
//     if (playingId === id) {
//       setPlayingId(null);
//     }
//   };

//   return (
//     <section className="py-20 md:py-28 bg-slate-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Heading */}
//         <div className="text-center mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Meet the educators behind the learning</h2>
//           <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
// Passionate teachers who explain with patience, care deeply about every student, and focus on real understanding — not pressure</p>
//         </div>

//         {/* Video Grid */}
//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <Loader2 className="w-8 h-8 animate-spin text-primary" />
//             <span className="ml-2 text-slate-500">Loading Highlights...</span>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {videos.length > 0 ? (
//               videos.map((video) => (
//                 <div 
//                   key={video.id} 
//                   className={`relative group rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-200 transition-all duration-300 ${playingId === video.id ? 'ring-2 ring-primary shadow-2xl scale-[1.02]' : 'hover:shadow-xl'}`}
//                   style={{ aspectRatio: '16/9' }} // Fixed Aspect Ratio
//                 >
                  
//                   {/* Video Player */}
//                   <video
//                     ref={(el) => { videoRefs.current[video.id] = el; }}
//                     className="w-full h-full object-cover"
//                     src={video.url}
//                     controls={playingId === video.id} // Controls tabhi dikhenge jab play hoga
//                     controlsList="nodownload noremoteplayback" // Extra options hide karna
//                     playsInline
//                     poster={video.thumbnail} // Agar thumbnail hai
//                     onPlay={() => setPlayingId(video.id)} // Native play click handle
//                     onPause={() => handlePause(video.id)}
//                     onEnded={() => setPlayingId(null)}
//                   />

//                   {/* Custom Play Button Overlay (Sirf tab dikhega jab video PAUSED ho) */}
//                   {playingId !== video.id && (
//                     <div 
//                       className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer"
//                       onClick={() => handlePlay(video.id)}
//                     >
//                       {/* Play Button Circle */}
//                       <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform duration-300">
//                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
//                             <Play className="w-5 h-5 text-primary ml-1 fill-current" />
//                          </div>
//                       </div>
                      
//                       {/* Optional: Title or Tag overlay */}
//                       <div className="absolute bottom-4 left-4 right-4">
//                         <p className="text-white text-sm font-medium opacity-90 truncate drop-shadow-md">
//                           Click to watch class snippet
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                 </div>
//               ))
//             ) : (
//               <p className="text-center col-span-full text-slate-500">No videos available right now.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// // Imports check kar lein (top of file):
// // import { Star, Quote } from 'lucide-react';
// // import { ref, onValue } from "firebase/database";
// // import { realtimeDb } from "@/lib/firebase";

// const SocialProof = () => {
//   const [reviews, setReviews] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const reviewsRef = ref(realtimeDb, 'reviews');

//     const unsubscribe = onValue(reviewsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const loadedReviews = Object.entries(data).map(([key, value]: [string, any]) => ({
//           id: key,
//           // IMPORTANT: Yahan maine aapke database fields ke hisaab se naam change kiye hain
//           name: value.name || "Parent",
//           attribution: value.attribution || "",
//           imageUrl: value.imageUrl || "", // Profile Image
//           rating: value.rating || 5,      // Rating (Default 5)
//           reviewText: value.reviewText || value.text || "No review text provided.", // Review Text
//           tag: value.statusTag || ""      // Tag like "Students class 4"
//         }));
//         setReviews(loadedReviews);
//       } else {
//         setReviews([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Helper function stars dikhane ke liye
//   const renderStars = (count: number) => {
//     return Array(5).fill(0).map((_, i) => (
//       <Star key={i} className={`w-4 h-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
//     ));
//   };

//   return (
//     <section className="py-20 md:py-28 bg-white">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Header Section */}
//         <div className="text-center mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">What Other Busy Parents Say.</h2>
//           <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
//             Real stories from parents who've reclaimed their evenings.
//           </p>
//         </div>

//         {/* Reviews Grid (Video Section REMOVED) */}
//         {loading ? (
//           <div className="text-center py-10">
//             <p className="text-lg text-slate-500">Loading reviews...</p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {reviews.length > 0 ? (
//               reviews.map((review) => (
//                 <div key={review.id} className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                  
//                   {/* Top: Profile Info */}
//                   <div className="flex items-center gap-4 mb-4">
//                     {/* Profile Image */}
//                     <div className="relative w-14 h-14 flex-shrink-0">
//                       {review.imageUrl ? (
//                         <img 
//                           src={review.imageUrl} 
//                           alt={review.name} 
//                           className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
//                         />
//                       ) : (
//                         <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
//                           {review.name.charAt(0)}
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Name & Tag */}
//                     <div>
//                       <h4 className="font-bold text-slate-900 leading-tight">{review.name}</h4>
//                       {review.tag && (
//                         <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mt-1 font-medium">
//                           {review.tag}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Rating Stars */}
//                   <div className="flex gap-1 mb-3">
//                     {renderStars(review.rating)}
//                   </div>

//                   {/* Review Text */}
//                   <div className="relative">
//                     <Quote className="w-8 h-8 text-slate-200 absolute -top-2 -left-2 -z-10" />
//                     <p className="text-slate-700 text-sm md:text-base leading-relaxed">
//                       "{review.reviewText}"
//                     </p>
//                   </div>

//                   {/* Bottom Attribution (e.g. Father of...) */}
//                   {review.attribution && (
//                     <div className="mt-4 pt-4 border-t border-slate-200">
//                       <p className="text-xs text-slate-500 font-medium text-right">
//                         {review.attribution}
//                       </p>
//                     </div>
//                   )}

//                 </div>
//               ))
//             ) : (
//               <p className="text-center col-span-full text-slate-500">No reviews found.</p>
//             )}
//           </div>
//         )}

//         {/* Overall Rating Footer */}
//         <div className="mt-12 text-center">
//             <div className="inline-flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-full border border-slate-200">
//                 <div className="flex text-yellow-400 gap-1">
//                     <Star className="w-5 h-5 fill-current" />
//                     <Star className="w-5 h-5 fill-current" />
//                     <Star className="w-5 h-5 fill-current" />
//                     <Star className="w-5 h-5 fill-current" />
//                     <Star className="w-5 h-5 fill-current" />
//                 </div>
//                 <span className="font-bold text-slate-900">4.9/5.0</span>
//                 <span className="text-slate-500 text-sm">from happy parents</span>
//             </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// // Section 8: The Pricing Plan
// const PricingPlan = () => (
//     <section className="py-20 md:py-28 bg-slate-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12 md:mb-16">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing.</h2>
//                 <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
//                     Choose the plan that's right for your child. No hidden fees.
//                 </p>
//             </div>
//             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//                 {/* Plan 1: Small Group */}
//                 <Card className="rounded-2xl shadow-lg bg-white transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col">
//                     <CardHeader className="text-center p-6 md:p-8">
//                         <p className="font-semibold text-base md:text-lg text-primary">Small Group Class</p>
//                         <CardTitle className="text-3xl md:text-4xl font-extrabold text-slate-800">₹2,000<span className="text-base font-medium text-slate-500">/month</span></CardTitle>
//                          <p className="text-sm text-slate-500">(Max 5 Students)</p>
//                     </CardHeader>
//                     <CardContent className="p-6 md:p-8 flex-grow">
//                         <ul className="space-y-4 text-slate-600 text-sm md:text-base">
//                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> 20 Live Interactive Classes</li>
//                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Daily Homework Help</li>
//                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> 24/7 Recording Access</li>
//                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Monthly Parent-Teacher Meeting</li>
//                         </ul>
//                     </CardContent>
//                     <div className="p-6 md:p-8 pt-0">
//                          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center text-sm font-semibold mb-6 flex items-center justify-center gap-2">
//                             <Gift className="w-5 h-5" />
//                             <span>₹500 OFF on your first month. Join in 5 days!</span>
//                          </div>
//                         <Button size="lg" className="w-full h-12 text-lg">Choose Plan</Button>
//                         <p className="mt-6 text-xs md:text-sm text-center text-slate-500">Pause or Cancel Anytime with one click.</p>
//                     </div>
//                 </Card>

//                 {/* Plan 2: 1-on-1 */}
//                 <Card className="rounded-2xl shadow-2xl border-2 border-primary bg-white transition-all hover:shadow-primary/20 hover:-translate-y-2 flex flex-col">
//                     <CardHeader className="text-center p-6 md:p-8 bg-primary text-primary-foreground rounded-t-xl">
//                         <p className="font-semibold text-base md:text-lg opacity-90">1-on-1 Private Class</p>
//                         <CardTitle className="text-3xl md:text-4xl font-extrabold">₹4,000<span className="text-base font-medium opacity-80">/month</span></CardTitle>
//                         <p className="text-sm opacity-80">(Undivided Attention)</p>
//                     </CardHeader>
//                     <CardContent className="p-6 md:p-8 flex-grow">
//                         <ul className="space-y-4 text-slate-600 text-sm md:text-base">
//                              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> <strong>All Small Group features, plus:</strong></li>
//                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Fully Personalized Curriculum</li>
//                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Flexible Class Scheduling</li>
//                             <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> Dedicated Academic Mentor</li>
//                         </ul>
//                     </CardContent>
//                     <div className="p-6 md:p-8 pt-0">
//                         <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center text-sm font-semibold mb-6 flex items-center justify-center gap-2">
//                             <Gift className="w-5 h-5" />
//                             <span>₹500 OFF on your first month. Join in 5 days!</span>
//                         </div>
//                         <Button size="lg" className="w-full h-12 text-lg glowing-button">Choose Plan</Button>
//                         <p className="mt-6 text-xs md:text-sm text-center text-slate-500">Pause or Cancel Anytime with one click.</p>
//                     </div>
//                 </Card>
//             </div>
//         </div>
//     </section>
// );



// // Section 9: The Final FAQ
// const faqItems = [
//     {
//         question: "Is the class Live or Recorded?",
//         answer: "It is 100% Live and Face-to-Face. Unlike recorded videos, your child can speak, ask doubts, and interact with the teacher in real-time. It's a two-way conversation, just like sitting in a physical classroom."
//     },
//     {
//         question: "Will classes happen daily?",
//         answer: "Classes are conducted 5-6 days a week. However, we are flexible! We create the schedule according to your child's availability and school timings."
//     },
//      // 3. Fee Structure (Aapka Point)
//     {
//         question: "What is the fee structure?",
//         answer: "We have two transparent plans: ₹2,000/month for Small Groups (1:5 ratio) and ₹4,000/month for 1-on-1 Private Tuition. The Demo class booking fee is just ₹10."
//     },
//     // 4. Syllabus (Extra Important)
//     {
//         question: "Do you cover the school syllabus?",
//         answer: "Yes, absolutely. We map our teaching directly to your child's school textbook (CBSE, ICSE, or State Board). Our goal is to help them score higher marks in their school exams."
//     },
    
//     // 6. Teacher Quality (Extra Important)
//     {
//         question: "Who are the teachers?",
//         answer: "We don't hire just anyone. Our mentors are top 1% educators selected after a rigorous 4-step interview process. They are trained specifically to keep children engaged online."
//     },
//     // 7. Device Requirement (Extra Important)
//     {
//         question: "Do I need a laptop for this?",
//         answer: "No, a laptop is not mandatory. Our App works perfectly on any Android mobile or Tablet. A stable internet connection is all you need."
//     },
//     {
//         question: "Is my payment secure?",
//         answer: "We use Razorpay, one of the most secure and trusted payment gateways in India. Your financial details are 100% safe."
//     },
//      {
//         question: "What subjects and grades do you cover?",
//         answer: "We cover Maths, Science, and English for Grades 1-8 across CBSE, ICSE, and major state boards. Our curriculum is designed to complement school studies."
//     }
// ];

// const FinalFAQ = () => (
//     <section className="py-20 md:py-28 bg-white">
//         <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
//                     Frequently Asked Questions
//                 </h2>
//             </div>
//             <Accordion type="single" collapsible className="w-full space-y-4">
//                 {faqItems.map((item, index) => (
//                     <AccordionItem key={index} value={`item-${index + 1}`} className="bg-slate-50 rounded-xl shadow-sm px-4 md:px-6 border hover:bg-white transition-colors">
//                         <AccordionTrigger className="text-left font-semibold text-base md:text-lg hover:no-underline">{item.question}</AccordionTrigger>
//                         <AccordionContent className="text-slate-600 pt-2 text-sm md:text-base">
//                             {item.answer}
//                         </AccordionContent>
//                     </AccordionItem>
//                 ))}
//             </Accordion>
//         </div>
//     </section>
// );


// // Section 10: The Footer
// const Footer = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
//   <footer className="bg-slate-800 text-slate-300">
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-white">Don't let another evening go to waste.</h2>
//         <div className="mt-8">
//             <Button size="lg" className="glowing-button h-14 px-8 md:px-10 text-lg" onClick={onBookDemoClick}>
//                 Book Your ₹10 Demo Session Now
//             </Button>
//         </div>
//     </div>
//     <div className="border-t border-slate-700">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Image 
//              src="/logo.jpg" 
//              alt="Blanklearn Logo" 
//              width={40} 
//              height={40} 
//              className="rounded-full object-cover" // Thoda gol (round) dikhne ke liye
//            />
//                 <span className="text-xl font-bold">Blanklearn</span>
//             </div>
//             <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 sm:mt-0">
//                 <a href="policies" className="hover:text-white text-sm">Terms of Service</a>
//                 <a href="policies" className="hover:text-white text-sm">Privacy Policy</a>
//                 <a href="policies" className="hover:text-white text-sm">Contact Us</a>
//                     <a href="/policies" className="hover:text-white text-sm">Refund Policy</a> {/* Ye line add karein */}

//             </div>
//             <p className="mt-4 sm:mt-0 text-sm text-slate-500 text-center">&copy; {new Date().getFullYear()} Blanklearn. All rights reserved.</p>
//         </div>
//     </div>
//   </footer>
// );

// const StickyBookingBar = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => {
//     const [isVisible, setIsVisible] = useState(false);
//     const [slotsLeft, setSlotsLeft] = useState(3);
//     const timerRef = useRef<NodeJS.Timeout | null>(null);

//     useEffect(() => {
//         const toggleVisibility = () => {
//             const footer = document.querySelector('footer');
//             if (!footer) return;
//             const footerReached = window.scrollY + window.innerHeight > footer.offsetTop;

//             if (window.scrollY > 300 && !footerReached) {
//                 setIsVisible(true);
//             } else {
//                 setIsVisible(false);
//             }
//         };

//         window.addEventListener('scroll', toggleVisibility);

//         return () => window.removeEventListener('scroll', toggleVisibility);
//     }, []);

//     useEffect(() => {
//         timerRef.current = setInterval(() => {
//             setSlotsLeft(prev => (prev > 1 ? prev - 1 : 3));
//         }, 5000);

//         return () => {
//             if (timerRef.current) {
//                 clearInterval(timerRef.current);
//             }
//         };
//     }, []);

//     return (
//         <div className={cn(
//             "fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t p-3 z-40 transform transition-transform duration-300 md:hidden",
//             isVisible ? 'translate-y-0' : 'translate-y-full'
//         )}>
//             <div className="container mx-auto px-4 flex justify-between items-center gap-4">
//                 <div>
//                      <p className="font-bold text-primary animate-pulse">Only {slotsLeft} slots left!</p>
//                      <p className="text-sm text-slate-600">For Grade 4 this week</p>
//                 </div>
//                 <Button className="glowing-button flex-shrink-0" onClick={onBookDemoClick}>
//                     Book @ ₹10
//                 </Button>
//             </div>
//         </div>
//     )
// }


// export default function HomePage() {
//   const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  
//   const handleBookDemoClick = () => {
//     setDemoModalOpen(true);
//   };
  
//   return (
//     <div className="flex flex-col min-h-screen bg-white text-foreground">
//       <Suspense fallback={<div>Loading...</div>}>
//         <DemoBookingModal open={isDemoModalOpen} onOpenChange={setDemoModalOpen} />
//       </Suspense>
//       <NavigationBar onBookDemoClick={handleBookDemoClick} />
//       <main>
//         <HeroHeader onBookDemoClick={handleBookDemoClick} />
        
// <StudentHighlights />
//         <PainAndSolution />
//         <ProductFeatures />
//         <DemoBreakdown />
 
//         <SocialProof />
//         <PricingPlan />
//         <FinalFAQ />
//       </main>
//       <Footer onBookDemoClick={handleBookDemoClick} />
//       <StickyBookingBar onBookDemoClick={handleBookDemoClick} />
//     </div>
//   );
// }
