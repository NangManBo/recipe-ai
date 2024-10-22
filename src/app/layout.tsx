import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 요리 추천',
  description:
    '주재료와 난이도를 입력하면 AI가 요리 레시피를 추천해줍니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <title>AI 요리 추천</title>
        <meta
          name="description"
          content="주재료와 난이도를 입력하면 AI가 요리 레시피를 추천해줍니다."
        />
        <link
          rel="icon"
          href="/icon-192x192.png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href="/icon-192x192.png"
        />
        <link
          rel="icon"
          href="/icon-512x512.png"
          sizes="512x512"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
