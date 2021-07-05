import { Wrapper, WrapperVariant } from './Wrapper';

import React from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <Wrapper children={children}></Wrapper>
    </>
  );
};
