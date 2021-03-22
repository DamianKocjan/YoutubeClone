import { useQuery, UseQueryResult } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

export function useVideos(searchQuery = ''): any {
  return useQuery(['videos', searchQuery], async () => {
    const { data } = await axiosInstance.get('videos/', {
      params: {
        search: searchQuery,
      },
    });
    return data.results;
  });
}

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

export function useVideosWithExclude(exclude: string): any {
  return useQuery(['videos', exclude], async () => {
    const { data } = await axiosInstance.get('videos/', {
      params: {
        exclude,
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
  return useQuery(['video', videoId], () => getVideoById(videoId), {
    enabled: !!videoId,
  });
}
