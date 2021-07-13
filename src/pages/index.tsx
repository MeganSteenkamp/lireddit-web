import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack,
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
              <Grid
                key={p.id}
                p={5}
                shadow='md'
                borderWidth='1px'
                rounded='md'
                templateRows='repeat(3, 1fr)'
                templateColumns='repeat(10, 1fr)'
                gap={0}
              >
                <GridItem rowSpan={3} colSpan={1}>
                  <Flex h='100%' w='100%' mr={4}>
                    <UpdootSection post={p} />
                  </Flex>
                </GridItem>
                <GridItem colSpan={8}>
                  <Stack spacing='0px'>
                    <NextLink href='/post/[id]' as={`/post/${p.id}`} passHref>
                      <Link>
                        <Heading
                          mt={'auto'}
                          fontSize='xl'
                          isTruncated
                          mr={'auto'}
                        >
                          {p.title}
                        </Heading>
                      </Link>
                    </NextLink>
                    <Text fontSize='xs' as='i' isTruncated>
                      posted by {p.creator.username}
                    </Text>
                  </Stack>
                </GridItem>
                <GridItem colSpan={1}>
                  {meData?.me?.id !== p.creator.id ? null : (
                    <EditDeletePostButtons id={p.id} />
                  )}
                </GridItem>
                <GridItem colSpan={9} rowSpan={2}>
                  <Text mt={4} noOfLines={3}>
                    {p.text}
                  </Text>
                </GridItem>
              </Grid>
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
            colorScheme={'cyan'}
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
