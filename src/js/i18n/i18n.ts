import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Supported languages
export const supportedLanguages = ['en', 'de', 'zh', 'vi'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageNames: Record<SupportedLanguage, string> = {
    en: 'English',
    de: 'Deutsch',
    zh: '中文',
    vi: 'Tiếng Việt',
};

export const getLanguageFromUrl = (): SupportedLanguage => {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && supportedLanguages.includes(storedLang as SupportedLanguage)) {
        return storedLang as SupportedLanguage;
    }

    // Fallback to browser language detection
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.includes(browserLang as SupportedLanguage)) {
        return browserLang as SupportedLanguage;
    }

    // Default to Chinese instead of English
    return 'zh';
};

let initialized = false;

export const initI18n = async (): Promise<typeof i18next> => {
    if (initialized) return i18next;

    const currentLang = getLanguageFromUrl();

    await i18next
        .use(HttpBackend)
        .use(LanguageDetector)
        .init({
            lng: currentLang,
            fallbackLng: 'en',
            supportedLngs: supportedLanguages as unknown as string[],
            ns: ['common', 'tools'],
            defaultNS: 'common',
            backend: {
                loadPath: `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}locales/{{lng}}/{{ns}}.json`,
            },
            detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage'],
            },
            interpolation: {
                escapeValue: false,
            },
        });

    initialized = true;
    return i18next;
};

export const t = (key: string, options?: Record<string, unknown>): string => {
    return i18next.t(key, options);
};

export const changeLanguage = (lang: SupportedLanguage): void => {
    if (!supportedLanguages.includes(lang)) return;

    // Update localStorage with the new language
    localStorage.setItem('i18nextLng', lang);
    
    // Refresh the page to apply the new language
    window.location.reload();
};

// Apply translations to all elements with data-i18n attribute
export const applyTranslations = (): void => {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            const translation = t(key);
            if (translation && translation !== key) {
                element.textContent = translation;
            }
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (key && element instanceof HTMLInputElement) {
            const translation = t(key);
            if (translation && translation !== key) {
                element.placeholder = translation;
            }
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
        const key = element.getAttribute('data-i18n-title');
        if (key) {
            const translation = t(key);
            if (translation && translation !== key) {
                (element as HTMLElement).title = translation;
            }
        }
    });

    document.documentElement.lang = i18next.language;
};

export const rewriteLinks = (): void => {
    // This function is no longer needed since we're not using URL path prefixes for languages
    // The function is kept for potential future use but does nothing
    return;
};

export default i18next;
