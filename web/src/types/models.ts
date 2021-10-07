export interface IChannel {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  subscribers_count: number;
  background: string;
  date_joined: string;
  description: string;
  location: string;
}

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

export interface ISubscription {
  id: string;
  user: string;
  channel: IChannel;
  created_at: string;
}

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

export interface IVideoComment {
  id: string;
  content: string;
  likes_count: number;
  dislikes_count: number;
  created_at: string | string;
  author: IChannel;
}

export interface IVideoReplyComment {
  id: string;
  content: string;
  likes_count: number;
  dislikes_count: number;
  comment: string;
  author: IChannel;
  created_at: string;
}
