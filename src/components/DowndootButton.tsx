import { IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaThumbsDown } from 'react-icons/fa';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import { updateAfterVote } from '../utils/updateAfterVote';

interface DowndootButtonProps {
  post: PostSnippetFragment;
}

export const DowndootButton: React.FC<DowndootButtonProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [vote] = useVoteMutation();

  return (
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
      rounded='md'
      m={0}
    />
  );
};
