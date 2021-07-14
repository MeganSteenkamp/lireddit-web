import { Box, Button, Center, Flex, Link, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Layout variant='small'>
      <Card title='Sign in'>
        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({
              variables: values,
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: 'Query',
                    me: data?.login.user,
                  },
                });
                cache.evict({ fieldName: 'posts:{}' });
              },
            });
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === 'string') {
                router.push(router.query.next);
              } else {
                // worked
                router.push('/');
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name='usernameOrEmail'
                placeholder=''
                label='Username or email address'
              />
              <Box mt={4}>
                <InputField
                  name='password'
                  placeholder=''
                  label='Password'
                  type='password'
                />
              </Box>
              <Flex mt={2}>
                <NextLink href='/forgot-password'>
                  <Link ml='auto'>forgot password?</Link>
                </NextLink>
              </Flex>
              <Button
                mt={12}
                w='100%'
                type='submit'
                colorScheme='cyan'
                isLoading={isSubmitting}
              >
                Sign in
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
      <Card padding={2}>
        <Center w='100%'>
          <Text>
            New to LiReddit?&nbsp;
            <NextLink href='/register'>
              <Button as={'a'} variant={'link'}>
                Create an account
              </Button>
            </NextLink>
          </Text>
        </Center>
      </Card>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
