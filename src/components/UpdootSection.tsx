import { Flex, IconButton, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import { updateAfterVote } from '../utils/updateAfterVote';
import { DowndootButton } from './DowndootButton';
import { UpdootButton } from './UpdootButton';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  return (
    <Stack alignItems='center' justifyContent='center'>
      <UpdootButton post={post} />
      <Flex>{post.points}</Flex>
      <DowndootButton post={post} />
    </Stack>
  );
};
