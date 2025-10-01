import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

interface PostFormProps {
    post?: {
        id: number;
        title: string;
        slug: string;
        excerpt?: string | null;
        content?: string | null;
        cover_url?: string | null;
        status: 'draft' | 'published';
        published_at?: string | null;
    };
}

export default function PostForm({ post }: PostFormProps) {
    const isEdit = Boolean(post?.id);
    const { props } = usePage();
    const [form, setForm] = useState({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        cover_url: post?.cover_url ?? '',
        status: post?.status ?? 'draft',
        published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
    });

    const errors = (props as any)?.errors as Record<string, string> | undefined;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
        };

        if (isEdit && post) {
            router.post(`/admin/posts/${post.id}`, { ...payload, _method: 'put' });
        } else {
            router.post('/admin/posts', payload);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Berita' : 'Tambah Berita'}>
            <form onSubmit={submit} className="grid max-w-4xl gap-4">
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
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        {errors?.status ? <p className="mt-1 text-xs text-rose-600">{errors.status}</p> : null}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tanggal Publikasi</label>
                        <input
                            type="datetime-local"
                            value={form.published_at}
                            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                        {errors?.published_at ? <p className="mt-1 text-xs text-rose-600">{errors.published_at}</p> : null}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Cover URL</label>
                    <input
                        value={form.cover_url}
                        onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        placeholder="https://..."
                    />
                    {errors?.cover_url ? <p className="mt-1 text-xs text-rose-600">{errors.cover_url}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Ringkasan</label>
                    <textarea
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        rows={3}
                    />
                    {errors?.excerpt ? <p className="mt-1 text-xs text-rose-600">{errors.excerpt}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Konten</label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        rows={12}
                    />
                    {errors?.content ? <p className="mt-1 text-xs text-rose-600">{errors.content}</p> : null}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin/posts"
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

