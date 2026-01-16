'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react'; // <-- ADDED ArrowLeft HERE
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const EducatorLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast({ title: "Missing Credentials", description: "Please enter both Email and Password.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            // Attempt to sign in using Firebase Auth
            await signInWithEmailAndPassword(auth, email, password);
            
            // *** IMPORTANT: In a production system, you would also verify here 
            // if the logged-in user role in Firestore is actually 'educator' ***
            
            toast({ title: "Login Successful", description: "Welcome to the Educator Hub!" });
            setLoading(false);
            
            // Redirect to the main educator dashboard
            router.push('/educator'); 

        } catch (error: any) {
            console.error("Educator Login Error:", error);
            setLoading(false);
            
            let message = "Login failed. Please check credentials.";
            if (error.code === 'auth/wrong-password') {
                message = "Incorrect password.";
            } else if (error.code === 'auth/user-not-found') {
                message = "No educator account found with this email.";
            } else {
                message = error.message || message;
            }
            toast({ title: "Login Error", description: message, variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative">
            
            {/* Back Link to Home */}
            <Link href="/" className="absolute top-6 left-6 flex items-center text-sm text-slate-400 hover:text-blue-400 transition-colors z-10">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>

            <Card className="w-full max-w-md shadow-2xl border-t-4 border-blue-600 bg-white/5 backdrop-blur-md animate-in fade-in duration-500">
                <CardHeader className="text-center pt-8 pb-6 border-b border-white/10">
                    <div className="flex justify-center mb-3">
                        {/* NOTE: Ensure /logo.jpg exists or use a placeholder */}
                        <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-lg shadow-lg" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white">Educator Login</CardTitle>
                    <p className="text-md text-blue-300 mt-1">Access your teaching panel</p>
                </CardHeader>
                
                <CardContent className="p-8 space-y-5">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Educator Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-white/10 text-white placeholder:text-slate-400 focus:border-blue-400"
                            disabled={loading}
                            icon={<Mail className="w-4 h-4 text-slate-400" />}
                        />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-white/10 text-white placeholder:text-slate-400 focus:border-blue-400"
                            disabled={loading}
                            icon={<Lock className="w-4 h-4 text-slate-400" />}
                        />
                        
                        <Button 
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg shadow-blue-500/30"
                        >
                            {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin w-4 h-4" /> Verifying...</span> : 'Secure Login'}
                        </Button>
                    </form>

                    <p className="text-xs text-center text-slate-500 pt-3">
                        If you have issues, contact Admin Support.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default EducatorLoginPage;