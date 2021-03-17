import { IChannel } from './channel';

export interface IVideoComment {
  id: string;
  content: string;
  likes_count: number;
  dislikes_count: number;
  created_at: string | string;
  author: IChannel;
}
