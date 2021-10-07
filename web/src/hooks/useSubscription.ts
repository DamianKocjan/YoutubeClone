import { useQuery } from 'react-query';
import { api } from '../api';

export function useSubscriptions(user = ''): any {
  return useQuery(['subscriptions_user', user], async () => {
    const { data } = await api.get('subscriptions/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}
