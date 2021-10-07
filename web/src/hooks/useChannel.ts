import { useQuery } from 'react-query';

import { request } from '../api';
import { IChannel } from '../types/models';

const getChannelById = async (id: string) => {
  const { data } = await request<IChannel>('GET', `users/${id}`);
  return data;
};

export function useChannel(channelId: string): any {
  return useQuery(
    ['channel', channelId],
    async () => await getChannelById(channelId),
    {
      enabled: !!channelId,
    }
  );
}
