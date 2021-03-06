import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import router from 'next/router';
import React from 'react';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreatePost = ({}) => {
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout variant='regular'>
      <Card title='Create post'>
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values) => {
            const { errors } = await createPost({
              variables: { input: values },
              update: (cache) => {
                cache.evict({ fieldName: 'posts:{}' });
              },
            });
            if (!errors) {
              router.push('/');
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
                create post
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
