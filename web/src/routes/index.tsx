import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('../views/Home'));
const Login = lazy(() => import('../views/Login'));
const NotFound = lazy(() => import('../views/NotFound'));
const Playlist = lazy(() => import('../views/Playlist'));
const Search = lazy(() => import('../views/Search'));
const SignUp = lazy(() => import('../views/SignUp'));
const VideoCreate = lazy(() => import('../views/video/Create'));
const VideoWatch = lazy(() => import('../views/video/Watch'));
const Channel = lazy(() => import('../views/channel'));

const IndexRouter: React.FC = () => {
  return (
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
  );
};

export default IndexRouter;
