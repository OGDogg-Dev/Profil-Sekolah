import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';
import Pagination from '@/components/ui/Pagination';
import type { Paginated } from '@/features/common/types';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    start_at: string;
    end_at?: string | null;
    location?: string | null;
}

interface IndexProps {
    events: Paginated<EventItem>;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function EventsIndex({ events }: IndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus agenda ini?')) {
            router.delete(`/admin/events/${id}`);
        }
    };

    return (
        <AdminLayout title="Agenda">
            <div className="flex justify-end">
                <a
                    href="/admin/events/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    Tambah Agenda
                </a>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Judul</th>
                            <th className="px-4 py-3">Mulai</th>
                            <th className="px-4 py-3">Selesai</th>
                            <th className="px-4 py-3">Lokasi</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.data.map((event) => (
                            <tr key={event.id} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-800">{event.title}</td>
                                <td className="px-4 py-3 text-slate-600">{formatDate(event.start_at)}</td>
                                <td className="px-4 py-3 text-slate-600">{event.end_at ? formatDate(event.end_at) : '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{event.location ?? '-'}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <a
                                            href={`/admin/events/${event.id}/edit`}
                                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(event.id)}
                                            className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={events.links} />
        </AdminLayout>
    );
}

