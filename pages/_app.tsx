import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';

import Footer from 'components/Footer';
import { GlobalStyle } from 'components/GlobalStyles';
import Navbar from 'components/Navbar';
import NavigationDrawer from 'components/NavigationDrawer';
import NewsletterModal from 'components/NewsletterModal';
import WaveCta from 'components/WaveCta';
import { ColorModeProvider, ColorModeScript } from 'components/ColorMode';
import { NewsletterModalContextProvider, useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { NavItems } from 'types';

const navItems: NavItems = [
  { title: 'Awesome SaaS Features', href: '/features' },
  { title: 'Pricing', href: '/pricing' },
  { title: 'Contact', href: '/contact' },
  { title: 'Sign up', href: '/sign-up', outlined: true },
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <GlobalStyle />

      <ColorModeProvider>
        <Providers>
          <Modals />
          <Navbar items={navItems} />
          <Component {...pageProps} />
          <WaveCta />
          <Footer />
        </Providers>
      </ColorModeProvider>
    </>
  );
}

function Providers({ children }: PropsWithChildren) {
  return (
    <NewsletterModalContextProvider>
      <NavigationDrawer items={navItems}>{children}</NavigationDrawer>
    </NewsletterModalContextProvider>
  );
}

function Modals() {
  const { isModalOpened, setIsModalOpened } = useNewsletterModalContext();
  if (!isModalOpened) {
    return null;
  }
  return <NewsletterModal onClose={() => setIsModalOpened(false)} />;
}

export default MyApp;
