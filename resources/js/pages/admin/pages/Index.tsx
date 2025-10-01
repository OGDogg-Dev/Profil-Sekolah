import React from 'react';
import { Link } from '@inertiajs/react';
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
    return (
        <AdminLayout title="Pages">
            <div className="overflow-x-auto rounded-2xl border bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">Slug</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages?.map((page) => (
                            <tr key={page.id} className="border-b hover:bg-slate-50">
                                <td className="p-3">{page.slug}</td>
                                <td className="p-3">{page.title}</td>
                                <td className="p-3 text-right">
                                    <Link href={`/admin/pages/${page.id}/edit`} className="rounded-xl border px-3 py-1">
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
