import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import router, { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useDeletePostMutation } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
}) => {
  const router = useRouter();
  const [deletePost] = useDeletePostMutation();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  return (
    <>
      <Flex>
        <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`} passHref>
          <IconButton
            as={Link}
            rounded='md'
            aria-label='edit post'
            icon={<EditIcon />}
            mr={2}
          ></IconButton>
        </NextLink>
        <IconButton
          rounded='md'
          onClick={() => {
            setIsOpen(true);
          }}
          aria-label='delete post'
          icon={<DeleteIcon />}
        ></IconButton>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Post
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  deletePost({
                    variables: { id },
                    update: (cache) => {
                      cache.evict({ id: `Post:${id}` });
                    },
                  });
                  if (router.pathname !== '/') {
                    router.push('/');
                  }
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
