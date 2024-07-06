import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Theme } from '@radix-ui/themes';
import { Inter } from "next/font/google";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/layout";
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      
      <main className={`${roboto.className} `}>
      <Theme>
        <Layout>
        <Component className="" {...pageProps} />
        </Layout>
        </Theme>  
      </main>
      
      
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
