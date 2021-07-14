import {
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { Card } from '../../components/Card';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { PostError } from '../../components/PostError';
import { useMeQuery, useVoteMutation } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';
import { updateAfterVote } from '../../utils/updateAfterVote';

export const Post = ({}) => {
  const { data, loading } = useGetPostFromUrl();
  const { data: meData } = useMeQuery();
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [vote] = useVoteMutation();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return <PostError />;
  }

  return (
    <Layout>
      <Card>
        <Grid
          templateRows='repeat(3, 1fr)'
          templateColumns='repeat(8 1fr)'
          gap={0}
        >
          <GridItem colSpan={7}>
            <Stack spacing='0px'>
              <Heading mt={'auto'} fontSize='xl' mr={'auto'}>
                {data.post.title}
              </Heading>
              <Text fontSize='xs' as='i'>
                posted by {data.post.creator.username} on&nbsp;
                {format(new Date(parseInt(data.post.createdAt)), 'dd/MM/yy')}
              </Text>
            </Stack>
          </GridItem>
          <GridItem w='100%' colSpan={1}>
            <HStack justify={'flex-end'}>
              <IconButton
                onClick={async () => {
                  setLoadingState('updoot-loading');
                  await vote({
                    variables: { value: 1, postId: data.post!.id },
                    update: (cache) => updateAfterVote(1, data.post!.id, cache),
                  });
                  setLoadingState('not-loading');
                }}
                colorScheme={data.post.voteStatus === 1 ? 'green' : undefined}
                isLoading={loadingState === 'updoot-loading'}
                aria-label='updoot post'
                icon={<FaThumbsUp />}
                rounded='md'
              />
              <IconButton
                onClick={async () => {
                  setLoadingState('downdoot-loading');
                  await vote({
                    variables: { value: -1, postId: data.post!.id },
                    update: (cache) =>
                      updateAfterVote(-1, data.post!.id, cache),
                  });
                  setLoadingState('not-loading');
                }}
                colorScheme={data.post.voteStatus === -1 ? 'red' : undefined}
                isLoading={loadingState === 'downdoot-loading'}
                aria-label='downdoot post'
                icon={<FaThumbsDown />}
                rounded='md'
              />
              {meData?.me?.id !== data.post.creator.id ? null : (
                <EditDeletePostButtons id={data.post.id} />
              )}
            </HStack>
          </GridItem>
          <GridItem colSpan={8} rowSpan={3}>
            <Text mt={4} noOfLines={3}>
              {data.post.text}
            </Text>
          </GridItem>
        </Grid>
      </Card>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
