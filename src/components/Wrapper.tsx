import { Box, Container } from '@chakra-ui/react';
import React from 'react';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  return (
    <Container
      mt={8}
      mx='auto'
      maxW={variant === 'regular' ? 'container.md' : 'container.xl'}
      w='100%'
      py={{ base: 2 }}
      px={{ base: 4 }}
    >
      {children}
    </Container>
  );
};
