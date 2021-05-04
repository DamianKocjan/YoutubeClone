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

import { IChannel } from '../types/channel';
import { useSubscriptions } from '../hooks';
import { ISubscription } from '../types/subscription';

interface Props {
  isLogged: boolean;
  user: IChannel;
  isOpen: boolean;
}

const Subscriptions: React.FC<Props> = ({ isLogged, user, isOpen }: Props) => {
  const { status, data, error } = useSubscriptions(user.id);
  const [showMoreSubs, setShowMoreSubs] = useState<boolean>(false);

  return (
    <>
      {isOpen && isLogged && (
        <>
          <Divider />
          <List>
            <div>
              {status === 'loading' ? (
                <ListItem button disabled>
                  <ListItemAvatar>
                    <></>
                  </ListItemAvatar>
                  <ListItemText primary="loading..." />
                </ListItem>
              ) : status === 'error' ? (
                <ListItem button disabled>
                  <ListItemAvatar>
                    <></>
                  </ListItemAvatar>
                  <ListItemText primary={error.message} />
                </ListItem>
              ) : (
                <>
                  {data.length > 0 && (
                    <ListSubheader color="inherit">Subscriptions</ListSubheader>
                  )}
                  {showMoreSubs
                    ? data.map(({ id, channel }: ISubscription) => (
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
                    : data.slice(0, 8).map(({ id, channel }: ISubscription) => (
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
                </>
              )}
            </div>
          </List>
        </>
      )}
    </>
  );
};

export default Subscriptions;
