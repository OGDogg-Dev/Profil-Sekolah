import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';

type FormState = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

type Flash = {
    success?: string;
};

type InertiaPageProps = {
    flash?: Flash;
    errors?: Record<string, string>;
    settings?: {
        site_name?: string;
    };
};

export default function Contact({ title }: { title: string }) {
    const { props } = usePage<InertiaPageProps>();
    const flash = props?.flash;
    const errors = props?.errors ?? {};
    const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.post('/hubungi-kami', form);
    };

    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';

    return (
        <AppShell siteName={siteName}>
            <Head title={`Hubungi Kami - ${siteName}`} />

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <header className="border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">{title}</h1>
                        <p className="mt-2 text-sm text-slate-600">Where Tomorrow's Leaders Come Together</p>
                    </header>

                    {flash?.success ? (
                        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {flash.success}
                        </div>
                    ) : null}

                    <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
                        <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Nama</label>
                                <input
                                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#1b57d6] focus:outline-none"
                                    placeholder="Nama lengkap"
                                    value={form.name}
                                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                                    required
                                />
                                {errors.name ? <p className="mt-1 text-xs text-rose-500">{errors.name}</p> : null}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Email (opsional)</label>
                                    <input
                                        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#1b57d6] focus:outline-none"
                                        placeholder="email@contoh.com"
                                        value={form.email}
                                        type="email"
                                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                                    />
                                    {errors.email ? <p className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Telepon (opsional)</label>
                                    <input
                                        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#1b57d6] focus:outline-none"
                                        placeholder="08xxxxxxxx"
                                        value={form.phone}
                                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                                    />
                                    {errors.phone ? <p className="mt-1 text-xs text-rose-500">{errors.phone}</p> : null}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Pesan</label>
                                <textarea
                                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#1b57d6] focus:outline-none"
                                    placeholder="Tulis pesan Anda"
                                    rows={5}
                                    value={form.message}
                                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                                    required
                                />
                                {errors.message ? <p className="mt-1 text-xs text-rose-500">{errors.message}</p> : null}
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    className="rounded-full bg-[#1b57d6] px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#0f3bb2]"
                                    type="submit"
                                >
                                    Kirim Pesan
                                </button>
                            </div>
                        </form>
                        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-600">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1b57d6]">Kantor Sekolah</h2>
                            <p>Jl. Pendidikan No. 11, Desa/Kelurahan Kadugede, Kecamatan Kadugede, Kabupaten Kuningan</p>
                            <div className="space-y-1">
                                <p>Telepon: <strong>0232 123456</strong></p>
                                <p>Fax: <strong>0232 123456</strong></p>
                                <p>Email: <strong>info@profilsekolah.test</strong></p>
                            </div>
                            <div className="mt-4 h-48 w-full rounded-md bg-slate-200">
                                <p className="flex h-full items-center justify-center text-xs text-slate-500">Peta sekolah</p>
                            </div>
                            <p className="text-xs text-slate-500">Silakan datang pada hari kerja pukul 08.00 � 16.00 WIB.</p>
                        </aside>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
