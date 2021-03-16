import { useQuery, UseQueryResult } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

export function useVideoComments(videoId: string): any {
  return useQuery(
    ['video_comments', videoId],
    async () => {
      const { data } = await axiosInstance.get(
        `comments${videoId ? '?video=' + videoId : '/'}`
      );
      return data.results;
    },
    {
      enabled: !!videoId,
    }
  );
}

const getVideoCommentById = async (id: string) => {
  const { data } = await axiosInstance.get(`comments/${id}`);
  return data;
};

export function useVideoComment(commentId: string): any {
  return useQuery(
    ['video_comment', commentId],
    () => getVideoCommentById(commentId),
    {
      enabled: !!commentId,
    }
  );
}
