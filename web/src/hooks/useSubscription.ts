import { useQuery } from 'react-query';
import type { UseQueryResult } from 'react-query';
import { api } from '../api';
import { ISubscription } from '../types/models';

export function useSubscriptions(
  user = ''
): UseQueryResult<ISubscription[], Error> {
  return useQuery(['subscriptions_user', user], async () => {
    const { data } = await api.get('subscriptions/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}
