import { IChannel } from './channel';

export interface ISubscription {
  id: string;
  user: string;
  channel: IChannel;
  created_at: Date | string;
}
