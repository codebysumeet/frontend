import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krishi Clinic Lite",
  description: "Crop disease advisory dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-leaf-100 bg-white">
            <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
              <Link href="/" className="font-semibold text-leaf-700">
                Krishi Clinic <span className="text-soil-500">Lite</span>
              </Link>
              <div className="flex gap-4 text-sm">
                <Link href="/" className="hover:text-leaf-600">
                  Upload
                </Link>
                <Link href="/history" className="hover:text-leaf-600">
                  History
                </Link>
                <Link href="/analytics" className="hover:text-leaf-600">
                  Analytics
                </Link>
              </div>
            </nav>
          </header>
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
