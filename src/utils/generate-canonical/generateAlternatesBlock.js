export function generateAlternatesBlock(locale, path, searchParams = {}) {
    const domain = 'https://www.voksen-annoncer.com';
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    const locales = ['da', 'en'];
    
    // Convert searchParams to query string
    const queryString = Object.keys(searchParams).length 
        ? `?${new URLSearchParams(searchParams).toString()}` 
        : '';

    // Helper to create full URL for a specific locale
    const createLocaleUrl = (loc) => {
        if (loc === 'da') {
            return !cleanPath ? 
                `${domain}${queryString}` : 
                `${domain}/${cleanPath}${queryString}`;
        }
        return !cleanPath ? 
            `${domain}/${loc}${queryString}` : 
            `${domain}/${loc}/${cleanPath}${queryString}`;
    };

    const canonical = createLocaleUrl(locale);
    const languages = locales.reduce((acc, loc) => ({
        ...acc,
        [loc]: createLocaleUrl(loc)
    }), {});

    return {
        canonical,
        languages: {
            ...languages,
            'x-default': createLocaleUrl('da')
        }
    };
}