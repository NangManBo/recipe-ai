import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development', // 개발 모드에서는 PWA 비활성화
  skipWaiting: true,
});

export default withPWA({
  reactStrictMode: true,
});
