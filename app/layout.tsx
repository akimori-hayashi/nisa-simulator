import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "つみたてNISA 複利シミュレーター",
  description:
    "毎月の積立金額・利回り・期間を入力して、つみたてNISAの複利効果をシミュレーション。非課税メリットもわかりやすく表示します。",
  openGraph: {
    title: "つみたてNISA 複利シミュレーター",
    description:
      "毎月の積立金額・利回り・期間を入力して、つみたてNISAの複利効果をシミュレーション。非課税メリットもわかりやすく表示します。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "つみたてNISA 複利シミュレーター",
    description:
      "毎月の積立金額・利回り・期間を入力して、つみたてNISAの複利効果をシミュレーション。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
