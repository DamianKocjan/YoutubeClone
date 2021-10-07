import { useQuery } from 'react-query';
import { api } from '../api';

export function usePlaylists(author = ''): any {
  return useQuery(['playlists', author], async () => {
    const { data } = await api.get('playlists/', {
      params: {
        author: author,
      },
    });
    return data.results;
  });
}

const getPlaylistById = async (id: string) => {
  const { data } = await api.get(`playlists/${id}`);
  return data;
};

export function usePlaylist(id: string): any {
  return useQuery(['playlist', id], async () => await getPlaylistById(id), {
    enabled: !!id,
  });
}
