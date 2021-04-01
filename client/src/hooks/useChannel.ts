import { useQuery } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

const getChannelById = async (id: string) => {
  const { data } = await axiosInstance.get(`users/${id}`);
  return data;
};

export function useChannel(channelId: string): any {
  return useQuery(['channel', channelId], () => getChannelById(channelId), {
    enabled: !!channelId,
  });
}
