// app/educator/schedule/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { mockBatches, Batch } from '../mocks'; // Assume mock data is accessible

const SchedulePage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const todayBatches = mockBatches; // In a real app, this would filter by date

    const dateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedDate = dateFormatter.format(currentDate);

    const handleDateChange = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        setCurrentDate(newDate);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b">
                    <CardTitle className="text-2xl">Class Schedule</CardTitle>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="icon" onClick={() => handleDateChange(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-center">
                            <p className="font-bold text-lg">{formattedDate}</p>
                            <p className="text-xs text-slate-500">Today</p>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => handleDateChange(1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {todayBatches.length > 0 ? (
                        <div className="space-y-4">
                            {todayBatches.map((batch: Batch) => (
                                <div key={batch.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="pt-1">
                                        <CalendarCheck className="w-5 h-5 text-blue-600"/>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-lg font-semibold">{batch.class} • {batch.subject}</h4>
                                        <p className="text-sm text-slate-600">Time: {batch.time}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 border-green-300">
                                        <Clock className="w-3 h-3 mr-1"/> Active
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 text-slate-500">
                            <p>No classes scheduled for this date.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SchedulePage;