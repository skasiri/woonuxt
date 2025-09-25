export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.env.SSR) return;

    const rtlLocales = new Set(['ar', 'fa', 'fa_IR', 'ur', 'he']);

    function applyDirectionForLocale(localeCode: string) {
        const html = document.documentElement;
        const langCode = localeCode?.replace('_', '-').toLowerCase() || 'en';
        const baseLang = (langCode.split('-')[0] || '').toLowerCase();
        const isRTL = rtlLocales.has(localeCode) || rtlLocales.has(baseLang);

        html.setAttribute('lang', langCode);
        html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

        html.classList.toggle('rtl', isRTL);
        html.classList.toggle('ltr', !isRTL);
        document.body.classList.toggle('rtl', isRTL);
        document.body.classList.toggle('ltr', !isRTL);
    }

    const i18n: any = (nuxtApp as any).$i18n;
    const localeRef: any = i18n?.locale ?? i18n?.global?.locale;

    const getCurrentLocale = () => {
        const value = typeof localeRef === 'string' ? localeRef : localeRef?.value;
        return value || 'en';
    };

    applyDirectionForLocale(getCurrentLocale());

    if (localeRef && typeof localeRef !== 'string') {
        watch(localeRef, (newLocale: string) => {
            applyDirectionForLocale(newLocale);
        });
    }
});


