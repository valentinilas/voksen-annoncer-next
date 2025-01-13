export function generateAlternatesBlock(locale, path, searchParams = {}, useMainAsCanonical = false) {
    // const domain = 'https://www.voksen-annoncer.com';
    const domain = `${process.env.NEXT_PUBLIC_BASE_URL}`;
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

    // Canonical URL logic: Use Danish locale as the canonical for all languages if flag is set
    // const canonical = useMainAsCanonical ? createLocaleUrl('da') : createLocaleUrl(locale);
    const canonical = createLocaleUrl(locale)

    const languages = locales.reduce((acc, loc) => ({
        ...acc,
        [loc]: createLocaleUrl(loc)
    }), {});

    // If the flag is true, set the canonical for all languages (other than Danish) to use the Danish locale
    // if (useDanishAsCanonical) {
    //     Object.keys(languages).forEach((key) => {
    //         if (key !== 'da') {
    //             languages[key] = createLocaleUrl('da');
    //         }
    //     });
    // }

    return {
        canonical,
        languages: {
            ...languages,
            'x-default': createLocaleUrl('da')
        }
    };
}