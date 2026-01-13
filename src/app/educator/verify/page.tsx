"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DollarSign,
  Laptop,
  Users,
  Award,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import { auth, realtimeDb } from "@/lib/firebase";
import { ref, update, get } from "firebase/database";

export default function VerifyEducator() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [resume, setResume] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    qualification: "",
    experience: "",
    subjects: "",
    hasLaptop: false,
    hasBroadband: false,
    hasPenTablet: false,
    demoLink: "",
  });

  // 🔒 Only logged-in educators can access this page
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace("/login");
      return;
    }

    get(ref(realtimeDb, `teachers/${user.uid}`)).then((snap) => {
      const data = snap.val();

      // If already verified → dashboard
      if (data?.isVerified) {
        router.replace("/educator/sessions");
        return;
      }

      // Prefill data
      setFormData((prev) => ({
        ...prev,
        fullName: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
      }));

      setLoading(false);
    });
  }, []);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const submitProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!resume || !formData.demoLink || !formData.qualification) {
      alert("Please upload resume, demo link and qualification");
      return;
    }

    setSaving(true);

    try {
      await update(ref(realtimeDb, `teachers/${user.uid}`), {
        ...formData,
        profileCompleted: true,
        isVerified: false,
        verificationStatus: "pending",
        submittedAt: Date.now(),
      });

      alert("Profile submitted. Our team will verify you within 24 hours.");
      router.replace("/educator/waiting");
    } catch (err) {
      console.error(err);
      alert("Failed to submit profile");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading…</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* LEFT */}
      <div className="md:w-1/3 bg-slate-900 text-white p-10">
        <h2 className="text-3xl font-bold mb-6">Why Teach With Us?</h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <DollarSign className="text-blue-400" />
            <p>Earn up to ₹50,000/month</p>
          </div>

          <div className="flex gap-4">
            <Laptop className="text-blue-400" />
            <p>Work from home</p>
          </div>

          <div className="flex gap-4">
            <Users className="text-blue-400" />
            <p>Small batches (5–8 students)</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="md:w-2/3 p-10">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <p className="text-sm text-slate-500">Step {step} of 3</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <Input
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
                <Input
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                <Input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                <Textarea
                  placeholder="Short bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <Input
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChange={(e) => handleChange("qualification", e.target.value)}
                />
                <Input
                  placeholder="Experience (years)"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                />
                <Input
                  placeholder="Subjects"
                  value={formData.subjects}
                  onChange={(e) => handleChange("subjects", e.target.value)}
                />

                <div className="space-y-2">
                  <label className="flex gap-2">
                    <Checkbox
                      checked={formData.hasLaptop}
                      onCheckedChange={(v) => handleChange("hasLaptop", v)}
                    />
                    Laptop/PC
                  </label>
                  <label className="flex gap-2">
                    <Checkbox
                      checked={formData.hasBroadband}
                      onCheckedChange={(v) => handleChange("hasBroadband", v)}
                    />
                    Broadband
                  </label>
                  <label className="flex gap-2">
                    <Checkbox
                      checked={formData.hasPenTablet}
                      onCheckedChange={(v) => handleChange("hasPenTablet", v)}
                    />
                    Pen Tablet
                  </label>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <Input
                  placeholder="Demo Video Link"
                  value={formData.demoLink}
                  onChange={(e) => handleChange("demoLink", e.target.value)}
                />

                <div
                  className="border-dashed border p-6 rounded text-center cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mx-auto mb-2" />
                  Click to upload resume
                  <input
                    type="file"
                    ref={fileRef}
                    className="hidden"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                  />
                </div>

                {resume && (
                  <p className="text-green-600 flex gap-2">
                    <CheckCircle /> {resume.name}
                  </p>
                )}
              </>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                disabled={step === 1}
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft /> Back
              </Button>

              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)}>
                  Next <ArrowRight />
                </Button>
              ) : (
                <Button onClick={submitProfile} disabled={saving}>
                  {saving ? "Submitting…" : "Submit"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
