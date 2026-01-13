// app/educator/batches/page.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, TrendingUp } from "lucide-react";
import { mockBatches, Batch } from '../mocks'; // Assume mock data is accessible

const BatchesPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">My Batches Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockBatches.map((batch: Batch) => (
                    <Card key={batch.id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <CardTitle className="text-xl">{batch.class} - {batch.subject}</CardTitle>
                            <Users className="w-6 h-6 text-blue-600"/>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <p className="text-slate-500">Schedule</p>
                                <p className="font-semibold">{batch.time}</p>
                            </div>
                            <div className="flex justify-between text-sm border-t pt-3">
                                <p className="text-slate-500">Enrollment</p>
                                <p className="font-bold text-lg text-green-600">{batch.filled} / {batch.capacity}</p>
                            </div>
                            <div className="pt-3">
                                <TrendingUp className="w-4 h-4 inline mr-1 text-amber-500"/>
                                <span className='text-xs text-slate-500'>Performance tracking available below.</span>
                            </div>
                            <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                                Manage Batch 
                                <ArrowRight className="w-4 h-4 ml-2"/>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BatchesPage;