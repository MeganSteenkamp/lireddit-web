import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { PostError } from '../../../components/PostError';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useRouter } from 'next/router';

export const EditPost = ({}) => {
  const router = useRouter();
  const postId = useGetIntId();
  const [{ data, fetching }] = useGetPostFromUrl();
  const [, updatePost] = useUpdatePostMutation();

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
    <Layout variant='small'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          const { error } = await updatePost({
            id: postId,
            title: values.title,
            text: values.text,
          });
          if (!error) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' placeholder='title' label='Title' />
            <Box mt={4}>
              <InputField
                textarea
                name='text'
                placeholder='text...'
                label='Body'
                type=''
              />
            </Box>
            <Button
              mt={4}
              type='submit'
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
