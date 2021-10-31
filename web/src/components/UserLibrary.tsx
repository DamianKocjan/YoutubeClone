/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

import {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, PlaylistPlay } from '@material-ui/icons';

import DrawerListItem from './DrawerListItem';
import type { IChannel } from '../types/models';
import { useUserLibrary } from '../hooks';

interface Props {
  isLogged: boolean;
  user: IChannel;
  isOpen: boolean;
}

const UserLibrary: React.FC<Props> = ({ isLogged, user, isOpen }) => {
  const { status, data, error } = useUserLibrary(user.id);
  const [showMorePlaylists, setShowMorePlaylists] = useState(false);

  return (
    <>
      {isOpen &&
        isLogged &&
        (status === 'loading' ? (
          <ListItem>
            <ListItemAvatar>
              <></>
            </ListItemAvatar>
            <ListItemText primary="loading..." />
          </ListItem>
        ) : status === 'error' ? (
          <ListItem>
            <ListItemAvatar>
              <></>
            </ListItemAvatar>
            <ListItemText primary={error?.message || error} />
          </ListItem>
        ) : data && (
          <>
            {showMorePlaylists
              ? data.playlists.map(({ id, title }) => (
                <DrawerListItem
                  key={id}
                  to={`/playlist/${id}`}
                  icon={<PlaylistPlay />}
                  title={title}
                />
              ))
              : data.playlists
                .slice(0, 8)
                .map(({ id, title }) => (
                  <DrawerListItem
                    key={id}
                    to={`/playlist/${id}`}
                    icon={<PlaylistPlay />}
                    title={title}
                  />
                ))}
            {data.playlists.length - 7 > 0 && (
              <ListItem
                button
                onClick={() => {
                  setShowMorePlaylists(!showMorePlaylists);
                }}
              >
                <ListItemIcon>
                  {showMorePlaylists ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    showMorePlaylists
                      ? 'Show less'
                      : `Show ${data.playlists.length - 7} more`
                  }
                />
              </ListItem>
            )}
          </>
        ))}
    </>
  );
};

export default UserLibrary;
