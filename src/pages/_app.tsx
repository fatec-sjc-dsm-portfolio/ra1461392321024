// pages/_app.tsx
import type { AppProps } from 'next/app';
import import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;