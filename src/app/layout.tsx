import { ThemeProvider } from "@/providers/ThemeProvider";

import HeaderComponent from "@/components/Header";
import NavBarComponent from "@/components/NavBar";
import BackgroundDecor from "@/components/BackgroundDecor";

import { Geist } from "next/font/google";
import "@/assets/scss/ReluxCode.scss";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            storageKey="theme" 
          >
            <HeaderComponent />
              {children}
            <div id="modal-root"></div>
            <NavBarComponent />
            <BackgroundDecor />
          </ThemeProvider>
            
        </body>
    </html>
  );
}
