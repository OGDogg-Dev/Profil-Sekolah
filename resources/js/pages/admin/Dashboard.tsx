import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import {
    BookOpenCheck,
    Inbox,
    Layers3,
    MessagesSquare,
    ScrollText,
    Sparkles,
} from 'lucide-react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';
import { StatsCard } from '@/pages/admin/dashboard/components/StatsCard';
import { WelcomeCard } from '@/pages/admin/dashboard/components/WelcomeCard';
import { RadialProgress } from '@/pages/admin/dashboard/components/RadialProgress';
import { MiniAreaChart } from '@/pages/admin/dashboard/components/MiniAreaChart';
import { GradeList } from '@/pages/admin/dashboard/components/GradeList';
import { ResourceTiles } from '@/pages/admin/dashboard/components/ResourceTiles';
import { NoticeBoard } from '@/pages/admin/dashboard/components/NoticeBoard';
import { AssignmentsTable } from '@/pages/admin/dashboard/components/AssignmentsTable';
import { MessagesList } from '@/pages/admin/dashboard/components/MessagesList';
import { CalendarWidget } from '@/pages/admin/dashboard/components/CalendarWidget';
import type { ResourceItem } from '@/pages/admin/dashboard/components/ResourceTiles';
import type { Notice } from '@/pages/admin/dashboard/components/NoticeBoard';
import type { Assignment } from '@/pages/admin/dashboard/components/AssignmentsTable';

const numberFormatter = new Intl.NumberFormat('id-ID');

const percentFormatter = new Intl.NumberFormat('id-ID', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

type DashboardProps = {
    counts: {
        programs: number;
        messages: number;
        unreadMessages: number;
        posts: number;
        publishedPosts: number;
        events: number;
        upcomingEvents: number;
        albums: number;
    };
    overview: {
        attendance: number;
        taskCompletion: number;
        inProgress: number;
        rewardPoints: number;
    };
    scoreActivity: Array<{ label: string; value: number }>;
    gradeByProgram: Array<{ label: string; score: number }>;
    upcomingEvents: Array<{ id: number; title: string; date?: string | null; time?: string | null; location?: string | null }>;
    recentMessages: Array<{ id: number; name: string; message: string; time?: string | null; isRead?: boolean }>;
    assignments: Assignment[];
    resourceSummary: ResourceItem[];
    noticeBoard: Notice[];
};

export default function Dashboard({
    counts,
    overview,
    scoreActivity,
    gradeByProgram,
    upcomingEvents,
    recentMessages,
    assignments,
    resourceSummary,
    noticeBoard,
}: DashboardProps) {
    const { props } = usePage<{ auth?: { user?: { name?: string } } }>();
    const userName = props?.auth?.user?.name ?? 'Admin';

    const totalPosts = counts.posts ?? 0;
    const publishedPosts = counts.publishedPosts ?? 0;
    const pendingPosts = Math.max(0, totalPosts - publishedPosts);

    const heroSubtitle = 'Selamat datang kembali. Pantau aktivitas sekolah, konten, dan layanan digital untuk melayani komunitas vokasional.';

    const heroStats = useMemo(
        () => [
            {
                label: 'Konten terbit',
                value: numberFormatter.format(publishedPosts),
                pill: `${numberFormatter.format(totalPosts)} total`,
            },
            {
                label: 'Pesan masuk',
                value: numberFormatter.format(counts.messages ?? 0),
                pill: `${numberFormatter.format(counts.unreadMessages ?? 0)} belum dibaca`,
            },
            {
                label: 'Agenda',
                value: numberFormatter.format(counts.upcomingEvents ?? 0),
                pill: `${numberFormatter.format(counts.events ?? 0)} total`,
            },
        ],
        [counts.events, counts.messages, counts.unreadMessages, counts.upcomingEvents, publishedPosts, totalPosts],
    );

    const kpis = [
        {
            title: 'Program aktif',
            value: numberFormatter.format(counts.programs ?? 0),
            change: `${counts.programs > 0 ? '+' : ''}${numberFormatter.format(counts.programs ?? 0)} jurusan`,
            icon: Layers3,
            accent: 'violet' as const,
            description: 'Program vokasional terdaftar',
        },
        {
            title: 'Konten siap tayang',
            value: numberFormatter.format(pendingPosts),
            change: totalPosts ? `${numberFormatter.format(publishedPosts)}/${numberFormatter.format(totalPosts)} published` : '—',
            icon: ScrollText,
            accent: 'blue' as const,
            description: pendingPosts ? 'Draft perlu review' : 'Tidak ada draft',
        },
        {
            title: 'Pesan hari ini',
            value: numberFormatter.format(counts.unreadMessages ?? 0),
            change: `${numberFormatter.format(counts.messages ?? 0)} total`,
            icon: MessagesSquare,
            accent: 'rose' as const,
            description: 'Belum ditindaklanjuti',
        },
        {
            title: 'Attendance',
            value: `${overview.attendance}%`,
            change: '+2.5% vs pekan lalu',
            icon: BookOpenCheck,
            accent: 'emerald' as const,
            description: 'Partisipasi kegiatan',
        },
        {
            title: 'Task completion',
            value: percentFormatter.format((overview.taskCompletion ?? 0) / 100),
            change: overview.inProgress > 0 ? `${overview.inProgress} tugas` : 'Semua selesai',
            icon: Sparkles,
            accent: 'amber' as const,
            description: 'Progress konten & agenda',
        },
        {
            title: 'Reward points',
            value: numberFormatter.format(overview.rewardPoints ?? 0),
            change: '+15 poin minggu ini',
            icon: Inbox,
            accent: 'violet' as const,
            description: 'Aktivitas komunitas',
        },
    ];

    const latestActivityValue = scoreActivity.length ? scoreActivity[scoreActivity.length - 1].value : 0;

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-6">
                <WelcomeCard name={userName} subtitle={heroSubtitle} stats={heroStats} />

                <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {kpis.map((item) => (
                                <StatsCard
                                    key={item.title}
                                    title={item.title}
                                    value={item.value}
                                    change={item.change}
                                    icon={item.icon}
                                    accent={item.accent}
                                    description={item.description}
                                />
                            ))}
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                            <MiniAreaChart
                                title="Aktivitas 6 Bulan"
                                data={scoreActivity}
                                highlight={`${latestActivityValue} interaksi`}
                                footer="Riwayat"
                            />
                            <GradeList title="Fokus Program" items={gradeByProgram} />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <NoticeBoard title="Agenda & Pengumuman" items={noticeBoard} />
                            <AssignmentsTable items={assignments} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <RadialProgress value={overview.attendance} label="Attendance" subtitle="Tingkat partisipasi" />
                        <ResourceTiles title="Resources" items={resourceSummary} />
                        <CalendarWidget />
                        <NoticeBoard title="Agenda Mendatang" items={upcomingEvents} />
                        <MessagesList title="Pesan Terbaru" items={recentMessages} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
