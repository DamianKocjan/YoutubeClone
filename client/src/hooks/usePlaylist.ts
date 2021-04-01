import { useQuery } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

export function usePlaylists(author = ''): any {
  return useQuery(['playlists', author], async () => {
    const { data } = await axiosInstance.get('playlists/', {
      params: {
        author: author,
      },
    });
    return data.results;
  });
}

const getPlaylistById = async (id: string) => {
  const { data } = await axiosInstance.get(`playlists/${id}`);
  return data;
};

export function usePlaylist(id: string): any {
  return useQuery(['playlist', id], () => getPlaylistById(id), {
    enabled: !!id,
  });
}
