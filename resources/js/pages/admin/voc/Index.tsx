import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type VocItem = {
    id: number;
    slug: string;
    title: string;
    schedule?: string | null;
    photos?: string[] | null;
};

type VocIndexProps = {
    items: VocItem[];
};

export default function VocIndex({ items }: VocIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus program vokasional ini?')) {
            router.delete(`/admin/vocational-programs/${id}`);
        }
    };

    return (
        <AdminLayout title="Program Vokasional">
            <div>
                <Link href="/admin/vocational-programs/create" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white dark:bg-slate-700">
                    Tambah
                </Link>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="p-3 text-left text-slate-900 dark:text-white">Slug</th>
                            <th className="p-3 text-left text-slate-900 dark:text-white">Judul</th>
                            <th className="p-3 text-left text-slate-900 dark:text-white">Jadwal</th>
                            <th className="p-3 text-left text-slate-900 dark:text-white">Foto</th>
                            <th className="p-3 text-right text-slate-900 dark:text-white">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.map((item) => (
                            <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
                                <td className="p-3 text-slate-900 dark:text-slate-300">{item.slug}</td>
                                <td className="p-3 text-slate-900 dark:text-slate-300">{item.title}</td>
                                <td className="p-3 text-slate-900 dark:text-slate-300">{item.schedule ?? '-'}</td>
                                <td className="p-3 text-slate-900 dark:text-slate-300">{item.photos?.length ?? 0}</td>
                                <td className="p-3 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <Link href={`/admin/vocational-programs/${item.id}/edit`} className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="rounded-xl border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900"
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
        </AdminLayout>
    );
}
