import { useQuery } from 'react-query';
import type { UseQueryResult } from 'react-query';
import { api } from '../api';
import { IPage, ISubscription } from '../types/models';

export function useSubscriptions(
  user = ''
): UseQueryResult<IPage<ISubscription>, Error> {
  return useQuery(['subscriptions_user', user], async () => {
    const { data } = await api.get('subscriptions/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}
