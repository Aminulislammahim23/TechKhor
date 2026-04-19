import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "TechKhor - Premium Electronics",
  description: "Curated electronics, accessories, and gadget deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
