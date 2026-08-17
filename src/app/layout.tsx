import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskFlow — Premium Task Management",
  description: "A premium Kanban task board for modern teams",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full" style={{ overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
