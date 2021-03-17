import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuthState } from '../../auth';

import { Button } from '@material-ui/core';
import { ThumbUp, ThumbDown } from '@material-ui/icons';

import { useUserCommentRatings } from '../../hooks';
import axiosInstance from '../../utils/axiosInstance';

interface Props {
  comment: string;
  likesCount: number;
  dislikesCount: number;
}

interface ICommentRating {
  id: string;
  comment: string;
  user: string;
  is_liking: boolean;
}

const CommentRatingButtons: React.FC<Props> = ({
  comment,
  likesCount,
  dislikesCount,
}: Props) => {
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
  const { status, data, error } = useUserCommentRatings(user.id);

  useEffect(() => {
    if (data) {
      data.forEach((rating: ICommentRating) => {
        if (rating.comment === comment) setIsLiking(rating.is_liking);
      });
    }
  }, [data]);

  const likingMutation = useMutation(
    () =>
      axiosInstance.post('/comment-rating/', {
        comment: comment,
        user: user.id,
        is_liking: true,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user_comment_ratings', user.id]);
        setIsLiking(true);
      },
    }
  );
  const dislikingMutation = useMutation(
    () =>
      axiosInstance.post('/comment-rating/', {
        comment: comment,
        user: user.id,
        is_liking: false,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user_comment_ratings', user.id]);
        setIsLiking(false);
      },
    }
  );

  const handleLiking = () => {
    likingMutation.mutate();
  };

  const handleDisliking = () => {
    dislikingMutation.mutate();
  };

  return (
    <>
      {status === 'loading' ? (
        <div>loading...</div>
      ) : status === 'error' ? (
        <div>{error.message}</div>
      ) : (
        <>
          <Button
            startIcon={<ThumbUp />}
            onClick={() => {
              if (isLiking === false || isLiking === null) {
                handleLiking();
              }
            }}
            color={isLiking ? 'primary' : 'default'}
          >
            {likesCount}
          </Button>
          <Button
            startIcon={<ThumbDown />}
            onClick={() => {
              if (isLiking === true || isLiking === null) {
                handleDisliking();
              }
            }}
            color={!isLiking && isLiking !== null ? 'primary' : 'default'}
          >
            {dislikesCount}
          </Button>
        </>
      )}
    </>
  );
};

export default CommentRatingButtons;
