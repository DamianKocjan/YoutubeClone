import { IChannel } from './channel';

export interface IPlaylistVideo {
  id: string;
  title: string;
  description: string;
  duration: number;
  created_at: Date | string;
  views_count: number;
  thumbnail: string;
  author: IChannel;
  position: string;
}

export interface IPlaylist {
  id: string;
  title: string;
  author: IChannel;
  description: string;
  videos: IPlaylistVideo[] | any[];
  created_at: string;
  updated_at: string;
}
