import "./globals.css";


import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";


export const metadata = {
  title: "Gratis Voksenannoncer | Post Dine Annoncer på Vores Platform",
  description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
    </html>
  );
}
