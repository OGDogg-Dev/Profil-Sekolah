import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type SocialLink = {
    label: string;
    url: string;
};

type FooterHour = {
    day: string;
    time: string;
};

type SettingsResource = {
    site_name?: string;
    tagline?: string | null;
    address?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    social?: SocialLink[] | null;
    footer_hours?: FooterHour[] | null;
    logo_url?: string | null;
    og_image_url?: string | null;
};

type PageProps = {
    flash?: { success?: string };
};

type FormValues = {
    site_name: string;
    tagline: string;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    social: SocialLink[];
    footer_hours: FooterHour[];
    logo: File | null;
    og_image: File | null;
};

const ensureEntries = <T extends { [key: string]: string }>(items?: T[] | null, fallback: T = { label: '', url: '' } as T): T[] => {
    if (!items || items.length === 0) {
        return [fallback];
    }

    return items;
};

const ensureHours = (items?: FooterHour[] | null): FooterHour[] => {
    if (!items || items.length === 0) {
        return [{ day: '', time: '' }];
    }

    return items;
};

function Toast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-emerald-500">
            {message}
        </div>
    );
}

type SettingsProps = {
    settings?: SettingsResource | null;
};

export default function SettingsGeneral({ settings }: SettingsProps) {
    const { props } = usePage<PageProps>();
    const [toastMessage, setToastMessage] = useState<string | null>(props.flash?.success ?? null);
    const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo_url ?? null);
    const [ogPreview, setOgPreview] = useState<string | null>(settings?.og_image_url ?? null);

    const { data, setData, post: submitRequest, processing, errors, reset, transform } = useForm<FormValues>({
        site_name: settings?.site_name ?? '',
        tagline: settings?.tagline ?? '',
        address: settings?.address ?? '',
        phone: settings?.phone ?? '',
        whatsapp: settings?.whatsapp ?? '',
        email: settings?.email ?? '',
        social: ensureEntries(settings?.social ?? null, { label: '', url: '' }),
        footer_hours: ensureHours(settings?.footer_hours ?? null),
        logo: null,
        og_image: null,
    });

    useEffect(() => {
        if (props.flash?.success) {
            setToastMessage(props.flash.success);
            const timeout = setTimeout(() => setToastMessage(null), 3500);
            return () => clearTimeout(timeout);
        }

        return undefined;
    }, [props.flash?.success]);

    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(logoPreview);
            }
            if (ogPreview && ogPreview.startsWith('blob:')) {
                URL.revokeObjectURL(ogPreview);
            }
        };
    }, [logoPreview, ogPreview]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const updateSocial = (index: number, key: keyof SocialLink, value: string) => {
        const next = [...data.social];
        next[index] = { ...next[index], [key]: value };
        setData('social', next);
    };

    const addSocial = () => {
        setData('social', [...data.social, { label: '', url: '' }]);
    };

    const removeSocial = (index: number) => {
        const next = data.social.filter((_, idx) => idx !== index);
        setData('social', next.length > 0 ? next : [{ label: '', url: '' }]);
    };

    const updateHour = (index: number, key: keyof FooterHour, value: string) => {
        const next = [...data.footer_hours];
        next[index] = { ...next[index], [key]: value };
        setData('footer_hours', next);
    };

    const addHour = () => {
        setData('footer_hours', [...data.footer_hours, { day: '', time: '' }]);
    };

    const removeHour = (index: number) => {
        const next = data.footer_hours.filter((_, idx) => idx !== index);
        setData('footer_hours', next.length > 0 ? next : [{ day: '', time: '' }]);
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('logo', file);

        if (logoPreview && logoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(logoPreview);
        }

        setLogoPreview(file ? URL.createObjectURL(file) : settings?.logo_url ?? null);
    };

    const handleOgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('og_image', file);

        if (ogPreview && ogPreview.startsWith('blob:')) {
            URL.revokeObjectURL(ogPreview);
        }

        setOgPreview(file ? URL.createObjectURL(file) : settings?.og_image_url ?? null);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transform((current) => {
            const social = current.social.filter((item) => item.label.trim() && item.url.trim());
            const footerHours = current.footer_hours.filter((item) => item.day.trim() && item.time.trim());

            const payload: Record<string, unknown> = {
                site_name: current.site_name,
                tagline: current.tagline,
                address: current.address,
                phone: current.phone,
                whatsapp: current.whatsapp,
                email: current.email,
                social,
                footer_hours: footerHours,
                _method: 'put',
            };

            if (current.logo) {
                payload.logo = current.logo;
            }

            if (current.og_image) {
                payload.og_image = current.og_image;
            }

            return payload;
        });

        submitRequest('/admin/settings', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showToast('Pengaturan tersimpan.');
                reset('logo', 'og_image');
            },
            onFinish: () => {
                transform((formData) => formData);
            },
        });
    };

    return (
        <AdminLayout title="Pengaturan Umum">
            <form onSubmit={submit} className="mx-auto flex w-full max-w-4xl flex-col gap-6" encType="multipart/form-data">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-6 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profil Sekolah</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Perbarui identitas utama sekolah yang tampil di seluruh halaman publik.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Sekolah</label>
                            <input
                                value={data.site_name}
                                onChange={(event) => setData('site_name', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                required
                            />
                            {errors.site_name ? <p className="mt-1 text-xs text-rose-500">{errors.site_name}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tagline</label>
                            <input
                                value={data.tagline}
                                onChange={(event) => setData('tagline', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.tagline ? <p className="mt-1 text-xs text-rose-500">{errors.tagline}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Alamat</label>
                            <textarea
                                value={data.address}
                                onChange={(event) => setData('address', event.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.address ? <p className="mt-1 text-xs text-rose-500">{errors.address}</p> : null}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Telepon</label>
                                <input
                                    value={data.phone}
                                    onChange={(event) => setData('phone', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                {errors.phone ? <p className="mt-1 text-xs text-rose-500">{errors.phone}</p> : null}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp</label>
                                <input
                                    value={data.whatsapp}
                                    onChange={(event) => setData('whatsapp', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                {errors.whatsapp ? <p className="mt-1 text-xs text-rose-500">{errors.whatsapp}</p> : null}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                {errors.email ? <p className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Branding &amp; Logo</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Unggah logo utama dan gambar Open Graph default yang akan digunakan saat konten dibagikan.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-[minmax(0,260px)_1fr]">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="logo">Logo</label>
                                <input
                                    id="logo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleLogoChange}
                                    className="mt-1 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:file:bg-slate-700"
                                />
                                {errors.logo ? <p className="mt-1 text-xs text-rose-500">{errors.logo}</p> : null}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="og">Default OG Image</label>
                                <input
                                    id="og"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleOgChange}
                                    className="mt-1 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:file:bg-slate-700"
                                />
                                {errors.og_image ? <p className="mt-1 text-xs text-rose-500">{errors.og_image}</p> : null}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Pratinjau Logo</p>
                                <div className="mt-3 flex h-36 items-center justify-center rounded-xl bg-white dark:bg-slate-800">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo preview" className="max-h-28 max-w-full object-contain" />
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Belum ada logo.</span>
                                    )}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Pratinjau OG Default</p>
                                <div className="mt-3 h-40 overflow-hidden rounded-xl bg-white dark:bg-slate-800">
                                    {ogPreview ? (
                                        <img src={ogPreview} alt="OG preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">Belum ada gambar OG.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kehadiran Digital</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Kelola tautan sosial media dan jam layanan yang tampil di footer situs.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tautan Sosial</h3>
                                <button
                                    type="button"
                                    onClick={addSocial}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200"
                                >
                                    Tambah
                                </button>
                            </div>
                            <div className="space-y-3">
                                {data.social.map((link, index) => (
                                    <div key={`social-${index}`} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-900">
                                        <input
                                            value={link.label}
                                            onChange={(event) => updateSocial(index, 'label', event.target.value)}
                                            placeholder="Nama platform"
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <input
                                            value={link.url}
                                            onChange={(event) => updateSocial(index, 'url', event.target.value)}
                                            placeholder="https://..."
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSocial(index)}
                                            className="self-end rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.social ? <p className="text-xs text-rose-500">{errors.social}</p> : null}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Jam Layanan Footer</h3>
                                <button
                                    type="button"
                                    onClick={addHour}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200"
                                >
                                    Tambah
                                </button>
                            </div>
                            <div className="space-y-3">
                                {data.footer_hours.map((hour, index) => (
                                    <div key={`hour-${index}`} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-900">
                                        <input
                                            value={hour.day}
                                            onChange={(event) => updateHour(index, 'day', event.target.value)}
                                            placeholder="Senin - Jumat"
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <input
                                            value={hour.time}
                                            onChange={(event) => updateHour(index, 'time', event.target.value)}
                                            placeholder="07.00 - 16.00 WIB"
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeHour(index)}
                                            className="self-end rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.footer_hours ? <p className="text-xs text-rose-500">{errors.footer_hours}</p> : null}
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    >
                        Batal
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
            {toastMessage ? <Toast message={toastMessage} /> : null}
        </AdminLayout>
    );
}
