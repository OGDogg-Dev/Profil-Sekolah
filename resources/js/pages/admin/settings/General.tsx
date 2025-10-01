import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type SettingsProps = {
    settings?: {
        site_name?: string;
        tagline?: string;
        logo_path?: string;
    } | null;
};

export default function SettingsGeneral({ settings }: SettingsProps) {
    const [data, setData] = useState({
        site_name: settings?.site_name ?? '',
        tagline: settings?.tagline ?? '',
        logo_path: settings?.logo_path ?? '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.post('/admin/settings', { ...data, _method: 'put' });
    };

    return (
        <AdminLayout title="Pengaturan Umum">
            <form onSubmit={submit} className="max-w-xl space-y-3">
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Nama Situs"
                    value={data.site_name}
                    onChange={(event) => setData({ ...data, site_name: event.target.value })}
                    required
                />
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Tagline"
                    value={data.tagline}
                    onChange={(event) => setData({ ...data, tagline: event.target.value })}
                />
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Logo URL (opsional)"
                    value={data.logo_path}
                    onChange={(event) => setData({ ...data, logo_path: event.target.value })}
                />
                <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">Simpan</button>
            </form>
        </AdminLayout>
    );
}
