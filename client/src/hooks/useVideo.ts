import { useQuery } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

export function useChannelVideos(channel = ''): any {
  return useQuery(['channel_videos', channel], async () => {
    const { data } = await axiosInstance.get('videos/', {
      params: {
        author: channel,
      },
    });
    return data.results;
  });
}

const getVideoById = async (id: string) => {
  const { data } = await axiosInstance.get(`videos/${id}`);
  return data;
};

export function useVideo(videoId: string): any {
  return useQuery(['video', videoId], async () => await getVideoById(videoId), {
    enabled: !!videoId,
  });
}
