import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type VocItem = {
    id: number;
    slug: string;
    title: string;
    schedule?: string | null;
};

type VocIndexProps = {
    items: VocItem[];
};

export default function VocIndex({ items }: VocIndexProps) {
    return (
        <AdminLayout title="Program Vokasional">
            <div>
                <Link href="/admin/vocational-programs/create" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
                    Tambah
                </Link>
            </div>
            <div className="overflow-x-auto rounded-2xl border bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">Slug</th>
                            <th className="p-3 text-left">Judul</th>
                            <th className="p-3 text-left">Jadwal</th>
                            <th className="p-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-slate-50">
                                <td className="p-3">{item.slug}</td>
                                <td className="p-3">{item.title}</td>
                                <td className="p-3">{item.schedule ?? '-'}</td>
                                <td className="p-3 text-right">
                                    <Link href={`/admin/vocational-programs/${item.id}/edit`} className="rounded-xl border px-3 py-1">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
