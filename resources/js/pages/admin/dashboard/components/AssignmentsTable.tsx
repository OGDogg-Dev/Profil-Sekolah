import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

export type Assignment = {
    id: number;
    title: string;
    subject: string;
    dueDate?: string | null;
    status: string;
    url?: string;
};

const STATUS_MAP: Record<string, { label: string; tone: string }> = {
    published: { label: 'Published', tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
    draft: { label: 'In Progress', tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
    pending: { label: 'Pending', tone: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
};

interface AssignmentsTableProps {
    items: Assignment[];
}

export function AssignmentsTable({ items }: AssignmentsTableProps) {
    const rows = items.length
        ? items
        : [
              { id: 0, title: 'Belum ada tugas konten', subject: '--', dueDate: null, status: 'pending' },
          ];

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900/60">
                    <tr>
                        <th className="px-4 py-3 text-left">No</th>
                        <th className="px-4 py-3 text-left">Konten</th>
                        <th className="px-4 py-3 text-left">Kategori</th>
                        <th className="px-4 py-3 text-left">Jatuh Tempo</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white/80 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                    {rows.map((row, index) => {
                        const status = STATUS_MAP[row.status] ?? STATUS_MAP.pending;

                        return (
                            <tr key={`${row.id}-${index}`} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                                <td className="px-4 py-3 text-xs font-semibold text-slate-500">{String(index + 1).padStart(2, '0')}</td>
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{row.title}</td>
                                <td className="px-4 py-3">{row.subject}</td>
                                <td className="px-4 py-3">{row.dueDate ?? '—'}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.tone}`}>
                                        {status.label}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {row.url ? (
                                        <Link
                                            href={row.url}
                                            className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 px-3 py-1 text-xs font-semibold transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400/60"
                                        >
                                            Edit <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                                        </Link>
                                    ) : (
                                        <span className="text-xs text-slate-400">—</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
