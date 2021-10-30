import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuthState } from '../../auth';

import { Button } from '@material-ui/core';
import { ThumbDown, ThumbUp } from '@material-ui/icons';

import { useUserReplyCommentRatings } from '../../hooks';
import { api } from '../../api';

interface Props {
  replyComment: string;
  likesCount: number;
  dislikesCount: number;
}

interface IReplyCommentRating {
  id: string;
  reply_comment: string;
  user: string;
  is_liking: boolean;
}

const ReplyCommentRatingButtons: React.FC<Props> = ({
  replyComment,
  likesCount,
  dislikesCount,
}) => {
  const { user, isLogged } = useAuthState();

  const [isLiking, setIsLiking] = useState<boolean | null>(null);

  if (!isLogged)
    return (
      <>
        <Button startIcon={<ThumbUp />}>{likesCount}</Button>
        <Button startIcon={<ThumbDown />}>{dislikesCount}</Button>
      </>
    );

  const queryClient = useQueryClient();
  const { status, data, error } = useUserReplyCommentRatings(user.id);

  useEffect(() => {
    if (data) {
      (data.results as IReplyCommentRating[]).forEach((rating) => {
        if (rating.reply_comment === replyComment)
          setIsLiking(rating.is_liking);
      });
    }
  }, [data]);

  const likingMutation = useMutation(
    async () =>
      await api.post('/reply-comment-ratings/', {
        reply_comment: replyComment,
        user: user.id,
        is_liking: true,
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'user_reply_comment_ratings',
          user.id,
        ]);
        setIsLiking(true);
      },
    }
  );
  const dislikingMutation = useMutation(
    async () =>
      await api.post('/reply-comment-ratings/', {
        reply_comment: replyComment,
        user: user.id,
        is_liking: false,
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'user_reply_comment_ratings',
          user.id,
        ]);
        setIsLiking(false);
      },
    }
  );

  const handleLiking = async () => {
    await likingMutation.mutateAsync();
  };

  const handleDisliking = async () => {
    await dislikingMutation.mutateAsync();
  };

  return (
    <>
      {status === 'loading' ? (
        <div>loading...</div>
      ) : status === 'error' ? (
        <div>{error?.message || error}</div>
      ) : (
        <>
          <Button
            startIcon={<ThumbUp />}
            onClick={() => {
              if (isLiking === false || isLiking === null) {
                handleLiking();
              }
            }}
            color={isLiking ? 'primary' : 'default'}>
            {likesCount}
          </Button>
          <Button
            startIcon={<ThumbDown />}
            onClick={() => {
              if (isLiking === true || isLiking === null) {
                handleDisliking();
              }
            }}
            color={!isLiking && isLiking !== null ? 'primary' : 'default'}>
            {dislikesCount}
          </Button>
        </>
      )}
    </>
  );
};

export default ReplyCommentRatingButtons;
