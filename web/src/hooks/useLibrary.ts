import { useQuery } from 'react-query';
import type { UseQueryResult } from 'react-query';
import { api } from '../api';
import { ILibrary } from '../types/models';

const getUserLibraryById = async (id: string) => {
  const { data } = await api.get(`libraries/?user=${id}`);
  return data.results[0];
};

export function useUserLibrary(
  userId: string
): UseQueryResult<ILibrary, Error> {
  return useQuery(
    ['library', userId],
    async () => await getUserLibraryById(userId),
    {
      enabled: !!userId,
    }
  );
}
