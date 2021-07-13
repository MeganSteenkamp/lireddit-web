import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
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
      <Center
        p={5}
        shadow='md'
        borderWidth='1px'
        rounded='md'
        alignItems={'flex-start'}
        flexDirection={'column'}
      >
        <VStack
          width='100%'
          divider={<StackDivider borderColor='gray.200' />}
          spacing={4}
          align='stretch'
        >
          <Heading mt={4} mb={4}>
            Login
          </Heading>
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
                  placeholder='username or email'
                  label='Username or Email'
                />
                <Box mt={4}>
                  <InputField
                    name='password'
                    placeholder='password'
                    label='Password'
                    type='password'
                  />
                </Box>
                <Flex mt={2}>
                  <NextLink href='/forgot-password'>
                    <Link ml='auto'>forgot password?</Link>
                  </NextLink>
                </Flex>
                <Flex mt={4}>
                  <Button
                    mt={4}
                    ml='auto'
                    type='submit'
                    colorScheme='blue'
                    isLoading={isSubmitting}
                  >
                    login
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </VStack>
      </Center>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
