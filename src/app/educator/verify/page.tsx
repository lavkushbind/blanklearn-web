'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, set } from "firebase/database";
import { realtimeDb } from "@/lib/firebase"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, ArrowLeft, Briefcase, GraduationCap, DollarSign, Users, Mail } from 'lucide-react'; // <-- ADDED Users and Mail
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const EducatorApplicationPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [experience, setExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleApplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !email || !phone || !subject || !experience) {
            toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        if (phone.length < 10) {
            toast({ title: "Invalid Phone", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
            return;
        }

        setLoading(true);
        // const sanitizedPhone = phone.replace(/\D/g, ''); // Not needed if phone is already sliced to 10 digits
        const applicationId = `APPL-${Date.now()}`;

        try {
            const applicationRef = ref(realtimeDb, `NewTeacherApplications/${applicationId}`);
            
            await set(applicationRef, {
                id: applicationId,
                fullName: name,
                mobileNumber: phone,
                email: email,
                primarySubject: subject,
                yearsOfExperience: experience,
                status: "pending_review",
                applicationDate: new Date().toLocaleString(),
            });

            toast({ title: "Application Sent!", description: "Thank you for applying. We will review your details shortly." });
            setLoading(false);
            setIsSubmitted(true);

        } catch (error) {
            console.error("Error submitting application:", error);
            setLoading(false);
            toast({ title: 'Submission Error', description: 'Could not submit application. Try again later.', variant: 'destructive' });
        }
    }

    const FormContent = (
        <form onSubmit={handleApplicationSubmit} className="space-y-5">
            
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    placeholder="Your Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={loading}
                    icon={<Users className='w-4 h-4' />}
                />
                <Input 
                    type="tel"
                    placeholder="Mobile Number (10 Digits)" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    disabled={loading}
                    icon={<DollarSign className='w-4 h-4' />} 
                />
            </div>
            
            <Input 
                type="email"
                placeholder="Professional Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
                icon={<Mail className='w-4 h-4' />} // Added Mail icon for completeness
            />
            
            {/* Qualification Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    placeholder="Subject Expertise (e.g., Maths, Physics)" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    disabled={loading}
                    icon={<GraduationCap className='w-4 h-4' />}
                />
                 <Input 
                    placeholder="Years of Experience (e.g., 5+ years)" 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)} 
                    disabled={loading}
                    icon={<Briefcase className='w-4 h-4' />}
                />
            </div>

            <Button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg shadow-blue-200/50 mt-6"
            >
                {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin w-4 h-4" /> Submitting Credentials...</span> : 'Submit Application'}
            </Button>
        </form>
    );

    const SuccessContent = (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
            <h3 className="text-2xl font-extrabold text-slate-900">Application Received!</h3>
            <p className="text-slate-600">Thank you, {name}. Your application has been successfully submitted for review. The Admin team will contact you on your provided mobile number once verified.</p>
            <Button onClick={() => router.push('/')} className="mt-4 bg-blue-600 hover:bg-blue-700">
                Go to Homepage
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative">
            
            <Link href="/" className="absolute top-6 left-6 flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors z-10">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>

            <Card className="w-full max-w-2xl shadow-2xl border-t-4 border-blue-600 bg-white animate-in fade-in duration-500">
                <CardHeader className="text-center pt-8 pb-6 border-b border-slate-100">
                    <div className="flex justify-center mb-3">
                        <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-lg shadow-md" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">Become an Educator</CardTitle>
                    <p className="text-md text-slate-500 mt-1">Fill out the form to join our expert team.</p>
                </CardHeader>
                
                <CardContent className="p-8">
                    {!isSubmitted ? FormContent : SuccessContent}
                </CardContent>
            </Card>
        </div>
    );
}

export default EducatorApplicationPage;