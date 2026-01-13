// app/educator/material/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Video, Trash2, Search } from "lucide-react";

interface Resource {
    id: number;
    name: string;
    type: 'PDF' | 'Video' | 'Assignment';
    class: string;
    uploaded: string;
}

const initialResources: Resource[] = [
    { id: 1, name: "Chapter 3 Solutions", type: 'PDF', class: 'Class 5 Maths', uploaded: '10-01-2026' },
    { id: 2, name: "Introduction to Momentum", type: 'Video', class: 'Class 8 Science', uploaded: '05-01-2026' },
    { id: 3, name: "Weekly Quiz 1", type: 'Assignment', class: 'Class 5 Maths', uploaded: '12-01-2026' },
];

const getIcon = (type: Resource['type']) => {
    switch (type) {
        case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
        case 'Video': return <Video className="w-5 h-5 text-blue-500" />;
        case 'Assignment': return <FileText className="w-5 h-5 text-green-500" />;
    }
}

const MaterialPage: React.FC = () => {
    const [resources, setResources] = useState(initialResources);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResources = resources.filter(res => 
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: number) => {
        setResources(prev => prev.filter(res => res.id !== id));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Study Material Library</h1>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                    <CardTitle className="text-xl">Resource Management</CardTitle>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Upload className="w-4 h-4 mr-2" /> Upload New Material
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by file name or class..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        />
                    </div>

                    {/* Resource Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50">
                                    <th className="p-3">File Name</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">For Class</th>
                                    <th className="p-3">Uploaded On</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredResources.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-50">
                                        <td className="p-3 whitespace-nowrap flex items-center gap-2 font-medium text-slate-800">
                                            {getIcon(res.type)}
                                            {res.name}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            <Badge variant={res.type === 'Assignment' ? 'success' : res.type === 'Video' ? 'primary' : 'default'}>{res.type}</Badge>
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-sm text-slate-600">{res.class}</td>
                                        <td className="p-3 whitespace-nowrap text-sm text-slate-500">{res.uploaded}</td>
                                        <td className="p-3 whitespace-nowrap text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(res.id)} title="Delete">
                                                <Trash2 className="w-4 h-4 text-red-500"/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredResources.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No resources match your search.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MaterialPage;