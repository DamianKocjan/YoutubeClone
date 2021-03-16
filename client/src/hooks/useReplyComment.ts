import { useQuery, UseQueryResult } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

const getVideoReplyCommentsById = async (id: string) => {
  const { data } = await axiosInstance.get(`reply-comments/?comment=${id}`);
  return data.results;
};

export function useVideoReplyComments(commentId: string): any {
  return useQuery(['video_reply_comments', commentId], () =>
    getVideoReplyCommentsById(commentId)
  );
}

const getVideoReplyCommentById = async (id: string) => {
  const { data } = await axiosInstance.get(`reply-comments/${id}`);
  return data;
};

export function useVideoReplyComment(replyCommentId: string): any {
  return useQuery(
    ['video_reply_comment', replyCommentId],
    () => getVideoReplyCommentById(replyCommentId),
    {
      enabled: !!replyCommentId,
    }
  );
}
