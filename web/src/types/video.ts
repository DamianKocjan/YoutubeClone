import { IChannel } from './channel';

export interface IVideo {
  id: string;
  title: string;
  description: string;
  duration: number;
  created_at: string;
  views_count: number;
  thumbnail: string;
  author: IChannel;
}
