import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Section from '@/components/ui/Section';
import ProgramDetail from '@/components/vocational/ProgramDetail';
import type { VocationalProgram } from '@/features/vocational/types';

interface VocationalDetailProps {
    program: VocationalProgram;
}

export default function VocationalDetail({ program }: VocationalDetailProps) {
    const siteName = 'Vokasional Disabilitas';

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`${program.title} - ${siteName}`} />
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="vokasional" />
            <main id="main-content" className="space-y-10">
                <Section id="program-detail" className="space-y-8">
                    <Breadcrumbs
                        items={[
                            { label: 'Vokasional', href: '/vokasional' },
                            { label: program.title },
                        ]}
                    />
                    <ProgramDetail program={program} />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
