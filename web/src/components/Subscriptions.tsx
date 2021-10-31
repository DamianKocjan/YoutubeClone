/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import type { IChannel } from '../types/models';
import { useSubscriptions } from '../hooks';

interface Props {
  isLogged: boolean;
  user: IChannel;
  isOpen: boolean;
}

const Subscriptions: React.FC<Props> = ({ isLogged, user, isOpen }) => {
  const { status, data, error } = useSubscriptions(user.id);
  const [showMoreSubs, setShowMoreSubs] = useState(false);

  return (
    <>
      {isOpen && isLogged && (
        <>
          <Divider />
          {status === 'loading' ? (
            <List>
              <div>
                <ListItem button disabled>
                  <ListItemAvatar>
                    <></>
                  </ListItemAvatar>
                  <ListItemText primary="loading..." />
                </ListItem>
              </div>
            </List>
          ) : status === 'error' ? (
            <List>
              <div>
                <ListItem button disabled>
                  <ListItemAvatar>
                    <></>
                  </ListItemAvatar>
                  <ListItemText primary={error?.message || error} />
                </ListItem>
              </div>
            </List>
          ) : data && data.length > 0 ? (
            <List>
              <div>
                <ListSubheader color="inherit">Subscriptions</ListSubheader>
                {showMoreSubs
                  ? data.map(({ id, channel }) => (
                    <ListItem
                      key={id}
                      button
                      component={Link}
                      to={`/channel/${channel.id}`}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={channel.avatar}
                          imgProps={{ loading: 'lazy' }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={channel.username} />
                    </ListItem>
                  ))
                  : data.length > 7 && data.slice(0, 8).map(({ id, channel }) => (
                    <ListItem
                      key={id}
                      button
                      component={Link}
                      to={`/channel/${channel.id}`}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={channel.avatar}
                          imgProps={{ loading: 'lazy' }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={channel.username} />
                    </ListItem>
                  ))}
                {data.length - 7 > 0 && (
                  <ListItem
                    button
                    onClick={() => {
                      setShowMoreSubs(!showMoreSubs);
                    }}
                  >
                    <ListItemIcon>
                      {showMoreSubs ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        showMoreSubs
                          ? 'Show less'
                          : `Show ${data.length - 7} more`
                      }
                    />
                  </ListItem>
                )}
                <Divider />
              </div>
            </List>
          ) : null}
        </>
      )}
    </>
  );
};

export default Subscriptions;
