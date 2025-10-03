<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script>
            (function () {
                try {
                    var fallback = @json($appearance ?? 'system');
                    var saved = localStorage.getItem('appearance') || fallback;

                    if (!saved || saved === 'system') {
                        var match = document.cookie.match(/(?:^|;\s*)appearance=([^;]+)/);

                        if (match && match[1]) {
                            saved = decodeURIComponent(match[1]);
                        }
                    }

                    if (saved !== 'dark' && saved !== 'light') {
                        saved = 'system';
                    }

                    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    var useDark = saved === 'dark' || (saved === 'system' && systemDark);

                    document.documentElement.classList.toggle('dark', useDark);
                    document.documentElement.style.colorScheme = useDark ? 'dark' : 'light';
                } catch (error) {}
            })();
        </script>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap"
            rel="stylesheet"
        >

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="min-h-dvh bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
        @inertia
    </body>
</html>
