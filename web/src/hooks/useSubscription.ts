import { useQuery } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

export function useSubscriptions(user = ''): any {
  return useQuery(['subscriptions_user', user], async () => {
    const { data } = await axiosInstance.get('subscriptions/', {
      params: {
        user: user,
      },
    });
    return data.results;
  });
}
