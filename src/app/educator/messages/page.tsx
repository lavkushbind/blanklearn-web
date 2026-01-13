// app/educator/messages/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Archive, Star, User } from "lucide-react";

interface Message {
    id: number;
    sender: string;
    subject: string;
    snippet: string;
    time: string;
    read: boolean;
    starred: boolean;
}

const initialMessages: Message[] = [
    { id: 1, sender: "Rahul Sharma (Parent)", subject: "Query regarding Maths homework", snippet: "Can you clarify question 4 from the assignment?", time: "10:30 AM", read: false, starred: true },
    { id: 2, sender: "Admin Support", subject: "New Policy Update", snippet: "Please review the updated attendance submission guidelines...", time: "Yesterday", read: true, starred: false },
    { id: 3, sender: "Sneha Verma (Parent)", subject: "Follow-up on Science class", snippet: "Sneha really enjoyed today's topic on cells!", time: "11/01/26", read: false, starred: false },
];

const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(initialMessages[0]);

    const handleToggleStar = (id: number) => {
        setMessages(prev => prev.map(msg => 
            msg.id === id ? { ...msg, starred: !msg.starred } : msg
        ));
    };

    const handleMarkRead = (id: number) => {
        setMessages(prev => prev.map(msg => 
            msg.id === id ? { ...msg, read: true } : msg
        ));
        if (selectedMessage?.id === id) {
            setSelectedMessage(prev => prev ? ({ ...prev, read: true }) : null);
        }
    };

    return (
        <div className="flex h-[80vh] space-x-6">
            {/* Message List Panel */}
            <Card className="w-96 flex-shrink-0 shadow-lg">
                <CardHeader className="border-b p-4">
                    <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5"/> Inbox (3)</CardTitle>
                    <Button variant="outline" className="mt-2 w-full justify-start text-sm"><Send className="w-4 h-4 mr-2"/> Compose</Button>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto max-h-[calc(80vh-100px)]">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => { setSelectedMessage(msg); handleMarkRead(msg.id); }}
                            className={`p-4 border-b cursor-pointer transition-colors flex justify-between items-start ${
                                selectedMessage?.id === msg.id ? 'bg-blue-50 border-blue-200' : msg.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50 font-bold hover:bg-blue-100'
                            }`}
                        >
                            <div className="flex-grow min-w-0 pr-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className='w-3 h-3 text-slate-500'/>
                                    <p className={`truncate text-sm ${!msg.read ? 'font-bold' : 'font-semibold text-slate-800'}`}>{msg.sender}</p>
                                </div>
                                <p className="truncate text-sm text-slate-600">{msg.subject}</p>
                                <p className="text-xs text-slate-400 mt-1">{msg.snippet}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <span className="text-[10px] text-slate-500">{msg.time}</span>
                                <Star 
                                    className={`w-3 h-3 cursor-pointer transition-colors ${msg.starred ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-500'}`} 
                                    onClick={(e) => { e.stopPropagation(); handleToggleStar(msg.id); }}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Message Viewer Panel */}
            <Card className="flex-1 shadow-lg">
                {selectedMessage ? (
                    <div className="flex flex-col h-full">
                        <CardHeader className="border-b bg-slate-50 p-4 flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                                <p className="text-sm text-slate-600 mt-1">From: {selectedMessage.sender}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" title="Archive"><Archive className="w-4 h-4"/></Button>
                                <Button variant="outline" size="sm" title="Mark Unread" onClick={() => handleMarkRead(selectedMessage.id)} disabled={!selectedMessage.read}><Mail className="w-4 h-4"/></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow overflow-y-auto text-slate-700 space-y-4">
                            <p className='text-base leading-relaxed'>
                                Dear {selectedMessage.sender.split(' ')[0]},
                            </p>
                            <p className='leading-relaxed'>
                                Thank you for reaching out regarding your query.
                                {selectedMessage.id === 1 
                                    ? " For question 4, please refer to the formula sheet provided in the Study Material section under 'Chapter 3 Notes'. The solution involves applying the distributive property first."
                                    : " I appreciate the positive feedback! We are working on making the next module even more engaging."
                                }
                            </p>
                            <p className='leading-relaxed'>
                                Let me know if you have further questions after reviewing the material.
                            </p>
                            <p className='pt-4 font-semibold border-t mt-6'>
                                Best Regards,<br/>
                                {mockTeacher.name} ({mockTeacher.role})
                            </p>
                        </CardContent>
                        <div className="p-4 border-t">
                            <div className="flex space-x-2">
                                <input type="text" placeholder="Type your reply here..." className="flex-grow p-2 border rounded-lg focus:ring-blue-500"/>
                                <Button className="bg-blue-600 hover:bg-blue-700"><Send className="w-4 h-4 mr-2"/> Send</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <div className='text-center'>
                            <Mail className="w-10 h-10 mx-auto mb-3"/>
                            <p>Select a conversation to view the details.</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MessagesPage;