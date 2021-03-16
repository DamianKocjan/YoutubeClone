import { IChannel } from './channel';

export interface IVideoComment {
  id: string;
  content: string;
  created_at: string | string;
  author: IChannel;
}
