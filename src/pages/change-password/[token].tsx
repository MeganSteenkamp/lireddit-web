import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Link,
  Stack,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { withUrqlClient, NextComponentType } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              // handle differently as there is no token field
              setTokenError(errorMap.token); // pass in error message for token
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Stack spacing={4}>
                <Alert status="error" mt={4} borderRadius={8}>
                  <AlertIcon />
                  <AlertDescription>{tokenError}</AlertDescription>
                </Alert>
                <Alert status="info" borderRadius={8}>
                  <AlertIcon />
                  <NextLink href="/forgot-password">
                    <Link>click here to change password</Link>
                  </NextLink>
                </Alert>
              </Stack>
            ) : null}
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

// syntax due to typing issues
export default withUrqlClient(createUrqlClient)(
  (ChangePassword as unknown) as NextComponentType
);
