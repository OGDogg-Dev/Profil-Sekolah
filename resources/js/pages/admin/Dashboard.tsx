import React from 'react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type DashboardProps = {
    counts: {
        programs?: number;
        messages?: number;
    };
};

export default function Dashboard({ counts }: DashboardProps) {
    return (
        <AdminLayout title="Dashboard">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-white p-6">
                    <div className="text-sm text-slate-500">Programs</div>
                    <div className="text-3xl font-bold text-slate-900">{counts?.programs ?? 0}</div>
                </div>
                <div className="rounded-2xl border bg-white p-6">
                    <div className="text-sm text-slate-500">Messages</div>
                    <div className="text-3xl font-bold text-slate-900">{counts?.messages ?? 0}</div>
                </div>
            </div>
        </AdminLayout>
    );
}
