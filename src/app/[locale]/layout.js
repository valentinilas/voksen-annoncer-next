import "./globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";


export const metadata = {
    title: "Gratis Voksenannoncer | Post Dine Annoncer på Vores Platform",
    description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
};

export default async function RootLayout({ children, params: { locale } }) {
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <head>
                    <meta name="google-site-verification" content="D9Ahahi8ocLrnA0WeR3prEKDRIUURcQFVQ0a4lL0p58" />
                </head>
                <body className="bg-base-300 min-h-screen">
                    <div className="container mx-auto p-5">
                        <NavBar />
                    </div>
                    <div className="container mx-auto p-5">
                        {children}
                    </div>
                    <div className="container mx-auto p-5">
                        <Footer />
                    </div>
                </body>
            </NextIntlClientProvider>
        </html>
    );

}
