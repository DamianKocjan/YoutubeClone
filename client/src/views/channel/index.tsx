import React, { useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import {
  Avatar,
  Container,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Tab,
  Tabs,
  Theme,
} from '@material-ui/core';
import { NotificationsNone, Search } from '@material-ui/icons';

import About from './About';
import Home from './Home';
import Playlists from './Playlists';
import Videos from './Videos';

import { useChannel } from '../../hooks';
import SubscribeButton from '../../components/SubscribeButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    banner: {
      height: 'calc((100vw - 240px) / 6.2 - 1px)',
      width: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    avatarMl: {
      marginLeft: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
    },
    spacing: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const Channel: React.FC = () => {
  const classes = useStyles();

  const { path, url } = useRouteMatch();

  const { id } = useParams<{ id: string }>();
  const { status, data, error } = useChannel(id);

  const [value, setValue] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      {status === 'loading' ? (
        <h1>loading...</h1>
      ) : status === 'error' ? (
        <h1>{error.message}</h1>
      ) : (
        <>
          <div
            className={classes.banner}
            style={{
              backgroundImage: data.background
                ? `url(${data.background})`
                : 'url(https://i.ytimg.com/vi/8GQkEMyMLDI/maxresdefault.jpg)',
            }}
          />
          <Container>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={data.avatar}
                    style={{ width: '80px', height: '80px' }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={data.username}
                  secondary={`${data.subscribers_count} subscribers`}
                  className={classes.avatarMl}
                />
                <ListItemSecondaryAction>
                  <SubscribeButton channel={data.id} />
                  <IconButton>
                    <NotificationsNone />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                  >
                    <Tab label="Home" component={Link} to={`${url}`} />
                    <Tab label="Videos" component={Link} to={`${url}/videos`} />
                    <Tab
                      label="Playlists"
                      component={Link}
                      to={`${url}/playlists`}
                    />
                    <Tab label="Community" disabled />
                    <Tab label="Channels" disabled />
                    <Tab label="About" component={Link} to={`${url}/about`} />
                    <IconButton>
                      <Search />
                    </IconButton>
                  </Tabs>
                </ListItemText>
              </ListItem>
            </List>
            <Switch>
              <Route exact path={path} component={Home} />
              <Route exact path={`${path}/videos`} component={Videos} />
              <Route exact path={`${path}/playlists`} component={Playlists} />
              <Route
                exact
                path={`${path}/about`}
                component={() => (
                  <About
                    description={data.description}
                    joinedDate={data.date_joined}
                    email={data.email}
                    location={data.location}
                  />
                )}
              />
            </Switch>
          </Container>
        </>
      )}
    </div>
  );
};

export default Channel;
