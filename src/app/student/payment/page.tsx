'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Smartphone, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';

const PLAN_PRICE = '₹1,499';
const PLAN_NAME = "Standard Monthly Subscription (Group of 5)";

const PaymentPage = () => {
    const router = useRouter();
    const { toast } = useToast();

    // Security Check: Redirect if not logged in
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            router.push('/student/login');
        }
    }, [router]);
    
    // Function to handle the redirection/instruction logic
    const handlePaymentInstruction = () => {
        // This URL should point to your actual Play Store/App Store link
        const appStoreLink = 'https://play.google.com/store/apps/details?id=com.blank_learn.dark'; 
        
        // Simulate opening the app or direct user to download
        window.open(appStoreLink, '_blank');
        
        toast({
            title: "Redirecting to App",
            description: `Please complete your payment of ${PLAN_PRICE} within the Blanklearn App.`,
            duration: 5000,
        });
    }

    const handleGoToDashboard = () => {
        router.push('/student/dashboard');
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative">
            
            {/* Back Link */}
            <Link href="/student/dashboard" className="absolute top-6 left-6 flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors z-10">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>

            <Card className="w-full max-w-xl shadow-2xl border-t-4 border-blue-600 bg-white animate-in fade-in duration-500">
                <CardHeader className="text-center pt-8 pb-6 border-b border-slate-100">
                    <div className="flex justify-center mb-3">
                        <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-lg shadow-md" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">Complete Your Payment</CardTitle>
                    <p className="text-md text-slate-500 mt-1">To unlock your live classes.</p>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                    
                    {/* Plan Summary */}
                    <div className='border border-blue-100 bg-blue-50 p-4 rounded-xl text-center'>
                        <p className='text-sm font-medium text-blue-700'>Plan Selected:</p>
                        <p className='text-2xl font-extrabold text-slate-900 mt-1'>{PLAN_NAME}</p>
                        <p className='text-4xl font-extrabold text-blue-600 mt-2'>{PLAN_PRICE}</p>
                        <p className='text-xs text-slate-500'>Billed Monthly</p>
                    </div>

                    {/* App Instruction Block */}
                    <div className='bg-slate-900 p-6 rounded-xl text-white border border-slate-800 shadow-lg'>
                        <div className="flex items-center gap-3 mb-3">
                            <Smartphone className='w-6 h-6 text-yellow-400' />
                            <h3 className='text-xl font-bold text-white'>Payment via Mobile App</h3>
                        </div>
                        <p className='text-sm text-slate-300 mb-4'>
                            For a seamless and secure transaction, please complete your payment using the Blanklearn Mobile Application.
                        </p>
                        <Button 
                            onClick={handlePaymentInstruction} 
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-lg font-bold shadow-lg shadow-green-500/30"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" /> Open App / Download Now
                        </Button>
                        <p className='text-xs text-slate-400 mt-3 text-center'>
                            (If app is installed, it might open directly. Otherwise, you will be redirected to the Play Store.)
                        </p>
                    </div>

                    {/* Back Button */}
                    <div className='pt-2'>
                        <Button variant="ghost" onClick={handleGoToDashboard} className='w-full text-blue-600 hover:text-blue-700 p-0'>
                            Go back to Dashboard
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

export default PaymentPage;