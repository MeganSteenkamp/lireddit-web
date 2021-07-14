import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { Card } from '../../../components/Card';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { PostError } from '../../../components/PostError';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { withApollo } from '../../../utils/withApollo';

export const EditPost = ({}) => {
  const router = useRouter();
  const postId = useGetIntId();
  const { data, loading } = useGetPostFromUrl();
  const [updatePost] = useUpdatePostMutation();

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
    <Layout variant='regular'>
      <Card title='Edit post'>
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={async (values) => {
            const { errors } = await updatePost({
              variables: {
                id: postId,
                title: values.title,
                text: values.text,
              },
            });
            if (!errors) {
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
                colorScheme='cyan'
                isLoading={isSubmitting}
              >
                Update post
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
