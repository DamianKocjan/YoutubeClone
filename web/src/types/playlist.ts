import { IChannel } from './channel';
import { IVideo } from './video';

export interface IPlaylistVideo {
  id: string;
  video: IVideo;
  position: number;
}

export interface IPlaylist {
  id: string;
  title: string;
  author: IChannel;
  description: string;
  status: string;
  videos: IPlaylistVideo[] | any[];
  created_at: string;
  updated_at: string;
}
