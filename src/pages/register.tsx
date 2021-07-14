import { Box, Button, Center, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';
import NextLink from 'next/link';

const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Layout variant='small'>
      <Card title='Sign up'>
        <Formik
          initialValues={{ email: '', username: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              variables: { options: values },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: 'Query',
                    me: data?.register.user,
                  },
                });
              },
            });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name='username' placeholder='' label='Username' />
              <Box mt={4}>
                <InputField
                  name='email'
                  placeholder=''
                  label='Email'
                  type='email'
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name='password'
                  placeholder='must have at least 3 characters'
                  label='Password'
                  type='password'
                />
              </Box>
              <Button
                mt={12}
                type='submit'
                w='100%'
                colorScheme='cyan'
                isLoading={isSubmitting}
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
      <Card padding={2}>
        <Center w='100%'>
          <Text>
            Already have an account?&nbsp;
            <NextLink href='/login'>
              <Button as={'a'} variant={'link'}>
                Sign in
              </Button>
            </NextLink>
          </Text>
        </Center>
      </Card>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Register);
