import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/card';
import ProgramGrid from '@/components/vocational/ProgramGrid';
import type { VocationalProgram } from '@/features/vocational/types';

interface VocationalIndexProps {
    items: VocationalProgram[];
}

export default function VocationalIndex({ items }: VocationalIndexProps) {
    const siteName = 'Vokasional Disabilitas';

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`Program Vokasional - ${siteName}`} />
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="vokasional" />
            <main id="main-content" className="space-y-12">
                <Section id="vokasional" className="space-y-8">
                    <Breadcrumbs items={[{ label: 'Vokasional', href: '/vokasional' }]} />
                    <header className="space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900">Program Vokasional</h1>
                        <p className="text-slate-600">
                            Pilihan program yang dirancang bersama industri dan komunitas untuk membuka peluang kerja dan wirausaha bagi penyandang disabilitas.
                        </p>
                    </header>
                    <Card className="border-dashed bg-slate-50/60 p-6 text-sm text-slate-600">
                        Setiap program menyediakan asesor kompetensi, mentor profesional, serta fasilitas adaptif. Silakan pilih program untuk melihat kurikulum, fasilitas, dan dokumentasi kegiatan.
                    </Card>
                    <ProgramGrid items={items} />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
