import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "HikmaClips",
  description: "Créez de belles vidéos de sagesse pour les médias sociaux.",
  icons: {
    icon: "https://res.cloudinary.com/dhjwimevi/image/upload/v1770072891/ChatGPT_Image_2_f%C3%A9vr._2026_23_43_44_edeg9a.png",
    apple: "https://res.cloudinary.com/dhjwimevi/image/upload/v1770072891/ChatGPT_Image_2_f%C3%A9vr._2026_23_43_44_edeg9a.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
