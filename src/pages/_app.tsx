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
              font-family: 'Pretendard-Regular';
              src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
              font-weight: 400;
              font-style: normal;
            }
            body {
              font-family: 'Pretendard-Regular', sans-serif;
            }
          `}
        </style>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
