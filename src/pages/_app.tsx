import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <style>
          {`
            @font-face {
              font-family: 'GmarketSansMedium';
              src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
              font-weight: normal;
              font-style: normal;
            }
            body {
              font-family: 'GmarketSansMedium', sans-serif;
            }
          `}
        </style>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
