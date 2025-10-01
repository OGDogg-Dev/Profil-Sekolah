import { useCallback, useEffect, useState } from 'react';

type UseA11yResult = {
    fontScale: number;
    highContrast: boolean;
    increaseFont: () => void;
    decreaseFont: () => void;
    resetFont: () => void;
    toggleContrast: () => void;
};

const FONT_SCALE_KEY = 'a11y-font-scale';
const CONTRAST_KEY = 'a11y-high-contrast';
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.5;
const STEP = 0.1;

export function useA11y(): UseA11yResult {
    const [fontScale, setFontScale] = useState(() => {
        const stored = typeof window !== 'undefined' ? window.localStorage.getItem(FONT_SCALE_KEY) : null;
        return stored ? Number.parseFloat(stored) || 1 : 1;
    });
    const [highContrast, setHighContrast] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.localStorage.getItem(CONTRAST_KEY) === '1';
    });

    useEffect(() => {
        document.documentElement.style.setProperty('--font-scale', fontScale.toString());
        window.localStorage.setItem(FONT_SCALE_KEY, fontScale.toString());
    }, [fontScale]);

    useEffect(() => {
        document.body.classList.toggle('contrast-hc', highContrast);
        window.localStorage.setItem(CONTRAST_KEY, highContrast ? '1' : '0');
    }, [highContrast]);

    const clampScale = useCallback((value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(value.toFixed(2)))), []);

    const increaseFont = useCallback(() => {
        setFontScale((prev) => clampScale(prev + STEP));
    }, [clampScale]);

    const decreaseFont = useCallback(() => {
        setFontScale((prev) => clampScale(prev - STEP));
    }, [clampScale]);

    const resetFont = useCallback(() => {
        setFontScale(1);
    }, []);

    const toggleContrast = useCallback(() => {
        setHighContrast((prev) => !prev);
    }, []);

    return { fontScale, highContrast, increaseFont, decreaseFont, resetFont, toggleContrast };
}
