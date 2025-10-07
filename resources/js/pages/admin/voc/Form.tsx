import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type MediaItem = {
    id: number;
    type: string;
    url: string;
    alt?: string;
};

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
    photos?: string[] | null;
    media?: MediaItem[];
};

type VocFormProps = {
    item?: VocationalItem;
};

export default function VocForm({ item }: VocFormProps) {
    const isEdit = Boolean(item?.id);
    const { data, setData } = useForm({
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
        photos: [] as File[],
    });

    const [existingMedia, setExistingMedia] = useState<MediaItem[]>(item?.media ?? []);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('Form data being sent:', data);
        console.log('Files in data.photos:', data.photos);
        console.log('Files count:', data.photos.length);

        // Create FormData to ensure files are sent properly
        const formData = new FormData();

        // Add all form fields
        formData.append('slug', data.slug);
        formData.append('title', data.title);
        formData.append('icon', data.icon);
        formData.append('audience', data.audience);
        formData.append('duration', data.duration);
        formData.append('schedule', data.schedule);
        formData.append('description', data.description);

        // Handle array fields
        data.outcomes.forEach((outcome, index) => {
            formData.append(`outcomes[${index}]`, outcome);
        });
        data.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });
        data.mentors.forEach((mentor, index) => {
            formData.append(`mentors[${index}]`, mentor);
        });

        // Handle file array
        data.photos.forEach((file: File) => {
            formData.append('photos[]', file);
        });

        console.log('FormData created with entries:');
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        if (isEdit) {
            console.log('Calling router.post for update with _method=PUT');
            formData.append('_method', 'PUT');
            router.post(`/admin/vocational-programs/${item?.id}`, formData, {
                onSuccess: () => {
                    console.log('Update successful');
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                },
            });
        } else {
            console.log('Calling router.post for create');
            router.post('/admin/vocational-programs', formData, {
                onSuccess: () => {
                    console.log('Create successful');
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                },
            });
        }
    };

    const handleDeletePhoto = (index: number) => {
        const newPhotos = [...data.photos];
        newPhotos.splice(index, 1);
        setData('photos', newPhotos);
    };

    const textareaToArray = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        // Append new files to existing photos array instead of replacing
        setData('photos', [...data.photos, ...files]);
    };

    return (
        <AdminLayout title={`${isEdit ? 'Edit' : 'Tambah'} Program Vokasional`}>
            <div className="max-w-4xl mx-auto">
                <form onSubmit={submit} encType="multipart/form-data" className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-8">
                    {/* Header Section */}
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {isEdit ? 'Edit Program Vokasional' : 'Tambah Program Vokasional Baru'}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Lengkapi informasi program vokasional dengan detail yang diperlukan
                        </p>
                    </div>

                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            Informasi Dasar
                        </h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Slug <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="contoh: program-teknik-komputer"
                                    value={data.slug}
                                    onChange={(event) => setData('slug', event.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Judul Program <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="contoh: Teknik Komputer dan Jaringan"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Icon (Opsional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="contoh: computer"
                                    value={data.icon}
                                    onChange={(event) => setData('icon', event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Target Audience (Opsional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="contoh: Siswa SMA/SMK"
                                    value={data.audience}
                                    onChange={(event) => setData('audience', event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Durasi Program
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="contoh: 6 bulan"
                                    value={data.duration}
                                    onChange={(event) => setData('duration', event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Jadwal
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="contoh: Senin - Jumat, 08:00 - 16:00"
                                    value={data.schedule}
                                    onChange={(event) => setData('schedule', event.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <span className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            Deskripsi Program
                        </h3>

                        <div className="space-y-2">
                            <textarea
                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[120px]"
                                placeholder="Jelaskan secara detail tentang program vokasional ini, tujuan, manfaat, dan hal-hal penting lainnya..."
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Detailed Information Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </span>
                            Informasi Detail
                        </h3>

                        <div className="grid gap-6 md:grid-cols-1">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Hasil Pembelajaran (Outcomes)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[100px]"
                                    placeholder="Masukkan hasil pembelajaran yang akan dicapai, satu per baris:&#10;- Mampu mengoperasikan perangkat keras komputer&#10;- Memahami konsep jaringan komputer&#10;- Dapat melakukan troubleshooting dasar"
                                    value={data.outcomes.join('\n')}
                                    onChange={(event) => setData('outcomes', textareaToArray(event.target.value))}
                                    rows={3}
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">Satu outcome per baris</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Fasilitas yang Tersedia
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[100px]"
                                    placeholder="Masukkan fasilitas yang tersedia, satu per baris:&#10;- Laboratorium Komputer&#10;- Ruang Kelas Ber-AC&#10;- Peralatan Networking Lengkap"
                                    value={data.facilities.join('\n')}
                                    onChange={(event) => setData('facilities', textareaToArray(event.target.value))}
                                    rows={3}
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">Satu fasilitas per baris</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Mentor/Pengajar
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[100px]"
                                    placeholder="Masukkan nama mentor atau pengajar, satu per baris:&#10;- Ir. Ahmad Susanto, M.Kom&#10;- Siti Nurhaliza, S.Kom&#10;- Budi Santoso, M.T"
                                    value={data.mentors.join('\n')}
                                    onChange={(event) => setData('mentors', textareaToArray(event.target.value))}
                                    rows={3}
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">Satu mentor per baris</p>
                            </div>
                        </div>
                    </div>

                    {/* Photo Upload Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </span>
                            Dokumentasi Foto
                        </h3>

                        <div className="space-y-4">
                            <div
                                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.add('border-blue-400', 'dark:border-blue-500');
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('border-blue-400', 'dark:border-blue-500');
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('border-blue-400', 'dark:border-blue-500');
                                    const files = e.dataTransfer.files;
                                    if (files.length > 0) {
                                        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
                                        if (imageFiles.length > 0) {
                                            setData('photos', [...data.photos, ...imageFiles]);
                                        }
                                    }
                                }}
                                onClick={() => document.getElementById('photo-upload')?.click()}
                            >
                                <div className="space-y-4">
                                    <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-lg font-medium text-slate-900 dark:text-white">Klik untuk upload foto</span>
                                        <span className="text-slate-600 dark:text-slate-400 block">atau drag & drop</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        PNG, JPG, GIF hingga 2MB per file • Multiple files diperbolehkan
                                    </p>
                                </div>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Photo Preview Grid */}
                            {(existingMedia.length > 0 || data.photos.length > 0) && (
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-slate-900 dark:text-white">Foto Terupload</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {existingMedia.map((mediaItem, index) => {
                                            // Fix for black blank image: add timestamp query param to bust cache
                                            const imageUrl = `/storage/${mediaItem.url}?t=${new Date().getTime()}`;
                                            return (
                                                <div key={mediaItem.id} className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                                    <img
                                                        src={imageUrl}
                                                        alt={mediaItem.alt || `Photo ${index + 1}`}
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
                                                                    router.delete(`/admin/vocational-programs/${item?.id}/media/${mediaItem.id}`, {
                                                                        onSuccess: () => {
                                                                            setExistingMedia(prev => prev.filter(m => m.id !== mediaItem.id));
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all duration-200"
                                                            aria-label="Hapus foto"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                        Existing
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {data.photos.map((file, index) => {
                                            const previewUrl = URL.createObjectURL(file);

                                            return (
                                                <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                                    <img
                                                        src={previewUrl}
                                                        alt={`New Photo ${index + 1}`}
                                                        className="w-full h-32 object-cover bg-white"
                                                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeletePhoto(index)}
                                                            className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all duration-200"
                                                            aria-label="Hapus foto"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                        New ({file.name})
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                        >
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {isEdit ? 'Update Program' : 'Simpan Program'}
                            </span>
                        </button>

                        {data.photos.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg"
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload & Simpan ({data.photos.length} foto)
                                </span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
