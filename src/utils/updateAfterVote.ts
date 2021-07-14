import { ApolloCache } from "@apollo/client";
import { gql } from "urql";
import { VoteMutation } from "../generated/graphql";

export const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
  ) => {
    const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: `Post:${postId}`,
      fragment: gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
    });
    if (data) {
      if (data.voteStatus === value) {
        // undoing vote
        const newPoints = (data.points as number) - value;
        cache.writeFragment({
          id: `Post:${postId}`,
          fragment: gql`
            fragment _ on Post {
              points
              voteStatus
            }
          `,
          data: { points: newPoints, voteStatus: null },
        });
      } else {
        // new or changing vote
        const newPoints =
          (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
        cache.writeFragment({
          id: `Post:${postId}`,
          fragment: gql`
            fragment _ on Post {
              points
              voteStatus
            }
          `,
          data: { points: newPoints, voteStatus: value },
        });
      }
    }
  };