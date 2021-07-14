import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout variant='small'>
      <Card title='Reset your password'>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={async (values) => {
            await forgotPassword({ variables: values });
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <Alert
                status='success'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                height='250px'
                borderRadius={12}
              >
                <AlertIcon boxSize='40px' mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='lg'>
                  Request received
                </AlertTitle>
                <AlertDescription maxWidth='sm'>
                  Thanks for submitting your request.
                  <br />
                  If an account with that email exists, you should have received
                  a password reset link.
                </AlertDescription>
              </Alert>
            ) : (
              <Form>
                <InputField
                  name='email'
                  placeholder=''
                  label="Enter your user account's verified email address and we will send you a password reset link."
                  type='email'
                />
                <Button
                  w='100%'
                  mt={12}
                  type='submit'
                  colorScheme='cyan'
                  isLoading={isSubmitting}
                >
                  Send password reset email
                </Button>
              </Form>
            )
          }
        </Formik>
      </Card>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
