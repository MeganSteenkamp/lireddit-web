import { Wrapper, WrapperVariant } from './Wrapper';

import React from 'react';
import { NavBar } from './NavBar';
import Head from 'next/head';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <NavBar />
      <Wrapper children={children}></Wrapper>
    </>
  );
};
