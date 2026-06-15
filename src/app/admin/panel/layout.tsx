import type { Metadata } from "next";
import "./globals.css"; // <-- Ini kunci utama agar halaman utama dan login tidak polos

export const metadata: Metadata = {
  title: "Portal E-Voting OSIS",
  description: "Aplikasi E-Voting OSIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}