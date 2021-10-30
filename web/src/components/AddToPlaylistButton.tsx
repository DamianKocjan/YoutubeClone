import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { Add, Link, Lock, LockOpen, PlaylistAdd } from '@material-ui/icons';

import { useAuthState } from '../auth';
import { api } from '../api';
import { usePlaylists, useUserLibrary } from '../hooks';
import PrivacySelectInput from './PrivacySelectInput';

interface Props {
  videoId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    createBtn: { marginTop: '15px', float: 'right' },
  })
);

const AddToPlaylistButton: React.FC<Props> = ({ videoId }) => {
  const { isLogged, user } = useAuthState();

  if (!isLogged) return <Button startIcon={<PlaylistAdd />}>Save</Button>;

  const classes = useStyles();

  const { status, data, error } = usePlaylists(user.id);
  const { data: userLibraryData } = useUserLibrary(user.id);

  const [open, setOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('Private');

  useEffect(() => {
    const playlistIds: string[] = [];

    if (data) {
      data.forEach((playlist) => {
        playlist.videos.forEach((video) => {
          if (
            new String(video.video.id).valueOf() ===
            new String(videoId).valueOf()
          )
            playlistIds.push(playlist.id);
        });
      });
    }

    setSelected([...selected, ...playlistIds]);
  }, []);

  const playlistMutation = useMutation(
    async (newPlaylist: {
      title: string;
      author: string;
      description: string;
      status: string;
    }) =>
      await api.post('/playlists/', newPlaylist).then(async (res) => {
        await api.post('/playlists-video/', {
          playlist_id: res.data.id,
          video_id: videoId,
          position: 0,
        });

        await api.put(`/libraries/${userLibraryData?.id}`, {
          playlists_id: [...(userLibraryData?.playlists || []), res.data.id],
        });
      })
  );

  const handleToggle = (value: string) => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    selected.forEach(async (id, index) => {
      await api.post('/playlists-video/', {
        playlist_id: id,
        video_id: videoId,
        position: index,
      });
    });
  };

  const handlePrivacyStatusChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPrivacyStatus(event.target.value as string);
  };

  const handlePlaylistCreation = async () => {
    setOpen(false);

    if (!isLogged) return;

    await playlistMutation.mutateAsync({
      title: title,
      author: user.id,
      description: '',
      status: privacyStatus,
    });
  };

  return (
    <>
      <Button startIcon={<PlaylistAdd />} onClick={handleOpen}>
        Save
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Save to...</DialogTitle>
        <List>
          {status === 'loading' ? (
            <h1>loading...</h1>
          ) : status === 'error' ? (
            <h1>{error?.message || error}</h1>
          ) : (
            data?.map(({ id, title, status: playlistStatus }) => (
              <ListItem
                button
                onClick={() => {
                  handleToggle(id);
                }}
                key={id}>
                <ListItemIcon>
                  <Checkbox
                    checked={selected.indexOf(id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={title} />
                <ListItemSecondaryAction>
                  {playlistStatus === 'Public' ? (
                    <LockOpen />
                  ) : playlistStatus === 'Private' ? (
                    <Lock />
                  ) : (
                    <Link />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
          <Divider />
          {!openForm ? (
            <ListItem
              button
              onClick={() => {
                setOpenForm(true);
              }}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Create a new playlist" />
            </ListItem>
          ) : (
            <ListItem>
              <ListItemText>
                <TextField
                  label="Name"
                  placeholder="Enter playlist name..."
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 1, max: 150 } }}
                  name="title"
                  className={classes.input}
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                  }}
                />
                <PrivacySelectInput
                  value={privacyStatus}
                  handleChange={handlePrivacyStatusChange}
                />
                <div className={classes.createBtn}>
                  <Button onClick={handlePlaylistCreation}>Create</Button>
                </div>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Dialog>
    </>
  );
};

export default AddToPlaylistButton;
