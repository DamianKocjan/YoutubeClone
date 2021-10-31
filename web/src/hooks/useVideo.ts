import { useQuery } from 'react-query';
import type { UseQueryResult } from 'react-query';
import { api } from '../api';
import { IVideo } from '../types/models';

export function useChannelVideos(
  channel = ''
): UseQueryResult<IVideo[], Error> {
  return useQuery(['channel_videos', channel], async () => {
    const { data } = await api.get('videos/', {
      params: {
        author: channel,
      },
    });
    return data.results;
  });
}

const getVideoById = async (id: string) => {
  const { data } = await api.get(`videos/${id}/`);
  return data;
};

export function useVideo(videoId: string): UseQueryResult<IVideo, Error> {
  return useQuery(['video', videoId], async () => await getVideoById(videoId), {
    enabled: !!videoId,
  });
}
