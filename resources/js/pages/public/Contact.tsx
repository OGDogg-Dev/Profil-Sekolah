import { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

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
        school_phone?: string | null;
        school_email?: string | null;
        school_address?: string | null;
    };
};

const initialFormState: FormState = {
    name: '',
    email: '',
    phone: '',
    message: '',
};

export default function Contact({ title }: { title: string }) {
    const { props } = usePage<InertiaPageProps>();
    const flash = props?.flash;
    const errors = props?.errors ?? {};
    const [form, setForm] = useState<FormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setForm({ ...initialFormState });
        }
    }, [flash?.success]);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.post('/hubungi-kami', form, {
            preserveScroll: true,
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
        });
    };

    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const description =
        'Hubungi tim SMK Negeri 10 Kuningan untuk konsultasi kemitraan, layanan siswa, maupun pertanyaan media kapan pun Anda perlukan.';

    const officeAddress = props?.settings?.school_address?.trim() ||
        'Jl. Pendidikan No. 11, Desa Kadugede, Kecamatan Kadugede, Kabupaten Kuningan, Jawa Barat';
    const phoneNumber = props?.settings?.school_phone?.trim() || '0232-123456';
    const emailAddress = props?.settings?.school_email?.trim() || 'info@profilsekolah.test';

    const contactChannels = [
        {
            label: 'Konsultasi Kemitraan',
            headline: 'Ciptakan program kolaboratif',
            detail:
                'Diskusikan peluang praktik kerja, program magang, ataupun dukungan CSR bagi peserta didik bersama tim hubungan industri.',
            action: {
                href: 'mailto:' + emailAddress,
                text: 'Email Tim Industri',
                isExternal: true,
            },
        },
        {
            label: 'Layanan Peserta Didik',
            headline: 'Pendampingan cepat & empatik',
            detail:
                'Tim layanan siswa siap membantu kebutuhan administrasi, konseling, dan penyesuaian pembelajaran untuk siswa berkebutuhan khusus.',
            action: {
                href: 'tel:' + phoneNumber.replace(/[^\d+]/g, ''),
                text: 'Hubungi Sekolah',
                isExternal: true,
            },
        },
        {
            label: 'Publik & Media',
            headline: 'Rilis berita & liputan',
            detail:
                'Ajukan permintaan data, jadwal wawancara, hingga akses dokumentasi kegiatan terbaru sekolah.',
            action: {
                href: '/berita',
                text: 'Lihat Sorotan Berita',
            },
        },
    ];

    const officeFacts = useMemo(
        () => [
            {
                title: 'Jam Layanan',
                description: 'Senin - Jumat pukul 08.00 - 16.00 WIB dengan penjadwalan khusus bagi mitra komunitas.',
            },
            {
                title: 'Lokasi',
                description: officeAddress,
            },
            {
                title: 'Kontak Utama',
                description: `Telepon ${phoneNumber} · ${emailAddress}`,
            },
        ],
        [officeAddress, phoneNumber, emailAddress],
    );

    const responseHighlights = [
        { title: 'Waktu respons rata-rata', value: '< 1 hari kerja', description: 'Pesan yang masuk pada hari kerja akan dijawab maksimal dalam 24 jam.' },
        { title: 'Saluran layanan aktif', value: '4 kanal', description: 'Telepon, WhatsApp, email, dan pertemuan langsung dapat dipilih sesuai kebutuhan.' },
        { title: 'Tim pendamping', value: '3 divisi', description: 'Hubungan industri, layanan peserta didik, serta humas sekolah berkoordinasi menangani pesan Anda.' },
    ];

    const supportMoments = [
        {
            title: 'Butuh rekomendasi program untuk siswa?',
            description:
                'Kami bantu memilihkan jurusan, menyusun kebutuhan akomodasi pembelajaran, dan merancang dukungan karier jangka panjang.',
        },
        {
            title: 'Mencari mitra pelaksanaan kegiatan?',
            description:
                'Tim hubungan industri akan memandu proses penjajakan, penyusunan MoU, hingga monitoring kegiatan bersama mitra.',
        },
        {
            title: 'Ingin liputan kegiatan sekolah?',
            description:
                'Humas sekolah menyiapkan data, narasumber, dan dokumentasi agar publikasi berjalan akurat serta inklusif.',
        },
    ];

    return (
        <PublicLayout siteName={siteName}>
            <Head title={`Hubungi Kami - ${siteName}`}>
                <meta name="description" content={description} />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -left-20 top-16 h-48 w-48 rounded-full bg-emerald-400/30 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-sky-500/30 blur-3xl" />
                </div>
                <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 lg:pt-20">
                    <Breadcrumbs items={[{ label: 'Hubungi Kami', href: '/hubungi-kami' }]} variant="dark" className="text-slate-200" />
                    <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
                        <header className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Pusat Layanan</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
                            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">
                                Kami menyediakan jalur komunikasi yang responsif bagi orang tua, mitra, media, dan komunitas untuk memastikan kebutuhan peserta didik terpenuhi secara menyeluruh.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
                                >
                                    Hubungi via Telepon ↗
                                </a>
                                <a
                                    href={`mailto:${emailAddress}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Kirim Email ke Sekolah
                                </a>
                            </div>
                        </header>
                        <aside className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Ikhtisar Layanan</p>
                            <p className="text-sm text-slate-100">
                                Dapatkan informasi lengkap mengenai jadwal layanan, kanal komunikasi utama, dan koordinasi kunjungan ke kampus.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-100/90">
                                {officeFacts.map((fact) => (
                                    <li key={fact.title} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">{fact.title}</p>
                                        <p className="mt-2 leading-relaxed">{fact.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                    <div className="mt-14 grid gap-6 md:grid-cols-3">
                        {responseHighlights.map((item) => (
                            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-100 backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">{item.title}</p>
                                <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                                <p className="mt-2 leading-relaxed text-slate-100/90">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {contactChannels.map((channel) => (
                            <div key={channel.label} className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">{channel.label}</p>
                                    <h2 className="text-lg font-semibold text-slate-900">{channel.headline}</h2>
                                    <p className="text-sm text-slate-600">{channel.detail}</p>
                                </div>
                                <div className="mt-6">
                                    {channel.action.isExternal ? (
                                        <a
                                            href={channel.action.href}
                                            className="inline-flex items-center gap-2 rounded-full border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                                        >
                                            {channel.action.text} ↗
                                        </a>
                                    ) : (
                                        <Link
                                            href={channel.action.href}
                                            className="inline-flex items-center gap-2 rounded-full border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                                        >
                                            {channel.action.text} ↗
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900">Kirim Pesan Langsung</h2>
                            <p className="mt-3 text-sm text-slate-600">
                                Tulis kebutuhan Anda sedetail mungkin agar tim kami dapat merespons dengan solusi yang relevan. Kami akan menghubungi Anda melalui kanal pilihan dalam satu hari kerja.
                            </p>

                            {flash?.success ? (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">
                                    {flash.success}
                                </div>
                            ) : null}

                            <form onSubmit={submit} className="mt-8 space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="contact-name" className="text-sm font-semibold text-slate-700">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            id="contact-name"
                                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                                            placeholder="Nama lengkap Anda"
                                            value={form.name}
                                            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                            required
                                        />
                                        {errors.name ? <p className="mt-2 text-xs text-rose-500">{errors.name}</p> : null}
                                    </div>
                                    <div>
                                        <label htmlFor="contact-phone" className="text-sm font-semibold text-slate-700">
                                            Nomor Telepon (opsional)
                                        </label>
                                        <input
                                            id="contact-phone"
                                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                                            placeholder="08xxxxxxxx"
                                            value={form.phone}
                                            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                                        />
                                        {errors.phone ? <p className="mt-2 text-xs text-rose-500">{errors.phone}</p> : null}
                                    </div>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="contact-email" className="text-sm font-semibold text-slate-700">
                                            Email (opsional)
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                                            placeholder="email@contoh.com"
                                            value={form.email}
                                            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                        />
                                        {errors.email ? <p className="mt-2 text-xs text-rose-500">{errors.email}</p> : null}
                                    </div>
                                    <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-4 text-xs text-brand-900">
                                        <p className="font-semibold uppercase tracking-[0.3em] text-brand-600">Tips Pesan</p>
                                        <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-brand-900">
                                            <li>Sertakan kanal respons pilihan (WhatsApp, email, atau telepon).</li>
                                            <li>Beritahukan waktu terbaik untuk dihubungi.</li>
                                            <li>Jika perlu, sebutkan kebutuhan aksesibilitas saat pertemuan.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="text-sm font-semibold text-slate-700">
                                        Pesan
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                                        placeholder="Tulis pesan, kebutuhan, atau pertanyaan Anda"
                                        rows={6}
                                        value={form.message}
                                        onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                                        required
                                    />
                                    {errors.message ? <p className="mt-2 text-xs text-rose-500">{errors.message}</p> : null}
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <p className="text-xs text-slate-500">
                                        Dengan mengirim pesan ini Anda menyetujui kebijakan privasi sekolah dan bersedia dihubungi oleh tim kami.
                                    </p>
                                    <button
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Kantor Sekolah</p>
                                <p className="mt-3 text-sm text-slate-600">
                                    {officeAddress}
                                </p>
                                <div className="mt-4 space-y-2 text-sm text-slate-700">
                                    <p>
                                        <span className="font-semibold">Telepon:</span> {phoneNumber}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Email:</span> {emailAddress}
                                    </p>
                                    <p>
                                        <span className="font-semibold">WhatsApp:</span> 0812-3456-7890
                                    </p>
                                </div>
                                <div className="mt-4 space-y-2 text-xs text-slate-500">
                                    <p>Kunjungan tatap muka disarankan melalui janji temu sebelumnya.</p>
                                    <p>Area parkir ramah kursi roda tersedia di pintu masuk utama.</p>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-6 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Peta Lokasi</p>
                                <div className="mt-4 h-48 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
                                    <p className="flex h-full items-center justify-center text-xs text-slate-500">Peta sekolah akan ditampilkan di sini.</p>
                                </div>
                                <a
                                    href="https://maps.google.com/?q=SMK+Negeri+10+Kuningan"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-600"
                                >
                                    Buka di Google Maps ↗
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="grid gap-8 lg:grid-cols-3">
                            {supportMoments.map((moment) => (
                                <div key={moment.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Kapan Menghubungi</p>
                                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{moment.title}</h3>
                                    <p className="mt-2 leading-relaxed">{moment.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-50 px-6 py-6 text-sm text-brand-900">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Kolaborasi Berkelanjutan</p>
                                <p className="mt-2 max-w-2xl text-sm text-brand-900">
                                    Bagikan agenda dan kebutuhan Anda lebih awal agar kami dapat menyiapkan sumber daya terbaik, mulai dari fasilitator, penerjemah bahasa isyarat, hingga dokumentasi kegiatan.
                                </p>
                            </div>
                            <Link
                                href="/agenda"
                                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Lihat Agenda Terkini ↗
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
