import { Box, Center, Heading, Text, Spacer, Button } from '@chakra-ui/react';
import React from 'react';
import { Layout } from './Layout';
import NextLink from 'next/link';

export const PostError = ({}) => {
  return (
    <>
      <Layout>
        <Box ml={8} mr={8}>
          <Center h='400px'>
            <Box spa alignItems='center' alignContent='center'>
              <Heading mb={4}>404 | Not Found</Heading>
              <Spacer />
              <Text mb={8} fontSize='2xl'>
                We are unable to locate this post.
              </Text>
              <NextLink href='/'>
                <Button colorScheme='pink' size='lg'>
                  Back to Home
                </Button>
              </NextLink>
            </Box>
          </Center>
        </Box>
      </Layout>
    </>
  );
};
