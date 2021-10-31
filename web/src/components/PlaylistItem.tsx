import React, { useState } from 'react';
import { Link as RRLink } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';

import {
  Avatar,
  createStyles,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Delete, Flag, MoreVert } from '@material-ui/icons';

import { useAuthState } from '../auth';
import type { IVideo } from '../types/models';
import { api } from '../api';

const useStyles = makeStyles(() =>
  createStyles({
    playlistAvatar: {
      width: '60px',
      marginRight: '5px',
      marginLeft: '-15px',
    },
  })
);

interface Props {
  objId: string;
  video: IVideo;
  position: number;
  playlistId: string;
  playlistTitle: string;
  playlistAuthorId: string;
}

const PlaylistItem: React.FC<Props> = ({
  objId,
  video,
  position,
  playlistId,
  playlistTitle,
  playlistAuthorId,
}) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const { isLogged, user } = useAuthState();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const playlistVideoDeleteMutation = useMutation(
    async () => await api.delete(`playlists-video/${objId}/`),
    {
      onSuccess: async () =>
        await queryClient.invalidateQueries(['playlist', playlistId]),
    }
  );

  const handleDelete = async () => {
    if (!isLogged || user.id !== playlistAuthorId) return;

    await playlistVideoDeleteMutation.mutateAsync();
  };

  return (
    <ListItem
      button
      component={RRLink}
      to={`/watch?v=${video.id}&list=${playlistId}&index=${position + 1}`}>
      <ListItemIcon>{position + 1}</ListItemIcon>
      <ListItemAvatar>
        <Avatar
          variant="square"
          src={video.thumbnail}
          className={classes.playlistAvatar}
          imgProps={{ loading: 'lazy' }}
        />
      </ListItemAvatar>
      <ListItemText primary={video.title} secondary={video.author.username} />
      <ListItemSecondaryAction>
        <IconButton onClick={handleClick}>
          <MoreVert />
        </IconButton>
        <Menu
          id="sort-by-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          {user.id === playlistAuthorId ? (
            <MenuItem
              onClick={() => {
                handleClose();
                handleDelete();
              }}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary={`Remove from ${playlistTitle}`} />
            </MenuItem>
          ) : (
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Flag />
              </ListItemIcon>
              <ListItemText primary="Report" />
            </MenuItem>
          )}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default PlaylistItem;
