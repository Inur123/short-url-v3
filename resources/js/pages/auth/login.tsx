import { Form, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppLogoIcon from '@/components/app-logo-icon';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

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
    const [passwordVal, setPasswordVal] = useState('');

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

    // Filter characters on password input to prevent dangerous strings
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;

        // Block dangerous SQL characters: ', ", ;, \, --
        // Only allow letters, numbers, and basic safe symbols: @, #, $, %, ^, &, *, !, _, -, ., ?
        const cleanVal = inputVal.replace(/['";\\-]/g, '');

        if (inputVal !== cleanVal) {
            toast.warning(
                'Karakter berbahaya (\', ", ;, \\, -) telah diblokir demi keamanan!',
            );
        }

        setPasswordVal(cleanVal);
    };

    return (
        <>
            <Head title="Sign In — Short URL" />

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
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            onSuccess={() => {
                                toast.success(
                                    'Berhasil masuk! Selamat datang.',
                                );
                            }}
                            onError={(errors) => {
                                const errorText =
                                    errors?.password || errors?.email || '';

                                if (
                                    errorText
                                        .toLowerCase()
                                        .includes('too many') ||
                                    errorText
                                        .toLowerCase()
                                        .includes('banyak percobaan')
                                ) {
                                    toast.error(
                                        'Terlalu banyak percobaan masuk. Silakan tunggu beberapa saat.',
                                    );
                                } else {
                                    toast.error(
                                        'Password yang Anda masukkan salah. Silakan coba lagi.',
                                    );
                                }
                            }}
                            className="flex flex-col gap-5"
                        >
                            {({ processing }) => (
                                <>
                                    {/* Hidden email */}
                                    <input
                                        type="hidden"
                                        name="email"
                                        value="admin@short.url"
                                    />

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
                                            value={passwordVal}
                                            onChange={handlePasswordChange}
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            className="border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus-visible:border-violet-500 focus-visible:ring-1 focus-visible:ring-violet-500"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-1 w-full bg-violet-600 font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-500 active:bg-violet-700 cursor-pointer"
                                        tabIndex={2}
                                        disabled={processing}
                                        data-test="login-button"
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
                                </>
                            )}
                        </Form>
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
