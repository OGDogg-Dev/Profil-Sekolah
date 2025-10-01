import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Section from '@/components/ui/Section';

type FormState = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function Contact() {
    const { props } = usePage();
    const flash = (props as any)?.flash as { success?: string } | undefined;
    const errors = (props as any)?.errors as Record<string, string> | undefined;
    const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.post('/hubungi-kami', form);
    };

    const siteName = 'Vokasional Disabilitas';

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`Hubungi Kami - ${siteName}`} />
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="kontak" />
            <main id="main-content">
                <Section id="contact" title="Hubungi Kami">
                    <p className="mb-6 text-sm text-slate-600">
                        Silakan sampaikan pertanyaan, kerjasama, atau informasi lain melalui formulir berikut. Tim kami akan merespons maksimal 1x24 jam kerja.
                    </p>
                    <form onSubmit={submit} className="grid max-w-3xl gap-4 md:grid-cols-2">
                        {flash?.success ? (
                            <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                                {flash.success}
                            </div>
                        ) : null}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Nama</label>
                            <input
                                className="mt-1 w-full rounded-xl border px-3 py-2"
                                placeholder="Nama lengkap"
                                value={form.name}
                                onChange={(event) => setForm({ ...form, name: event.target.value })}
                                required
                            />
                            {errors?.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email (opsional)</label>
                            <input
                                className="mt-1 w-full rounded-xl border px-3 py-2"
                                placeholder="email@contoh.com"
                                value={form.email}
                                type="email"
                                onChange={(event) => setForm({ ...form, email: event.target.value })}
                            />
                            {errors?.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Telepon (opsional)</label>
                            <input
                                className="mt-1 w-full rounded-xl border px-3 py-2"
                                placeholder="08xxxxxxxx"
                                value={form.phone}
                                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                            />
                            {errors?.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Pesan</label>
                            <textarea
                                className="mt-1 w-full rounded-xl border px-3 py-2"
                                placeholder="Tulis pesan Anda"
                                rows={5}
                                value={form.message}
                                onChange={(event) => setForm({ ...form, message: event.target.value })}
                                required
                            />
                            {errors?.message ? <p className="mt-1 text-xs text-rose-600">{errors.message}</p> : null}
                        </div>
                        <div className="md:col-span-2 flex items-center justify-end">
                            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-slate-800">
                                Kirim Pesan
                            </button>
                        </div>
                    </form>
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
