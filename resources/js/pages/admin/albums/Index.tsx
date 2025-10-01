import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';
import Pagination from '@/components/ui/Pagination';
import type { Paginated } from '@/features/common/types';

interface AlbumItem {
    id: number;
    title: string;
    slug: string;
    cover_url?: string | null;
    media_count: number;
}

interface IndexProps {
    albums: Paginated<AlbumItem>;
}

export default function AlbumsIndex({ albums }: IndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus album ini?')) {
            router.delete(`/admin/albums/${id}`);
        }
    };

    return (
        <AdminLayout title="Galeri">
            <div className="flex justify-end">
                <a
                    href="/admin/albums/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    Tambah Album
                </a>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Judul</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3">Jumlah Media</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {albums.data.map((album) => (
                            <tr key={album.id} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-800">{album.title}</td>
                                <td className="px-4 py-3 text-slate-600">{album.slug}</td>
                                <td className="px-4 py-3 text-slate-600">{album.media_count}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <a
                                            href={`/admin/albums/${album.id}/edit`}
                                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                        >
                                            Kelola
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(album.id)}
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
            <Pagination links={albums.links} />
        </AdminLayout>
    );
}

