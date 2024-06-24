
import "./globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { UserProvider } from "@/lib/userContextProvider";
import { ThemeProvider } from "@/lib/themeContextProvider";
import { getMessages } from 'next-intl/server';

import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import { DrawerMenu } from "@/components/drawer-menu/drawer-menu";

import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { fetchUserProfile } from "@/lib/fetchUserProfile";
import { GoogleAnalytics } from '@next/third-parties/google'


export const metadata = {
    title: "Gratis Voksenannoncer | Post Dine Annoncer på Vores Platform",
    description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
};

export default async function RootLayout({ children, params: { locale } }) {
    const messages = await getMessages();

    const { user } = await fetchCurrentUser();
    const { userProfile } = user
        ? await fetchUserProfile(user.id)
        : { userProfile: null };

    const userContextValue = { user, userProfile };

    return (
        <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <UserProvider value={userContextValue}>
                    <ThemeProvider>
                        <head>
                            <meta name="google-site-verification" content="D9Ahahi8ocLrnA0WeR3prEKDRIUURcQFVQ0a4lL0p58" />
                        </head>
                        <body className="bg-base-300 min-h-screen">
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
                                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                                    <DrawerMenu />

                                </div>

                            </div>

                        </body>
                    </ThemeProvider>
                </UserProvider>
            </NextIntlClientProvider>
            <GoogleAnalytics gaId="G-JN6QV704E2" />
        </html>
    );

}


