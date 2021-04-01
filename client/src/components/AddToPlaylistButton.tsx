import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  FormControl,
  MenuItem,
  Select,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import {
  Add,
  Link,
  Lock,
  LockOpen,
  PlaylistAdd,
  Public,
} from '@material-ui/icons';

import { useAuthState } from '../auth';
import axiosInstance from '../utils/axiosInstance';
import { IPlaylist, IPlaylistVideo } from '../types/playlist';
import { usePlaylists } from '../hooks';

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

const AddToPlaylistButton: React.FC<Props> = ({ videoId }: Props) => {
  const { isLogged, user } = useAuthState();

  if (!isLogged) return <Button startIcon={<PlaylistAdd />}>Save</Button>;

  const classes = useStyles();

  const { status, data, error } = usePlaylists(user.id);

  const [open, setOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [privacyStatus, setPrivacyStatus] = useState('Private');

  useEffect(() => {
    const playlistIds: string[] = [];

    if (data) {
      data.forEach((playlist: IPlaylist) => {
        playlist.videos.forEach((video: IPlaylistVideo) => {
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

  let createdPlaylistId: undefined | number = undefined;

  const playlistMutation = useMutation(
    async (newPlaylist: {
      title: string;
      author: string;
      description: string;
      status: string;
    }) =>
      await axiosInstance
        .post('/playlists/', newPlaylist)
        .then((res) => (createdPlaylistId = res.data.id))
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

    selected.forEach((id, index) => {
      axiosInstance.post('/playlists-video/', {
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

  const handlePlaylistCreation = () => {
    setOpen(false);

    if (!isLogged) return;

    playlistMutation.mutate({
      title: title,
      author: user.id,
      description: '',
      status: privacyStatus,
    });

    axiosInstance.post('/playlists-video/', {
      playlist_id: createdPlaylistId,
      video_id: videoId,
      position: 0,
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
            <h1>{error.message}</h1>
          ) : data.length > 0 ? (
            data.map((playlist: IPlaylist) => (
              <ListItem
                button
                onClick={() => {
                  handleToggle(playlist.id);
                }}
                key={playlist.id}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={selected.indexOf(playlist.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={playlist.title} />
                <ListItemSecondaryAction>
                  {playlist.status === 'Public' ? (
                    <LockOpen />
                  ) : playlist.status === 'Private' ? (
                    <Lock />
                  ) : (
                    <Link />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : null}
          <Divider />
          {!openForm ? (
            <ListItem
              button
              onClick={() => {
                setOpenForm(true);
              }}
            >
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
                <FormControl fullWidth className={classes.input}>
                  <Select
                    label="Privacy"
                    value={privacyStatus}
                    onChange={handlePrivacyStatusChange}
                    renderValue={(value) => `${value}`}
                    fullWidth
                  >
                    <MenuItem value="Public">
                      <ListItemIcon>
                        <Public />
                      </ListItemIcon>
                      <ListItemText
                        primary="Public"
                        secondary="Anyone can search for and view"
                      />
                    </MenuItem>
                    <MenuItem value="Unlisted">
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText
                        primary="Unlisted"
                        secondary="Anyone with the link can view"
                      />
                    </MenuItem>
                    <MenuItem value="Private">
                      <ListItemIcon>
                        <Lock />
                      </ListItemIcon>
                      <ListItemText
                        primary="Private"
                        secondary="Only you can view"
                      />
                    </MenuItem>
                  </Select>
                </FormControl>
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
