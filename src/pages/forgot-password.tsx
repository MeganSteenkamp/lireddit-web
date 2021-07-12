import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant='small'>
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
                If an account with that email exists, you should have received a
                password reset link.
              </AlertDescription>
            </Alert>
          ) : (
            <Form>
              <InputField
                name='email'
                placeholder='email'
                label='Email'
                type='email'
              />
              <Button
                mt={4}
                type='submit'
                colorScheme='teal'
                isLoading={isSubmitting}
              >
                send reset link
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
