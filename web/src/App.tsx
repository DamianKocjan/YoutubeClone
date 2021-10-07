import React, { Suspense, useEffect } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

import Layout from './components/Layout';

import { useAuthState } from './auth';
import { api } from './api/request';
import IndexRouter from './routes';
import IndexProviders from './providers';

const App: React.FC = () => {
  const { isLogged, accessToken } = useAuthState();

  useEffect(() => {
    if (accessToken)
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;
    else api.defaults.headers.Authorization = '';
  }, [isLogged]);

  return (
    <IndexProviders>
      <Layout>
        <>
          <Suspense fallback={() => 'loading...'}>
            <IndexRouter />
          </Suspense>
          {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
        </>
      </Layout>
    </IndexProviders>
  );
};

export default App;
