import React from 'react';
import Card from '@/components/ui/card';
import Pill from '@/components/ui/Pill';
import MediaGallery from '@/components/vocational/MediaGallery';
import type { VocationalProgram } from '@/features/vocational/types';

export default function ProgramDetail({ program }: { program: VocationalProgram }) {
    return (
        <div className="space-y-8">
            <Card className="space-y-6 p-6">
                <header className="space-y-3">
                    <h1 className="text-3xl font-bold text-slate-900">{program.title}</h1>
                    {program.description ? (
                        <p className="text-lg text-slate-600">{program.description}</p>
                    ) : null}
                </header>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Durasi</div>
                        <div className="mt-2 font-medium text-slate-800">{program.duration || 'Menyesuaikan'}</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Jadwal</div>
                        <div className="mt-2 font-medium text-slate-800">{program.schedule || 'Koordinasi dengan peserta'}</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Sasaran Peserta</div>
                        <div className="mt-2 font-medium text-slate-800">{program.audience || 'Penyandang disabilitas siap berkarya'}</div>
                    </Card>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {program.outcomes?.length ? (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Kompetensi Lulusan</h2>
                            <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                {program.outcomes.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    {program.facilities?.length ? (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Fasilitas</h2>
                            <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                {program.facilities.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
                {program.mentors?.length ? (
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Mentor &amp; Pendamping</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {program.mentors.map((mentor, index) => (
                                <Pill key={index}>{mentor}</Pill>
                            ))}
                        </div>
                    </div>
                ) : null}
                <div>
                    <a
                        href="/hubungi-kami"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
                    >
                        Tanya Program / Daftar
                        <span aria-hidden>?</span>
                    </a>
                </div>
            </Card>
            {program.media?.length ? (
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-900">Galeri Program</h2>
                    <MediaGallery items={program.media} />
                </section>
            ) : null}
        </div>
    );
}
