import { IChannel } from './channel';

export interface IVideoReplyComment {
  id: string;
  content: string;
  comment: string;
  author: IChannel;
  created_at: Date | string;
}
