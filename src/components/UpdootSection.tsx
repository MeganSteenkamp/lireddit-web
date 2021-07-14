import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import { updateAfterVote } from '../utils/updateAfterVote';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [vote] = useVoteMutation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='center'>
      <IconButton
        onClick={async () => {
          setLoadingState('updoot-loading');
          await vote({
            variables: { value: 1, postId: post.id },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState('not-loading');
        }}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        isLoading={loadingState === 'updoot-loading'}
        aria-label='updoot post'
        icon={<FaThumbsUp />}
        mb={2}
        rounded='md'
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setLoadingState('downdoot-loading');
          await vote({
            variables: { value: -1, postId: post.id },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState('not-loading');
        }}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        isLoading={loadingState === 'downdoot-loading'}
        aria-label='downdoot post'
        icon={<FaThumbsDown />}
        mt={2}
        rounded='md'
      />
    </Flex>
  );
};
