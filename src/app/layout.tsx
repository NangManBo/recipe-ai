import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 요리 추천',
  description:
    '사용자의 재료를 기반으로 요리를 추천하는 PWA 앱입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          href="/icon-192x192.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
