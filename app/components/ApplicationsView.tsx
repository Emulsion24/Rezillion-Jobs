'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { Loader2, Briefcase, Calendar, AlertCircle } from 'lucide-react';

// 1. Robust Interface (Matches both API aliases and Raw DB columns)
interface Application {
  id?: number;              
  application_id?: number;  // From API alias
  
  job_title: string;
  company_name: string;
  
  status?: string;
  application_status?: string; // From API alias
  
  applied_at?: string;      // Raw DB column
  applied_date?: string;    // From API alias
}

export const ApplicationsView = () => {
    const { user } = useUserStore();
    
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => { 
        const fetchApplications = async () => {
            if (!user?.id) return;
            setLoading(true);
            setError(null);
            
            try {
                const res = await fetch(`/api/dashboard/applications?userId=${user.id}`);
                if (!res.ok) throw new Error('Failed to fetch applications');
                const data = await res.json();
                setApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError("Could not load application history.");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [user]);

    // Helper: Safely get the status string
    const getStatusStyle = (app: Application) => {
        // Check both possible property names
        const rawStatus = app.application_status || app.status || 'pending';
        const safeStatus = rawStatus.toLowerCase();

        switch (safeStatus) {
            case 'shortlisted': 
            case 'accepted': 
            case 'hired':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': 
            case 'closed':
                return 'bg-red-50 text-red-600 border-red-100';
            case 'new':
            case 'pending': 
            case 'reviewing':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    // Helper: Safely format date from either property
    const getFormattedDate = (app: Application) => {
        // 1. Try to find the date string in either property
        const dateString = app.applied_date || app.applied_at;

        // 2. If missing, return N/A
        if (!dateString) return "N/A";

        // 3. Try to parse it
        const date = new Date(dateString);
        
        // 4. Check if valid
        if (isNaN(date.getTime())) return "N/A";
        
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-[32px] border border-slate-100">
            <Loader2 className="animate-spin text-emerald-600 mb-2" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading History...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-[32px] border border-red-100">
            <AlertCircle className="text-red-500 mb-2" size={32} />
            <p className="text-sm font-bold text-red-600">{error}</p>
        </div>
    );

    return (
        <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role & Company</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Applied Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {applications.length === 0 ? (
                            <tr><td colSpan={3} className="p-12 text-center text-slate-400 font-medium">You haven&apos;t applied to any jobs yet.</td></tr>
                        ) : (
                            applications.map((app, idx) => (
                                // Use idx as fallback key if ids are missing/duplicate
                                <tr key={app.id || app.application_id || idx} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-6">
                                        <div>
                                            <div className="font-black text-slate-900 text-sm flex items-center gap-2">{app.job_title}</div>
                                            <div className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                                                <Briefcase size={12} /> {app.company_name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(app)}`}>
                                            {app.application_status || app.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1.5">
                                            <Calendar size={12} />
                                            {/* Calls the safe date formatter */}
                                            {getFormattedDate(app)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};