import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';

import axiosInstance from './utils/axiosInstance';
import Layout from './components/Layout';

import Home from './views/Home';
import Login from './views/Login';
import NotFound from './views/NotFound';
import Playlist from './views/Playlist';
import Search from './views/Search';
import SignUp from './views/SignUp';
import VideoCreate from './views/VideoCreate';
import VideoWatch from './views/VideoWatch';
import Channel from './views/channel';

import { AuthProvider, useAuthState } from './auth';

const App: React.FC = () => {
  const { isLogged, accessToken } = useAuthState();

  useEffect(() => {
    if (accessToken)
      axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
    else axiosInstance.defaults.headers.Authorization = '';
  }, [isLogged]);

  return (
    <AuthProvider>
      <Layout>
        <>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/video/create" component={VideoCreate} />
            <Route exact path="/watch" component={VideoWatch} />
            <Route exact path="/playlist/:id" component={Playlist} />
            <Route path="/channel/:id" component={Channel} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route path="*" component={NotFound} />
          </Switch>
          <ReactQueryDevtools />
        </>
      </Layout>
    </AuthProvider>
  );
};

export default App;
