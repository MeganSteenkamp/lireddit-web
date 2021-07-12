import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import {
  PostSnippetFragment,
  useDeletePostMutation,
} from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
}) => {
  const [deletePost] = useDeletePostMutation();

  return (
    <>
      <Box>
        <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`} passHref>
          <IconButton
            as={Link}
            rounded='md'
            aria-label='edit post'
            icon={<EditIcon />}
            mr={2}
          ></IconButton>
        </NextLink>
      </Box>
      <Box>
        <IconButton
          rounded='md'
          onClick={() => {
            deletePost({
              variables: { id },
              update: (cache) => {
                cache.evict({ id: `Post:${id}` });
              },
            });
          }}
          aria-label='delete post'
          icon={<DeleteIcon />}
        ></IconButton>
      </Box>
    </>
  );
};
