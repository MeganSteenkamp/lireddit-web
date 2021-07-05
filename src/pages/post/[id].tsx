import { Box, Button, Center, Heading, Spacer, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

export const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1, // invalid post id
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
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
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
