import { IChannel } from './channel';

export interface IVideoReplyComment {
  id: string;
  content: string;
  likes_count: number;
  dislikes_count: number;
  comment: string;
  author: IChannel;
  created_at: Date | string;
}
