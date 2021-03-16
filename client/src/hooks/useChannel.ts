import { useQuery, UseQueryResult } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

export function useChannels(searchQuery = ''): any {
  return useQuery(['channels', searchQuery], async () => {
    const { data } = await axiosInstance.get('users/', {
      params: {
        search_query: searchQuery,
      },
    });
    return data.results;
  });
}

const getChannelById = async (id: string) => {
  const { data } = await axiosInstance.get(`users/${id}`);
  return data;
};

export function useChannel(channelId: string): any {
  return useQuery(['channel', channelId], () => getChannelById(channelId), {
    enabled: !!channelId,
  });
}
