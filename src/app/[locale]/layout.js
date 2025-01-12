
import "./globals.css";

import { GoogleAnalyticsTrack } from "@/components/GoogleAnalytics/GoogleAnalytics";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import { UserProvider } from "@/lib/userContextProvider";
import { ThemeProvider } from "@/lib/themeContextProvider";

import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import { DrawerMenu } from "@/components/drawer-menu/drawer-menu";

import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { fetchUserProfile } from "@/lib/fetchUserProfile";
// import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleAnalytics } from '@next/third-parties/google';

import Script from 'next/script';

// Vercel
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"





export const metadata = {
    title: "Gratis annoncer for massage, sex, escort, swingers | Voksenannoncer",
    description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
};

export default async function RootLayout(props) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    const { user } = await fetchCurrentUser();
    const { userProfile } = user
        ? await fetchUserProfile(user.id)
        : { userProfile: null };

    const userContextValue = { user, userProfile };

    return (
        <html lang={locale}>
                <UserProvider value={userContextValue}>
                    <ThemeProvider>
                        <head>
                            <meta name="google-site-verification" content="mtGW7fC42DdH1-8kn32_KZXqTTb3WWugcpAq5ZV3mZE" />
                            <Script
                                id="cookieyes"
                                src={`https://cdn-cookieyes.com/client_data/64376506a85904a59f66f025/script.js`}
                                strategy="lazyOnload"
                            >
                            </Script>
                            {/* <GoogleTagManager gtmId="GTM-K9P4CJ8N" /> */}
                            <GoogleAnalytics gaId="G-JN6QV704E2" strategy="lazyOnload" />
                            <Analytics />
                            <SpeedInsights />
                        </head>
                        <body className="bg-base-300 min-h-screen">
                        <NextIntlClientProvider messages={messages}>

                            <GoogleAnalyticsTrack />


                            <div className="drawer drawer-end">

                                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                                <div className="drawer-content">

                                    <div className="container mx-auto p-5">
                                        <NavBar />
                                    </div>
                                    <div className="container mx-auto p-5">
                                        {children}
                                    </div>
                                    <div className="container mx-auto p-5">
                                        <Footer />
                                    </div>
                                </div>
                                <div className="drawer-side">
                                    <label htmlFor="my-drawer" aria-label="Close sidebar" role="button" tabIndex="0" className="drawer-overlay"></label>
                                    <DrawerMenu />

                                </div>

                            </div>
                            </NextIntlClientProvider>

                        </body>

                    </ThemeProvider>
                </UserProvider>
        </html>
    );
}


