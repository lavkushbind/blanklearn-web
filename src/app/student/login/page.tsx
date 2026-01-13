'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Firebase Imports
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function StudentLogin() {
  const router = useRouter();
  
  // States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE'); // Screen toggle
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // 1. Recaptcha Setup (Page Load hote hi)
 // 1. Recaptcha Setup (Improved)
//   useEffect(() => {
//     // Agar pehle se hai to clear karo
//     if (window.recaptchaVerifier) {
//       window.recaptchaVerifier.clear();
//     }

//     // Naya Banao
//     window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//       'size': 'invisible',
//       'callback': (response: any) => {
//         // reCAPTCHA solved, allow signInWithPhoneNumber.
//         console.log("Recaptcha Solved");
//       },
//       'expired-callback': () => {
//         // Response expired. Ask user to solve reCAPTCHA again.
//        // console.log("Recaptcha Expired");
//       }
//     });
//   }, []);

useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => console.log("Recaptcha verified"),
      },
      auth
    );
  }, []);

  // 2. Send OTP Function
  const handleSendOtp = async () => {
    if (phone.length < 10) {
      toast({ title: "Error", description: "Enter valid 10-digit number", variant: "destructive" });
      return;
    }

    setLoading(true);
    const phoneNumber = "+91" + phone; // Country Code Zaroori hai

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      setConfirmationResult(result);
      setStep('OTP'); // Screen change karo
      toast({ title: "OTP Sent!", description: "Check your mobile messages." });
      
    } catch (error: any) {
      console.error(error);
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
      
      // Agar error aaye to Recaptcha reset karo
      if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  // 3. Verify OTP Function
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ title: "Error", description: "Enter 6-digit OTP", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // Firebase Check
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      console.log("User Logged In:", user.uid);
      
      // Success!
      toast({ title: "Login Successful!", description: "Redirecting to Dashboard..." });
      router.push("/student/dashboard");

    } catch (error) {
      toast({ title: "Invalid OTP", description: "Please try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Invisible Recaptcha Container (Zaroori hai) */}
      <div id="recaptcha-container"></div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {step === 'PHONE' ? 'Student Login' : 'Verify OTP'}
          </CardTitle>
          <CardDescription>
            {step === 'PHONE' 
              ? 'Enter your mobile number to continue.' 
              : `OTP sent to +91 ${phone}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* STEP 1: PHONE INPUT */}
          {step === 'PHONE' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex items-center justify-center border rounded-md px-3 bg-slate-100 text-slate-500 font-bold">
                  +91
                </div>
                <Input 
                  type="tel" 
                  placeholder="9876543210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 text-lg tracking-widest"
                  maxLength={10}
                />
              </div>
              <Button 
                onClick={handleSendOtp} 
                disabled={loading} 
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </Button>
            </div>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 'OTP' && (
            <div className="space-y-4">
              <Input 
                type="text" 
                placeholder="123456" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 text-center text-2xl tracking-[10px] font-bold"
                maxLength={6}
              />
              <Button 
                onClick={handleVerifyOtp} 
                disabled={loading} 
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Verify & Login"}
              </Button>
              <button 
                onClick={() => setStep('PHONE')} 
                className="text-sm text-blue-600 hover:underline w-full text-center"
              >
                Change Number?
              </button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

// Global Declaration for TypeScript (Optional, to avoid red lines)
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}