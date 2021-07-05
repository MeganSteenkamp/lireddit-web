import {
  ComponentWithAs,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Textarea,
} from '@chakra-ui/react';
import React, { InputHTMLAttributes } from 'react';
import { WarningIcon } from '@chakra-ui/icons';
import { useField } from 'formik';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
}; // want input field component to take any props a regular input field would take

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  let InputOrTextArea = Input;
  if (textarea) {
    InputOrTextArea = Textarea as ComponentWithAs<'input', InputProps>;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextArea
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
        _hover={{
          borderColor: 'gray.600',
        }}
      />
      {error ? (
        <FormErrorMessage>
          <WarningIcon mr={2} />
          {error}
        </FormErrorMessage>
      ) : null}
    </FormControl>
  );
};
