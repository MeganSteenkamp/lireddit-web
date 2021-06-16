import { Layout } from '../components/Layout';
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>your query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex align='center'>
        <Heading>LiReddit</Heading>
        <NextLink href='/create-post'>
          <Button
            ml='auto'
            colorScheme='pink'
            variant='solid'
            rightIcon={<ArrowForwardIcon />}
          >
            create post
          </Button>
        </NextLink>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (
            <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
              <Heading fontSize='xl' isTruncated>
                {p.title}
              </Heading>
              <Text fontSize='xs' as='i'>
                posted by {p.creator.username}
              </Text>
              <Text mt={4} noOfLines={3}>
                {p.text}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching} // broken :(
            colorScheme='blackAlpha'
            m='auto'
            my={4}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
