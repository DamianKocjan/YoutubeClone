import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuthState } from '../../auth';

import { Button } from '@material-ui/core';
import { ThumbDown, ThumbUp } from '@material-ui/icons';

import { useUserVideoRatings } from '../../hooks';
import axiosInstance from '../../utils/axiosInstance';

interface Props {
  video: string;
  likesCount: number;
  dislikesCount: number;
}

interface IVideoRating {
  id: string;
  video: string;
  user: string;
  is_liking: boolean;
}

const VideoRatingButtons: React.FC<Props> = ({
  video,
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
  const { status, data, error } = useUserVideoRatings(user.id);

  useEffect(() => {
    if (data) {
      data.forEach((rating: IVideoRating) => {
        if (rating.video === video) setIsLiking(rating.is_liking);
      });
    }
  }, [data]);

  const likingMutation = useMutation(
    async () =>
      await axiosInstance.post('/video-ratings/', {
        video: video,
        user: user.id,
        is_liking: true,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user_video_ratings', user.id]);
        setIsLiking(true);
      },
    }
  );
  const dislikingMutation = useMutation(
    async () =>
      await axiosInstance.post('/video-ratings/', {
        video: video,
        user: user.id,
        is_liking: false,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user_video_ratings', user.id]);
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

export default VideoRatingButtons;
