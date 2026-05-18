import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { Providers } from "@/lib/providers";
import { ToastHost } from "@/components/toast-host";

const appSans = Plus_Jakarta_Sans({ variable: "--font-app-sans", subsets: ["latin"] });
const appMono = IBM_Plex_Mono({ variable: "--font-app-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "DompetKu",
  description: "Platform operasional dompet digital dengan dukungan tiket, chat, dan audit real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="id" className={`${appSans.variable} ${appMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <ToastHost />
        </Providers>
      </body>
    </html>
  );
}
