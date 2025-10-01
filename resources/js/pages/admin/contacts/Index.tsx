import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';
import Pagination from '@/components/ui/Pagination';
import type { Paginated } from '@/features/common/types';

interface ContactItem {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    is_read: boolean;
}

interface ContactsIndexProps {
    items: Paginated<ContactItem>;
    filters: {
        status: string;
    };
}

export default function ContactsIndex({ items, filters }: ContactsIndexProps) {
    const setFilter = (status: string) => {
        router.get('/admin/contacts', { status }, { preserveState: true });
    };

    return (
        <AdminLayout title="Pesan Masuk">
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                        filters.status === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    Semua
                </button>
                <button
                    type="button"
                    onClick={() => setFilter('unread')}
                    className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                        filters.status === 'unread'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    Belum Dibaca
                </button>
                <button
                    type="button"
                    onClick={() => setFilter('read')}
                    className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                        filters.status === 'read'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    Sudah Dibaca
                </button>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Nama</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Telepon</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.data.map((item) => (
                            <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {!item.is_read ? (
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                                        ) : (
                                            <span className="h-2 w-2 rounded-full bg-slate-200" aria-hidden />
                                        )}
                                        <span className="font-medium text-slate-800">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{item.email ?? '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{item.phone ?? '-'}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/contacts/${item.id}`}
                                        className="rounded-xl border border-slate-300 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                    >
                                        Lihat
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={items.links} />
        </AdminLayout>
    );
}

