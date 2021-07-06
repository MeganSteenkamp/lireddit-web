import { Layout } from '../components/Layout';
import {
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Spacer,
  LinkBox,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery, useDeletePostMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { UpdootSection } from '../components/UpdootSection';
import NextLink from 'next/link';
import { DeleteIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>your query failed for some reason</div>;
  }

  return (
    <Layout>
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <LinkBox key={p.id}>
                <Flex
                  p={5}
                  shadow='md'
                  borderWidth='1px'
                  rounded='md'
                >
                  <Box mr={6}>
                    <UpdootSection post={p} />
                  </Box>
                  <Box>
                    <Heading fontSize='xl' isTruncated>
                      <NextLink href='/post/[id]' as={`/post/${p.id}`} passHref>
                        <Link>{p.title}</Link>
                      </NextLink>
                    </Heading>
                    <Text fontSize='xs' as='i'>
                      posted by {p.creator.username}
                    </Text>
                    <Text mt={4} noOfLines={3}>
                      {p.text}
                    </Text>
                  </Box>
                  <Spacer />
                  <Box>
                    <IconButton
                      ml={6}
                      onClick={() => {
                        deletePost({ id: p.id });
                      }}
                      aria-label='delete post'
                      icon={<DeleteIcon />}
                    ></IconButton>
                  </Box>
                </Flex>
              </LinkBox>
            )
          )}
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
