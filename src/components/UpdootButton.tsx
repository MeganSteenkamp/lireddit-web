import { IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import { updateAfterVote } from '../utils/updateAfterVote';

interface UpdootButtonProps {
  post: PostSnippetFragment;
}

export const UpdootButton: React.FC<UpdootButtonProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [vote] = useVoteMutation();

  return (
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
      rounded='md'
      m={0}
    />
  );
};
