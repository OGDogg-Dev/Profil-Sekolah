import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type PageItem = {
    id: number;
    slug: string;
    title: string;
};

type PagesIndexProps = {
    pages: PageItem[];
};

export default function PagesIndex({ pages }: PagesIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus halaman ini?')) {
            router.delete(`/admin/pages/${id}`);
        }
    };

    return (
        <AdminLayout title="Pages">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="p-3 text-left text-slate-900 dark:text-white">Slug</th>
                            <th className="p-3 text-left text-slate-900 dark:text-white">Title</th>
                            <th className="p-3 text-right text-slate-900 dark:text-white">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages?.map((page) => (
                            <tr key={page.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
                                <td className="p-3 text-slate-900 dark:text-slate-300">{page.slug}</td>
                                <td className="p-3 text-slate-900 dark:text-slate-300">{page.title}</td>
                                <td className="p-3 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <Link href={`/admin/pages/${page.id}/edit`} className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(page.id)}
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
