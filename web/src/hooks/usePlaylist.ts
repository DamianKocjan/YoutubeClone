import { useQuery } from 'react-query';
import type { UseQueryResult } from 'react-query';
import { api } from '../api';
import { IPage, IPlaylist } from '../types/models';

export function usePlaylists(
  author = ''
): UseQueryResult<IPage<IPlaylist>, Error> {
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

export function usePlaylist(id: string): UseQueryResult<IPlaylist, Error> {
  return useQuery(['playlist', id], async () => await getPlaylistById(id), {
    enabled: !!id,
  });
}
