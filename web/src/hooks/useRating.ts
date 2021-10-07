import { useQuery } from 'react-query';
import { api } from '../api';

export function useUserVideoRatings(user = ''): any {
  return useQuery(['user_video_ratings', user], async () => {
    const { data } = await api.get('/video-ratings/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}

export function useUserCommentRatings(user = ''): any {
  return useQuery(['user_comment_ratings', user], async () => {
    const { data } = await api.get('/comment-ratings/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}

export function useUserReplyCommentRatings(user = ''): any {
  return useQuery(['user_reply_comment_ratings', user], async () => {
    const { data } = await api.get('/reply-comment-ratings/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}
