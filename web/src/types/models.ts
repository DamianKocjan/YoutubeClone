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
  videos: IPlaylistVideo[];
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface ILibrary {
  id: string;
  user: string;
  playlists: IPlaylist[];
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
  video: string; // URL
  duration: number;
  created_at: string;
  views_count: number;
  thumbnail: string;
  author: IChannel;
  likes_count: number;
  dislikes_count: number;
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

export interface IRating {
  id: string;
  is_liking: boolean;
  user: string;
  created_at: string;
  updated_at: string;

  // if we search video ratings video (video id) will be in API response
  video?: string;
  comment?: string;
  reply_comment?: string;
}

export interface IPage<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
