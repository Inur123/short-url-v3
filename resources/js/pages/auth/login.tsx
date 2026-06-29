import { Head, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppLogoIcon from '@/components/app-logo-icon';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

// ─── Custom Logo ─────────────────────────────────────────────────────────────

function ShortUrlLogo() {
    return (
        <div className="flex h-16 w-16 items-center justify-center">
            <AppLogoIcon className="h-full w-full object-contain" />
        </div>
    );
}

// ─── Background decoration (Light Mode) ───────────────────────────────────────

function BackgroundDecor() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-50">
            {/* Top-left subtle glow */}
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
            {/* Bottom-right subtle glow */}
            <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage:
                        'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />
        </div>
    );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function Login() {
    const { data, setData, post, processing } = useForm({
        email: 'admin@short.url', // Disediakan secara aman agar lolos pipeline filter internal Laravel Fortify
        password: '',
    });

    // PWA Installation states
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    // Listen to browser PWA install availability prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Show our custom banner
            setShowInstallBanner(true);
        };

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt,
        );

        // Also check if app is already installed/running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowInstallBanner(false);
        }

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt,
            );
        };
    }, []);

    // Trigger PWA installation native dialog
    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the native browser prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setShowInstallBanner(false);
    };

    // Detect ?logged_out=1 query parameter in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('logged_out') === '1') {
            toast.success('Berhasil keluar!');

            // Clean up the URL query parameter
            const url = new URL(window.location.href);
            url.searchParams.delete('logged_out');
            window.history.replaceState({}, '', url.pathname);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                toast.success('Berhasil masuk! Selamat datang.');
            },
            onError: (errs) => {
                const errorText = errs?.password || errs?.email || '';

                if (
                    errorText.toLowerCase().includes('too many') ||
                    errorText.toLowerCase().includes('banyak percobaan')
                ) {
                    toast.error(
                        'Terlalu banyak percobaan masuk. Silakan tunggu beberapa saat.',
                    );
                } else {
                    toast.error(
                        'Password yang Anda masukkan salah. Silakan coba lagi.',
                    );
                }
            },
        });
    };

    return (
        <>
            <Head title="Sign In — Short URL" />

            {/* PWA Floating Card (Top Centered Ramping - Persis Gambar Kedua) */}
            {showInstallBanner && (
                <div className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 animate-in px-4 duration-300 fade-in slide-in-from-top sm:px-0">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/95 py-2.5 pr-4 pl-3.5 shadow-xl shadow-slate-100/70 backdrop-blur-sm">
                        <div className="flex min-w-0 items-center gap-3">
                            {/* App Logo */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm">
                                <AppLogoIcon className="h-full w-full object-contain" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs leading-none font-bold text-slate-800">
                                    Pasang Aplikasi Short URL
                                </p>
                                <p className="mt-1.5 truncate text-[10px] leading-none text-slate-500">
                                    Akses cepat & stabil langsung dari Home
                                    Screen
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <button
                                onClick={handleInstallClick}
                                className="cursor-pointer rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-violet-500 active:scale-95"
                            >
                                Pasang
                            </button>
                            <button
                                onClick={() => setShowInstallBanner(false)}
                                className="cursor-pointer rounded-lg p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                title="Tutup"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative flex min-h-screen items-center justify-center px-4">
                <BackgroundDecor />

                {/* Card */}
                <div className="relative z-10 w-full max-w-sm">
                    {/* Logo + Brand */}
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <ShortUrlLogo />
                        <div className="text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                                Short URL
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Admin panel · Sign in to continue
                            </p>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-100/50 backdrop-blur-sm">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-slate-600"
                                >
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    maxLength={100}
                                    value={data.password}
                                    onChange={(e) => {
                                        const inputVal = e.target.value;
                                        // Block dangerous SQL characters: ', ", ;, \, --
                                        const cleanVal = inputVal.replace(
                                            /['";\\-]/g,
                                            '',
                                        );

                                        if (inputVal !== cleanVal) {
                                            toast.warning(
                                                'Karakter berbahaya (\', ", ;, \\, -) telah diblokir demi keamanan!',
                                            );
                                        }

                                        setData('password', cleanVal);
                                    }}
                                    autoComplete="current-password"
                                    placeholder="Masukkan password Anda"
                                    className="border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus-visible:border-violet-500 focus-visible:ring-1 focus-visible:ring-violet-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 w-full cursor-pointer bg-violet-600 font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-500 active:bg-violet-700"
                                tabIndex={2}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Footer note */}
                    <p className="mt-6 text-center text-xs text-slate-400">
                        Short URL v3 · Admin access only
                    </p>
                </div>
            </div>
        </>
    );
}

Login.layout = null;
