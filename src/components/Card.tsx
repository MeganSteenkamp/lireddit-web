import { Center, VStack, StackDivider, Heading } from '@chakra-ui/react';
import React from 'react';

interface CardProps {
  title?: string;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({ children, title, padding }) => {
  return (
    <Center
      mb={4}
      p={padding ? padding : 8}
      shadow='md'
      borderWidth='1px'
      rounded='md'
      alignItems={'flex-start'}
      flexDirection={'column'}
    >
      <VStack
        width='100%'
        divider={<StackDivider borderColor='gray.200' />}
        spacing={4}
        align='stretch'
      >
        {!title ? null : (
          <Heading mt={4} mb={4}>
            {title}
          </Heading>
        )}
        {children}
      </VStack>
    </Center>
  );
};
