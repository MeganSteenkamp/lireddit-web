import { Box, Heading, HStack, Spacer } from '@chakra-ui/react';
import React from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { PostError } from '../../components/PostError';
import { useMeQuery } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

export const Post = ({}) => {
  const { data, loading } = useGetPostFromUrl();
  const { data: meData } = useMeQuery();

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

export default withApollo({ ssr: true })(Post);
