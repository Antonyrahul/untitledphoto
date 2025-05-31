import Header from "@/components/layout/Header";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Footer from "@/components/layout/Footer";
import { Inter } from "@next/font/google";
import theme from "@/styles/theme";
import { Analytics } from "@vercel/analytics/react";
import DefaultHead from "@/components/layout/DefaultHead";
import Script from "next/script";
import localFont from '@next/font/local'



import "react-medium-image-zoom/dist/styles.css";

const queryClient = new QueryClient();
export const inter = Inter({ subsets: ["latin"] });
declare const window: Window & { dataLayer: Record<string, unknown>[]; };
const myFont = localFont({
  src: './Helvetica.otf',
})

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <>
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-T6D9QZ0NWY" />
    <Script
                id="google-analytics-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                  
                    gtag('config', 'G-T6D9QZ0NWY');
                  
                    `,
                }}
            />
                    <Script
            id="microsoft-clarity-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "r6lw33f4hs");
          
                `,
            }}
        />

    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <DefaultHead />
          <Flex className={myFont.className} flexDirection="column" minH="100vh">
            <Header />
            <Component {...pageProps} />
            <Footer />
            <Analytics />
          </Flex>
        </QueryClientProvider>
      </SessionProvider>
    </ChakraProvider>
    </>
  );
}

export default App;
