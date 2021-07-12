import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data: meData } = useMeQuery();
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
  });

  if (!loading && !data) {
    if (error) {
      return <div>{error}</div>;
    }
    return <div>your query failed for some reason</div>;
  }

  return (
    <Layout>
      {loading && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow='md' borderWidth='1px' rounded='md'>
                <Box mr={6}>
                  <UpdootSection post={p} />
                </Box>
                <Box flex={1}>
                  <HStack direction={'row'} flex={1}>
                    <Box>
                      <Heading fontSize='xl' isTruncated mr={'auto'}>
                        <NextLink
                          href='/post/[id]'
                          as={`/post/${p.id}`}
                          passHref
                        >
                          <Link>{p.title}</Link>
                        </NextLink>
                      </Heading>
                    </Box>
                    {meData?.me?.id !== p.creator.id ? null : (
                      <>
                        <Spacer />
                        <EditDeletePostButtons id={p.id} />
                      </>
                    )}
                  </HStack>
                  <Text fontSize='xs' as='i'>
                    posted by {p.creator.username}
                  </Text>
                  <Text mt={4} noOfLines={3}>
                    {p.text}
                  </Text>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
            isLoading={loading} // broken :(
            colorScheme='pink'
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

export default withApollo({ ssr: true })(Index);
