import { useQuery, UseQueryResult } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

export function useUserVideoRatings(user = ''): any {
  return useQuery(['user_video_ratings', user], async () => {
    const { data } = await axiosInstance.get('/video-rating/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}

export function useUserCommentRatings(user = ''): any {
  return useQuery(['user_comment_ratings', user], async () => {
    const { data } = await axiosInstance.get('/comment-rating/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}

export function useUserReplyCommentRatings(user = ''): any {
  return useQuery(['user_reply_comment_ratings', user], async () => {
    const { data } = await axiosInstance.get('/reply-comment-rating/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}
