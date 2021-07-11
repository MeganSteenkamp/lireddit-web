import { Box, Heading, HStack, Spacer } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { PostError } from '../../components/PostError';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { useMeQuery } from '../../generated/graphql';

export const Post = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();
  const [{ data: meData }] = useMeQuery();

  if (fetching) {
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
      <HStack>
        <Heading mb={4}>{data.post.title}</Heading>
        {meData?.me?.id !== data.post.creator.id ? null : (
          <>
            <Spacer />
            <EditDeletePostButtons id={data.post.id} />
          </>
        )}
      </HStack>
      <Box mt={4}>{data?.post?.text}</Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
