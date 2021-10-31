import { QueryClient } from 'react-query';
import { defaultQueryFn } from './request';

export * from './cookies';
export * from './request';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});
