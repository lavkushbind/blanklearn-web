'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
    signInWithPhoneNumber, 
    RecaptchaVerifier, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, realtimeDb, RecaptchaVerifier as AuthRecaptchaVerifier } from "@/lib/firebase"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, ArrowLeft, Mail, Lock, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// ===================================================
// 1. OTP/PHONE LOGIN COMPONENT (Kept for future use/toggle)
// ===================================================
const OtpInputStep = ({ phoneNumber, onBack, onLoginSuccess }: { phoneNumber: string; onBack: () => void; onLoginSuccess: () => void }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const { toast } = useToast();
    
    const confirmationRef = useRef<any>(null); 

    const handleSendOTP = async () => {
        setLoading(true);
        if (typeof window !== 'undefined') {
            (window as any).recaptchaVerifier = new AuthRecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {
                    sendOTP(response);
                },
                expired: () => {
                    toast({ title: "OTP Expired", description: "Please try logging in again.", variant: "destructive" });
                    setLoading(false);
                    onBack();
                }
            });
            if ((window as any).recaptchaVerifier) {
                 (window as any).recaptchaVerifier.verify(); 
            }
        } else {
             setLoading(false);
             onBack();
        }
    };
    
    const sendOTP = async (response: any) => {
         try {
            const appVerifier = (window as any).recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            confirmationRef.current = confirmationResult; 
            setVerificationId(confirmationResult.verificationId);
            toast({ title: "OTP Sent", description: `We sent an OTP to ${phoneNumber}` });
            setLoading(false);
        } catch (error: any) {
            console.error("Error sending OTP:", error);
            toast({ title: "Error", description: `Failed to send OTP. (${error.code})`, variant: "destructive" });
            setLoading(false);
            onBack();
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            handleSendOTP();
        }
        return () => {
             if ((window as any).recaptchaVerifier) {
                delete (window as any).recaptchaVerifier;
            }
        };
    }, [phoneNumber]); 

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6 || !confirmationRef.current) return;

        setLoading(true);
        try {
            await confirmationRef.current.confirm(otp);
            toast({ title: "Login Successful", description: "Welcome back to your Dashboard!" });
            setLoading(false);
            onLoginSuccess(); 
        } catch (error: any) {
            console.error("Error verifying OTP:", error);
            setLoading(false);
            toast({ title: "Invalid OTP", description: "The code entered is incorrect or expired.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900">Verify OTP</h3>
                <p className="text-sm text-slate-500 mt-1">Code sent to: <span className="font-semibold text-slate-700">{phoneNumber}</span></p>
            </div>
            <Input
                id="otp" type="number" maxLength={6} placeholder="Enter 6-digit OTP" value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-12 text-center text-lg tracking-widest" disabled={loading}
            />
            <Button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold">
                {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin w-4 h-4" /> Verifying...</span> : 'Verify & Login'}
            </Button>
            <div className="flex justify-between items-center pt-2">
                <Button variant="link" size="sm" onClick={onBack} className="text-xs text-slate-500 p-0 hover:text-blue-600" disabled={loading}>
                    <ArrowLeft className="w-3 h-3 mr-1" /> Change Number
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSendOTP} className="text-xs p-0 text-blue-600" disabled={loading}>
                    Resend OTP
                </Button>
            </div>
            <div id="recaptcha-container" className='hidden'></div>
        </div>
    );
};

// ===================================================
// 2. EMAIL/PASSWORD LOGIN/SIGNUP COMPONENT
// ===================================================
const EmailPasswordForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast({ title: "Missing Credentials", description: "Please fill both email and password.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                toast({ title: "Login Successful", description: "Welcome back!" });
            } else {
                // Sign Up logic
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                toast({ title: "Signup Complete", description: "Your account is ready. You are now logged in." });
                
                // *** IMPORTANT: In a real app, after signup, you should also set up the student profile in Firestore here ***
            }
            
            setLoading(false);
            onLoginSuccess();

        } catch (error: any) {
            console.error("Auth Error:", error);
            setLoading(false);
            
            let message = "An unknown error occurred.";
            if (error.code === 'auth/wrong-password') {
                message = "Incorrect password.";
            } else if (error.code === 'auth/user-not-found') {
                message = "User not found. Try signing up.";
            } else if (error.code === 'auth/email-already-in-use') {
                message = "Email already registered. Please Login.";
            } else if (error.code === 'auth/weak-password') {
                message = "Password too weak (min 6 characters).";
            } else {
                message = error.message || "Login/Signup failed.";
            }
            toast({ title: isLogin ? "Login Failed" : "Signup Failed", description: message, variant: "destructive" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-slate-50 text-sm"
                disabled={loading}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
            />
            <Input
                id="password"
                type="password"
                placeholder="Password (Min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-slate-50 text-sm"
                disabled={loading}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
            />
            
            <Button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-lg shadow-blue-200"
            >
                {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin w-4 h-4" /> Processing...</span> : isLogin ? 'Login Securely' : 'Create Account'}
            </Button>

            <div className="text-center pt-2">
                <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm font-semibold p-0" type="button">
                    {isLogin ? "New User? Create Account" : "Already have an account? Login"}
                </Button>
            </div>
        </form>
    );
};

// ===================================================
// 3. MAIN LOGIN PAGE
// ===================================================
const StudentLoginPage = () => {
    const [mode, setMode] = useState<'email' | 'phone'>('email'); // 'email' or 'phone'
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLoginSuccess = () => {
        // Redirect to Dashboard after successful login
        router.push('/student/dashboard'); 
    };

    const BackToHome = () => (
        <Link href="/" className="absolute top-6 left-6 flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative">
            <BackToHome />
            
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-blue-600 animate-in fade-in duration-500">
                <CardHeader className="text-center pt-6 pb-4">
                    <div className="flex justify-center mb-3">
                        <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-lg shadow-md" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Student Access</CardTitle>
                    <p className="text-sm text-slate-500">Select your preferred login method</p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    
                    {/* MODE TOGGLE */}
                    <div className="flex mb-6 bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setMode('email')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex justify-center items-center gap-2 ${mode === 'email' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
                        >
                            <Mail className="w-4 h-4" /> Email/Password
                        </button>
                        <button
                            onClick={() => setMode('phone')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex justify-center items-center gap-2 ${mode === 'phone' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
                        >
                            <Smartphone className="w-4 h-4" /> Phone OTP
                        </button>
                    </div>

                    {mode === 'email' ? (
                        <EmailPasswordForm onLoginSuccess={handleLoginSuccess} />
                    ) : (
                        <PhoneLoginForm onLoginSuccess={handleLoginSuccess} />
                    )}
                    
                </CardContent>
            </Card>
        </div>
    );
};


// --- Wrapper for Phone Login to handle the main state management ---
const PhoneLoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [phone, setPhone] = useState('');
    const [phoneStep, setPhoneStep] = useState(true); // true for phone input, false for OTP input
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedPhone = phone.replace(/\D/g, '');
        
        if (cleanedPhone.length !== 10) {
            toast({ title: "Invalid Number", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
            return;
        }
        setPhoneStep(false);
    };

    return (
        phoneStep ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-Digit Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="h-12 text-lg text-center tracking-wide"
                        maxLength={10}
                        disabled={loading}
                    />
                </div>
                <Button 
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold"
                >
                    {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin w-4 h-4" /> Sending Code...</span> : 'Get OTP'}
                </Button>
                <p className="text-xs text-center text-slate-400 pt-2">
                    Note: Phone login requires reCAPTCHA verification.
                </p>
                <div id="recaptcha-container" className='hidden'></div>
            </form>
        ) : (
            <OtpInputStep 
                phoneNumber={'+91' + phone} 
                onBack={() => setPhoneStep(true)}
                onLoginSuccess={onLoginSuccess}
            />
        )
    );
}


export default StudentLoginPage;