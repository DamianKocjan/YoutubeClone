import { useQuery } from 'react-query';
import type { UseQueryResult } from 'react-query';

import { request } from '../api';
import { IChannel } from '../types/models';

const getChannelById = async (id: string) => {
  const { data } = await request<IChannel>('GET', `users/${id}`);
  return data;
};

export function useChannel(channelId: string): UseQueryResult<IChannel, Error> {
  return useQuery(
    ['channel', channelId],
    async () => await getChannelById(channelId),
    {
      enabled: !!channelId,
    }
  );
}
