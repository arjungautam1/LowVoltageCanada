import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Low Voltage Canada — Canada, connected.",
    template: "%s | Low Voltage Canada",
  },
  description:
    "An independent lens on Canada's connected industry. Discover the products, people, companies, and ideas shaping AV, security, networking, and smart buildings.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA">
      <body>{children}</body>
    </html>
  );
}
