import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/lib/providers";
import { ToastHost } from "@/components/toast-host";

const appSans = Inter({ variable: "--font-app-sans", subsets: ["latin"] });
const appMono = IBM_Plex_Mono({ variable: "--font-app-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "DompetKu",
  description: "Prototipe akademik kontrol akses dalam konteks sistem dompet digital.",
};

function getRuntimeConfigScript() {
  const apiBaseUrl = (process.env.APP_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

  return `window.__APP_CONFIG__ = ${JSON.stringify({ apiBaseUrl })};`;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${appSans.variable} ${appMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getRuntimeConfigScript() }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          {children}
          <ToastHost />
        </Providers>
      </body>
    </html>
  );
}
