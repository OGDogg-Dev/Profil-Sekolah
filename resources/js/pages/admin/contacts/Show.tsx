import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type ContactDetail = {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    message: string;
    is_read: boolean;
};

type ContactShowProps = {
    item: ContactDetail;
};

export default function ContactShow({ item }: ContactShowProps) {
    const toggleRead = () => {
        router.post(`/admin/contacts/${item.id}/mark`, { is_read: !item.is_read }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Detail Pesan">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                    Status:
                    <span
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold ${
                            item.is_read ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                        {item.is_read ? 'Sudah dibaca' : 'Belum dibaca'}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={toggleRead}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Tandai {item.is_read ? 'Belum Dibaca' : 'Sudah Dibaca'}
                </button>
            </div>
            <div className="mt-4 space-y-3 rounded-2xl border bg-white p-6 text-sm">
                <div>
                    <span className="text-slate-500">Nama</span>
                    <div className="font-medium text-slate-800">{item.name}</div>
                </div>
                <div>
                    <span className="text-slate-500">Email</span>
                    <div className="font-medium text-slate-800">{item.email ?? '-'}</div>
                </div>
                <div>
                    <span className="text-slate-500">Telepon</span>
                    <div className="font-medium text-slate-800">{item.phone ?? '-'}</div>
                </div>
                <div>
                    <span className="text-slate-500">Pesan</span>
                    <div className="whitespace-pre-wrap font-medium text-slate-800">{item.message}</div>
                </div>
            </div>
        </AdminLayout>
    );
}
