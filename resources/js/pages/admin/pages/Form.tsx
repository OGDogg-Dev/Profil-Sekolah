import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type PageFormProps = {
    page: {
        id: number;
        slug: string;
        title: string;
        content?: string | null;
    };
};

export default function PageForm({ page }: PageFormProps) {
    const [data, setData] = useState({ title: page?.title ?? '', content: page?.content ?? '' });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.put(`/admin/pages/${page.id}`, data);
    };

    return (
        <AdminLayout title={`Edit: ${page?.slug}`}>
            <form onSubmit={submit} className="max-w-3xl space-y-3">
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    value={data.title}
                    onChange={(event) => setData({ ...data, title: event.target.value })}
                />
                <textarea
                    className="min-h-[320px] w-full rounded-xl border px-3 py-2"
                    value={data.content}
                    onChange={(event) => setData({ ...data, content: event.target.value })}
                />
                <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">Simpan</button>
            </form>
        </AdminLayout>
    );
}
