import { Wrapper, WrapperVariant } from './Wrapper';

import { NavBar } from './NavBar';
import React from 'react';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
