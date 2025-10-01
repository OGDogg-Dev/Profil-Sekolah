import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type VocationalItem = {
    id?: number;
    slug?: string;
    title?: string;
    icon?: string | null;
    description?: string | null;
    audience?: string | null;
    duration?: string | null;
    schedule?: string | null;
    outcomes?: string[] | null;
    facilities?: string[] | null;
    mentors?: string[] | null;
};

type VocFormProps = {
    item?: VocationalItem;
};

export default function VocForm({ item }: VocFormProps) {
    const isEdit = Boolean(item?.id);
    const [data, setData] = useState({
        slug: item?.slug ?? '',
        title: item?.title ?? '',
        icon: item?.icon ?? '',
        audience: item?.audience ?? '',
        duration: item?.duration ?? '',
        schedule: item?.schedule ?? '',
        description: item?.description ?? '',
        outcomes: item?.outcomes ?? [],
        facilities: item?.facilities ?? [],
        mentors: item?.mentors ?? [],
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            ...data,
            outcomes: data.outcomes,
            facilities: data.facilities,
            mentors: data.mentors,
        };

        if (isEdit) {
            router.post(`/admin/vocational-programs/${item?.id}`, { ...payload, _method: 'put' });
        } else {
            router.post('/admin/vocational-programs', payload);
        }
    };

    const textareaToArray = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);

    return (
        <AdminLayout title={`${isEdit ? 'Edit' : 'Tambah'} Program`}>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="slug"
                    value={data.slug}
                    onChange={(event) => setData({ ...data, slug: event.target.value })}
                    required
                />
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="judul"
                    value={data.title}
                    onChange={(event) => setData({ ...data, title: event.target.value })}
                    required
                />
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="icon (opsional)"
                    value={data.icon}
                    onChange={(event) => setData({ ...data, icon: event.target.value })}
                />
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="audience (opsional)"
                    value={data.audience}
                    onChange={(event) => setData({ ...data, audience: event.target.value })}
                />
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="durasi"
                    value={data.duration}
                    onChange={(event) => setData({ ...data, duration: event.target.value })}
                />
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="jadwal"
                    value={data.schedule}
                    onChange={(event) => setData({ ...data, schedule: event.target.value })}
                />
                <textarea
                    className="md:col-span-2 rounded-xl border px-3 py-2"
                    placeholder="deskripsi"
                    value={data.description}
                    onChange={(event) => setData({ ...data, description: event.target.value })}
                />
                <textarea
                    className="md:col-span-2 rounded-xl border px-3 py-2"
                    placeholder="outcomes (satu per baris)"
                    value={data.outcomes.join('\n')}
                    onChange={(event) => setData({ ...data, outcomes: textareaToArray(event.target.value) })}
                />
                <textarea
                    className="md:col-span-2 rounded-xl border px-3 py-2"
                    placeholder="facilities (satu per baris)"
                    value={data.facilities.join('\n')}
                    onChange={(event) => setData({ ...data, facilities: textareaToArray(event.target.value) })}
                />
                <textarea
                    className="md:col-span-2 rounded-xl border px-3 py-2"
                    placeholder="mentors (satu per baris)"
                    value={data.mentors.join('\n')}
                    onChange={(event) => setData({ ...data, mentors: textareaToArray(event.target.value) })}
                />
                <div className="md:col-span-2">
                    <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">Simpan</button>
                </div>
            </form>
        </AdminLayout>
    );
}
