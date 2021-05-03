import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Link,
  Stack,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import router from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage = () => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            console.log(errorMap);
            if ('user' in errorMap) {
              console.log('user in errorMap');
              setTokenError(errorMap.user); // user doesn't exist
            } else if ('token' in errorMap) {
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
              tokenError.includes('token') ? (
                <Alert status="info" mt={4} borderRadius={8}>
                  <AlertIcon />
                  <NextLink href="/forgot-password">
                    <Link>token has expired. <b>click here</b> to change password</Link>
                  </NextLink>
                </Alert>
              ) : (
                <Alert status="error" mt={4} borderRadius={8}>
                  <AlertIcon />
                  <AlertDescription>{tokenError}</AlertDescription>
                </Alert>
              )
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

export default withUrqlClient(createUrqlClient)(ChangePassword);
