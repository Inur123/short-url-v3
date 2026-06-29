import { router } from '@inertiajs/react';
import { useEffect } from 'react';

// Redirect root to dashboard (or login if not authenticated)
export default function Welcome() {
    useEffect(() => {
        router.visit('/dashboard');
    }, []);

    return null;
}

Welcome.layout = null;
