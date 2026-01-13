'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinClass() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleJoin = () => {
    if (code.trim()) {
       router.push(`/classroom/${code}`);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Enter Class Code</h1>
      <div className="flex gap-2">
        <Input 
          placeholder="e.g. MATHS-BATCH-A" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white w-64"
        />
        <Button onClick={handleJoin} className="bg-blue-600">Join</Button>
      </div>
    </div>
  );
}