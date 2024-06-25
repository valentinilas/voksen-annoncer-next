import { useTranslations } from "next-intl";


export default function About() {
    const t = useTranslations();

    return (
        <section className="support">
            <div className="bg-base-200 p-20 rounded-box shadow-sm">
                <h1 className="text-4xl mb-5">{t('about.welcome')}</h1>
                <h2 className="text-2xl mb-5">{t('about.tagline')}</h2>
                <p className="mb-3">{t('about.intro')}</p>

                <h3 className="text-xl font-bold  mb-2 mt-4">{t('about.whyChoose')}</h3>
                <p className="mb-3"><strong>{t('about.safeAndSecure')}</strong><br />
                    {t('about.safeAndSecureDesc')}</p>

                <p className="mb-3"><strong>{t('about.connectWith')}</strong><br />
                    {t('about.connectWithDesc')}</p>

                <p className="mb-3"><strong>{t('about.easyToUse')}</strong><br />
                    {t('about.easyToUseDesc')}</p>

                <p className="mb-3"><strong>{t('about.discreetConfidential')}</strong><br />
                    {t('about.discreetConfidentialDesc')}</p>

                <h3 className="text-xl font-bold mb-2 mt-4">{t('about.getStarted')}</h3>
                <ol className="mb-3">
                    <li><strong>{t('about.createAd')}</strong>: {t('about.createAdDesc')}</li>
                    <li><strong>{t('about.browseConnect')}</strong>: {t('about.browseConnectDesc')}</li>
                    <li><strong>{t('about.enjoyExperience')}</strong>: {t('about.enjoyExperienceDesc')}</li>
                </ol>

                <p className="mb-3">{t('about.joinToday')}</p>
                <p className="mb-3"><strong>{t('about.whereConnectionsBegin')}</strong></p>
            </div>

        </section>
    );
}