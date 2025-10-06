import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type PagePropsWithErrors = {
    errors?: Record<string, string>;
};

interface EventFormProps {
    event?: {
        id: number;
        title: string;
        slug: string;
        description?: string | null;
        start_at: string;
        end_at?: string | null;
        location?: string | null;
    };
}

export default function EventForm({ event }: EventFormProps) {
    const isEdit = Boolean(event?.id);
    const { props } = usePage<PagePropsWithErrors>();
    const errors = props.errors;

    const [form, setForm] = useState({
        title: event?.title ?? '',
        slug: event?.slug ?? '',
        description: event?.description ?? '',
        start_at: event?.start_at ? event.start_at.slice(0, 16) : '',
        end_at: event?.end_at ? event.end_at.slice(0, 16) : '',
        location: event?.location ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            start_at: form.start_at ? new Date(form.start_at).toISOString() : null,
            end_at: form.end_at ? new Date(form.end_at).toISOString() : null,
        };

        if (isEdit && event) {
            router.post(`/admin/events/${event.id}`, { ...payload, _method: 'put' });
        } else {
            router.post('/admin/events', payload);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Agenda' : 'Tambah Agenda'}>
            <form onSubmit={submit} className="grid max-w-3xl gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Judul</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        required
                    />
                    {errors?.title ? <p className="mt-1 text-xs text-rose-600">{errors.title}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Slug (opsional)</label>
                    <input
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    {errors?.slug ? <p className="mt-1 text-xs text-rose-600">{errors.slug}</p> : null}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Mulai</label>
                        <input
                            type="datetime-local"
                            value={form.start_at}
                            onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            required
                        />
                        {errors?.start_at ? <p className="mt-1 text-xs text-rose-600">{errors.start_at}</p> : null}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Selesai</label>
                        <input
                            type="datetime-local"
                            value={form.end_at}
                            onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                        {errors?.end_at ? <p className="mt-1 text-xs text-rose-600">{errors.end_at}</p> : null}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Lokasi</label>
                    <input
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    {errors?.location ? <p className="mt-1 text-xs text-rose-600">{errors.location}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        rows={8}
                    />
                    {errors?.description ? <p className="mt-1 text-xs text-rose-600">{errors.description}</p> : null}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin/events"
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Kembali
                    </a>
                    <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
