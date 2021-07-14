import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { Card } from '../../components/Card';
import { DowndootButton } from '../../components/DowndootButton';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { PostError } from '../../components/PostError';
import { UpdootButton } from '../../components/UpdootButton';
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
      <Card>
        <Flex>
          <Stack maxW='70%' spacing='0px' mb='10px'>
            <Heading mt={'auto'} fontSize='xl'>
              {data.post.title}
            </Heading>
            <Text fontSize='xs' as='i'>
              posted by {data.post.creator.username} on&nbsp;
              {format(new Date(parseInt(data.post.createdAt)), 'dd/MM/yy')}
            </Text>
            <Text fontSize='xs' as='i'>
              last updated on&nbsp;
              {format(new Date(parseInt(data.post.updatedAt)), 'dd/MM/yy')}
            </Text>
          </Stack>
          <Spacer />
          <Flex wrap={'wrap'} justifyContent={'flex-end'}>
            <Flex mr={2}>
              <UpdootButton post={data.post} />
            </Flex>
            <Flex mr={0}>
              <DowndootButton post={data.post} />
            </Flex>
            {meData?.me?.id !== data.post.creator.id ? null : (
              <Flex ml={2}>
                <EditDeletePostButtons id={data.post.id} />
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex>
          <Textarea
            border={0}
            px={0}
            focusBorderColor={'none'}
            isReadOnly
            minH='unset'
            overflow='hidden'
            w='100%'
            resize='none'
            minRows={1}
            as={ResizeTextarea}
          >
            {data.post.text}
          </Textarea>
        </Flex>
      </Card>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
