export interface IChannel {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  subscribers_count: number;
  // background: string;
  date_joined: Date | string;
  description: string;
  location: string;
}
