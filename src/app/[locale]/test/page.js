import TestPageDanish from './components/da';
import TestPageEnglish from './components/en';

export default async function TestPage({ params }) {
    const { locale } = await params;



    if (locale === 'da') {
        return <TestPageDanish />;
    }

    return <TestPageEnglish />; // default or English
}