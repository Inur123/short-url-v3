<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>503 — Sedang Dalam Pemeliharaan</title>
    <link rel="icon" href="/logo.png" type="image/png">
    <!-- Laravel Vite CSS -->
    @vite(['resources/css/app.css'])
</head>
<body class="bg-slate-50 antialiased font-sans flex items-center justify-center min-h-screen relative overflow-hidden">
    <!-- Background Decor (Glow & Grid) -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"></div>
        <div class="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div class="absolute inset-0 opacity-[0.4]" style="background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>

    <!-- Error Card -->
    <div class="relative z-10 w-full max-w-md p-6 text-center">
        <!-- Logo -->
        <div class="mb-8 flex justify-center">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <img src="/logo.png" alt="Logo" class="h-full w-full object-contain">
            </div>
        </div>

        <h1 class="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 leading-none">503</h1>
        <h2 class="text-2xl font-bold text-slate-800 mt-6">Mode Pemeliharaan</h2>
        <p class="text-sm text-slate-500 mt-2.5 leading-relaxed max-w-sm mx-auto">
            Sistem kami sedang dalam pemeliharaan rutin untuk meningkatkan performa layanan. Silakan kembali beberapa saat lagi.
        </p>

        <div class="mt-8 flex justify-center items-center gap-2 text-xs font-semibold text-slate-400">
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Server Sedang Diperbarui</span>
        </div>
    </div>
</body>
</html>
