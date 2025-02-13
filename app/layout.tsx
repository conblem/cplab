import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { auth } from "@/auth";
import React from "react";
import { GeistSans } from "geist/font/sans"; // import font

export const metadata: Metadata = {
  title: "Image Categorizer",
  description: "CPLAB Project",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) {
    return <></>;
  }
  return (
    <html lang="en" className="w-screen h-screen">
      <body className={`${GeistSans.className} antialiased w-screen h-screen`}>
        <Navigation username={session.user?.name}>{children}</Navigation>
      </body>
    </html>
  );
}
