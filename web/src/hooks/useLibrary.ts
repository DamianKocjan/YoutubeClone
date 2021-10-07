import { useQuery } from 'react-query';
import { api } from '../api';

const getUserLibraryById = async (id: string) => {
  const { data } = await api.get(`libraries/?user=${id}`);
  return data.results[0];
};

export function useUserLibrary(userId: string): any {
  return useQuery(
    ['library', userId],
    async () => await getUserLibraryById(userId),
    {
      enabled: !!userId,
    }
  );
}
