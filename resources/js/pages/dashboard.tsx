import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Check,
    Copy,
    ExternalLink,
    Link2,
    MousePointerClick,
    Plus,
    Power,
    Trash2,
    X,
    LogOut,
    AlertTriangle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AppLogoIcon from '@/components/app-logo-icon';

// ─── Logo (same as login page) ────────────────────────────────────────────────

function ShortUrlLogo({ size = 32 }: { size?: number }) {
    return (
        <div style={{ width: size, height: size }} className="flex items-center justify-center">
            <AppLogoIcon className="h-full w-full object-contain" />
        </div>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ShortLink = {
    id: number;
    original_url: string;
    slug: string;
    title: string | null;
    click_count: number;
    is_active: boolean;
    expired_at: string | null;
    status: 'active' | 'inactive' | 'expired';
    created_at: string;
    short_url: string;
};

type Props = {
    links: ShortLink[];
    stats: {
        total_links: number;
        total_clicks: number;
        active_links: number;
    };
};

// ─── Copy Button Component ───────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Link disalin ke papan klip!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Gagal menyalin link');
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            title="Salin short link"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95 cursor-pointer"
        >
            {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
}

// ─── Status Badge Component ──────────────────────────────────────────────────

function StatusBadge({
    status,
}: {
    status: 'active' | 'inactive' | 'expired';
}) {
    const config = {
        active: {
            label: 'Aktif',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            dot: 'bg-emerald-500',
        },
        inactive: {
            label: 'Nonaktif',
            className: 'bg-slate-100 text-slate-600 border-slate-200',
            dot: 'bg-slate-400',
        },
        expired: {
            label: 'Kedaluwarsa',
            className: 'bg-rose-50 text-rose-700 border-rose-200',
            dot: 'bg-rose-500',
        },
    };

    const current = config[status] || config.inactive;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${current.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
            {current.label}
        </span>
    );
}

// ─── Create Link Modal ────────────────────────────────────────────────────────

function CreateLinkModal({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        original_url: '',
        title: '',
        slug: '',
        expired_at: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/links', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-lg animate-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-200 zoom-in-95 fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Buat Short Link Baru
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    {/* Original URL */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            URL Tujuan <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="url"
                            value={data.original_url}
                            onChange={(e) =>
                                setData('original_url', e.target.value)
                            }
                            placeholder="https://example.com/url/tujuan/panjang"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        />
                        {errors.original_url && (
                            <p className="text-xs text-rose-500">
                                {errors.original_url}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Judul{' '}
                            <span className="text-slate-400">(opsional)</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Tulis judul link"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        />
                    </div>

                    {/* Custom Slug */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Custom Alias{' '}
                            <span className="text-slate-400">(opsional)</span>
                        </label>
                        <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500">
                            <span className="shrink-0 border-r border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                                {window.location.host}/
                            </span>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                                placeholder="alias-saya"
                                className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none"
                            />
                        </div>
                        {errors.slug && (
                            <p className="text-xs text-rose-500">
                                {errors.slug}
                            </p>
                        )}
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Tanggal Kedaluwarsa{' '}
                            <span className="text-slate-400">(opsional)</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={data.expired_at}
                            onChange={(e) =>
                                setData('expired_at', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-colors outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        />
                        {errors.expired_at && (
                            <p className="text-xs text-rose-500">
                                {errors.expired_at}
                            </p>
                        )}
                    </div>

                    {/* Toggle Active */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-2.5">
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                Aktif
                            </p>
                            <p className="text-xs text-slate-400">
                                Link dapat diakses secara langsung
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={data.is_active}
                            onClick={() =>
                                setData('is_active', !data.is_active)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                data.is_active
                                    ? 'bg-violet-600'
                                    : 'bg-slate-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    data.is_active
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Footer / Action buttons */}
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 active:scale-95 cursor-pointer"
                        >
                            {processing ? 'Menyimpan...' : 'Buat Link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Confirmation Modal Component ───────────────────────────────────────────

function ConfirmModal({
    title,
    message,
    confirmText,
    cancelText = 'Batal',
    type = 'danger',
    onClose,
    onConfirm,
}: {
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    type?: 'danger' | 'warning';
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer ${
                            type === 'danger' 
                                ? 'bg-rose-600 hover:bg-rose-500' 
                                : 'bg-violet-600 hover:bg-violet-500'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    icon: Icon,
    color,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                    {label}
                </p>
                <p className="text-2xl font-bold text-slate-800">
                    {value.toLocaleString()}
                </p>
            </div>
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
            >
                <Icon className="h-5 w-5" />
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard({ links, stats }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Read flash message from Inertia Page props
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            let successMsg = flash.success;

            if (flash.success.includes('created')) {
                successMsg = 'Short link berhasil dibuat!';
            } else if (flash.success.includes('updated')) {
                successMsg = 'Short link berhasil diperbarui!';
            } else if (flash.success.includes('deleted')) {
                successMsg = 'Short link berhasil dihapus!';
            }

            toast.success(successMsg);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleToggleActive = (link: ShortLink) => {
        router.patch(
            `/links/${link.id}`,
            { is_active: !link.is_active },
            { preserveScroll: true },
        );
    };

    const handleConfirmDelete = () => {
        if (deleteConfirmId) {
            router.delete(`/links/${deleteConfirmId}`, { 
                preserveScroll: true,
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    const handleConfirmLogout = () => {
        router.post('/logout', {}, { preserveScroll: false });
    };

    const formatDate = (iso: string | null) => {
        if (!iso) {
            return '—';
        }

        return new Date(iso).toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Dashboard — Short URL" />

            <div className="min-h-screen bg-slate-50/70 text-slate-800">
                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <ShortUrlLogo size={36} />
                            <span className="text-lg font-bold tracking-tight text-slate-800">
                                Short URL
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                id="create-link-btn"
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-100 transition-colors hover:bg-violet-500 active:scale-95 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Link Baru</span>
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                                title="Keluar"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Total Link"
                            value={stats.total_links}
                            icon={Link2}
                            color="bg-violet-50 text-violet-600 border border-violet-100"
                        />
                        <StatCard
                            label="Total Klik"
                            value={stats.total_clicks}
                            icon={MousePointerClick}
                            color="bg-blue-50 text-blue-600 border border-blue-100"
                        />
                        <StatCard
                            label="Link Aktif"
                            value={stats.active_links}
                            icon={Link2}
                            color="bg-emerald-50 text-emerald-600 border border-emerald-100"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Table Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 md:px-6">
                            <h2 className="text-base font-semibold text-slate-800">
                                Daftar Link Anda
                            </h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                                {links.length} Link
                            </span>
                        </div>

                        {/* Link List */}
                        {links.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">
                                    <Link2 className="h-6 w-6" />
                                </div>
                                <p className="font-semibold text-slate-700">
                                    Belum ada link yang dibuat
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Buat short link pertama Anda untuk memulai
                                </p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                    Buat Link
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {links.map((link) => (
                                    <div
                                        key={link.id}
                                        className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-slate-50/40 md:flex-row md:items-center md:px-6 md:py-4"
                                    >
                                        {/* Left: Info */}
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {link.title ? (
                                                    <h3 className="max-w-xs truncate text-sm font-semibold text-slate-700 md:max-w-md md:text-base">
                                                        {link.title}
                                                    </h3>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">
                                                        Tanpa Judul
                                                    </span>
                                                )}
                                                <StatusBadge
                                                    status={link.status}
                                                />
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-sm font-bold text-violet-600">
                                                    /{link.slug}
                                                </span>
                                                <CopyButton
                                                    text={link.short_url}
                                                />
                                                <a
                                                    href={link.original_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>

                                            <p className="max-w-[280px] truncate text-xs text-slate-400 sm:max-w-lg md:max-w-xl">
                                                {link.original_url}
                                            </p>
                                        </div>

                                        {/* Right: Actions and Stats */}
                                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:shrink-0 md:justify-end md:border-none md:pt-0">
                                            {/* Info items */}
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <div
                                                    className="flex items-center gap-1.5"
                                                    title="Total Clicks"
                                                >
                                                    <MousePointerClick className="h-4 w-4 text-slate-400" />
                                                    <span className="font-semibold">
                                                        {link.click_count.toLocaleString()}
                                                    </span>
                                                </div>

                                                {link.expired_at && (
                                                    <span className="text-slate-400">
                                                        Exp:{' '}
                                                        {formatDate(
                                                            link.expired_at,
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1">
                                                {/* Toggle Active */}
                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(link)
                                                    }
                                                    title={
                                                        link.is_active
                                                            ? 'Nonaktifkan link'
                                                            : 'Aktifkan link'
                                                    }
                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                                        link.is_active
                                                            ? 'text-emerald-600 hover:bg-emerald-50'
                                                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                                    }`}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() =>
                                                        setDeleteConfirmId(link.id)
                                                    }
                                                    title="Hapus link"
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Create Modal */}
            {showModal && (
                <CreateLinkModal onClose={() => setShowModal(false)} />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId !== null && (
                <ConfirmModal
                    title="Hapus Short Link"
                    message="Apakah Anda yakin ingin menghapus short link ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan."
                    confirmText="Hapus Link"
                    type="danger"
                    onClose={() => setDeleteConfirmId(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <ConfirmModal
                    title="Keluar dari Panel Admin"
                    message="Apakah Anda yakin ingin keluar dari sistem admin Short URL?"
                    confirmText="Keluar"
                    type="warning"
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={handleConfirmLogout}
                />
            )}
        </>
    );
}

Dashboard.layout = null;
