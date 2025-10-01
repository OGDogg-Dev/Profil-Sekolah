import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';
import Pagination from '@/components/ui/Pagination';
import type { Paginated } from '@/features/common/types';

interface PostItem {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    published_at?: string | null;
}

interface IndexProps {
    posts: Paginated<PostItem>;
    filters: {
        search?: string;
    };
}

export default function PostsIndex({ posts, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/posts', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus berita ini?')) {
            router.delete(`/admin/posts/${id}`);
        }
    };

    return (
        <AdminLayout title="Berita">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <form onSubmit={submitSearch} className="flex w-full max-w-md gap-2">
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari judul berita..."
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Cari</button>
                </form>
                <a
                    href="/admin/posts/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    Tambah Berita
                </a>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3">Judul</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Dipublikasikan</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.data.map((post) => (
                            <tr key={post.id} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-800">{post.title}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                                            post.status === 'published'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        {post.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {post.published_at
                                        ? new Date(post.published_at).toLocaleDateString('id-ID', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric',
                                          })
                                        : '-'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <a
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(post.id)}
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
            <Pagination links={posts.links} />
        </AdminLayout>
    );
}

