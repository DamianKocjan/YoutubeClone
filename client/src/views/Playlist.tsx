import React, { useState } from 'react';
import { useParams, Link as RRLink, useHistory } from 'react-router-dom';

import {
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  FormControl,
  Select,
  ListItemIcon,
  makeStyles,
  Theme,
  createStyles,
  ListItemAvatar,
  Avatar,
  Link,
  Divider,
  Container,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  PlayArrow,
  Edit,
  Public,
  Link as LinkIcon,
  Lock,
  Shuffle,
  MoreHoriz,
  MoreVert,
  Share,
  PlaylistAddCheck,
  PlaylistAdd,
  Delete,
  Flag,
} from '@material-ui/icons';

import { usePlaylist } from '../hooks';
import { useAuthState } from '../auth';
import { IPlaylistVideo } from '../types/playlist';
import SubscribeButton from '../components/SubscribeButton';
import { IVideo } from '../types/video';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../utils/axiosInstance';

const usePlaylistItemStyles = makeStyles((theme: Theme) => ({
  playlistAvatar: {
    width: '60px',
    marginRight: '5px',
    marginLeft: '-15px',
  },
}));

interface PlaylistItemProps {
  objId: string;
  video: IVideo;
  position: number;
  playlistId: string;
  playlistTitle: string;
  playlistAuthorId: string;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  objId,
  video,
  position,
  playlistId,
  playlistTitle,
  playlistAuthorId,
}: PlaylistItemProps) => {
  const classes = usePlaylistItemStyles();
  const queryClient = useQueryClient();

  const { isLogged, user } = useAuthState();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const playlistVideoDeleteMutation = useMutation(
    async () => await axiosInstance.delete(`/playlists-video/${objId}/`),
    {
      onSuccess: () => queryClient.invalidateQueries(['playlist', playlistId]),
    }
  );

  const handleDelete = () => {
    if (!isLogged || user.id !== playlistAuthorId) return;

    playlistVideoDeleteMutation.mutate();
  };

  return (
    <ListItem
      button
      component={RRLink}
      to={`/watch?v=${video.id}&list=${playlistId}&index=${position + 1}`}
    >
      <ListItemIcon>{position + 1}</ListItemIcon>
      <ListItemAvatar>
        <Avatar
          variant="square"
          src={video.thumbnail}
          className={classes.playlistAvatar}
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
          onClose={handleClose}
        >
          {user.id === playlistAuthorId ? (
            <MenuItem
              onClick={() => {
                handleClose();
                handleDelete();
              }}
            >
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    formBtns: { float: 'right', margin: '10px 2px' },
  })
);

const Playlist: React.FC = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const history = useHistory();

  const { id } = useParams<{ id: string }>();
  const { status, data, error } = usePlaylist(id);

  const { isLogged, user } = useAuthState();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isTitleFormOpen, setIsTitleFormOpen] = useState(false);
  const [title, setTitle] = useState(data ? data.title : '');

  const [privacyStatus, setPrivacyStatus] = useState(
    data ? data.status : 'Private'
  );

  const [isDescriptionFormOpen, setIsDescriptionFormOpen] = useState(false);
  const [description, setDescription] = useState(data ? data.description : '');

  type PlaylistMutationData =
    | { title: string }
    | { status: string }
    | { description: string };

  const playlistMutation = useMutation(
    async (newPlaylistData: PlaylistMutationData) =>
      await axiosInstance.patch(`/playlists/${id}/`, newPlaylistData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['playlist', id]);
        setIsTitleFormOpen(false);
        setIsDescriptionFormOpen(false);
      },
    }
  );

  const updateTitle = () => {
    if (!isLogged || user.id !== data.author.id) return;

    playlistMutation.mutate({ title: title });
  };

  const updateDescription = () => {
    if (!isLogged || user.id !== data.author.id) return;

    playlistMutation.mutate({ description: description });
  };

  const handlePrivacyStatusChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    if (!isLogged || user.id !== data.author.id) return;

    setPrivacyStatus(event.target.value as string);

    playlistMutation.mutate({ status: privacyStatus });
  };

  const playlistDeleteMutation = useMutation(
    async () => await axiosInstance.delete(`/playlists/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['playlists', data.author.id]);
        history.push('/');
      },
    }
  );

  const handleDelete = () => {
    if (!isLogged || user.id !== data.author.id) return;

    let content = prompt(
      'Are you sure you want to delete this playlist? Type y if you want.'
    )!;

    if (content) content = content.trim();
    else content = '';

    if (content && content === 'y') playlistDeleteMutation.mutate();
  };

  return (
    <>
      {status === 'loading' ? (
        <h1>loading...</h1>
      ) : status === 'error' ? (
        <h1>{error.message}</h1>
      ) : (
        <Grid container>
          <Grid item lg={2} md={4} sm={12}>
            <img
              src={data.videos[0].video.thumbnail}
              style={{ width: 'calc(100% - 10px)' }}
            />
            <RRLink
              to={`/watch?v=${data.videos[0].video.id}&list=${id}&index=1`}
            >
              <Button fullWidth startIcon={<PlayArrow />}>
                Play all
              </Button>
            </RRLink>
            <List>
              <ListItem>
                <ListItemText>
                  {isTitleFormOpen && user.id === data.author.id ? (
                    <>
                      <TextField
                        label="Title"
                        required
                        fullWidth
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setTitle(e.target.value);
                        }}
                      />
                      <div className={classes.formBtns}>
                        <Button
                          onClick={() => {
                            setIsTitleFormOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={updateTitle}>Save</Button>
                      </div>
                    </>
                  ) : (
                    <>{data.title}</>
                  )}
                </ListItemText>
                {!isTitleFormOpen && user.id === data.author.id && (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        setIsTitleFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <ListItem>
                <ListItemText
                  secondary={
                    data.videos.length +
                    ' videos · ' +
                    data.views_count +
                    ' · updated ' +
                    new Date(data.updated_at).toLocaleDateString()
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  secondary={
                    user.id === data.author.id ? (
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
                              <LinkIcon />
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
                    ) : (
                      <>
                        {privacyStatus === 'Public' ? (
                          <Button startIcon={<Public />} disabled>
                            {privacyStatus}
                          </Button>
                        ) : privacyStatus === 'Unlisted' ? (
                          <Button startIcon={<LinkIcon />} disabled>
                            {privacyStatus}
                          </Button>
                        ) : (
                          <Button startIcon={<Lock />} disabled>
                            {privacyStatus}
                          </Button>
                        )}
                      </>
                    )
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText>
                  {user.id !== data.author.id && (
                    // TODO add to library
                    <IconButton>
                      <PlaylistAddCheck />
                    </IconButton>
                  )}
                  <IconButton>
                    <Shuffle />
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                  <IconButton onClick={handleClick}>
                    <MoreHoriz />
                  </IconButton>
                  <Menu
                    id="sort-by-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {user.id === data.author.id ? (
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDelete();
                        }}
                      >
                        <ListItemIcon>
                          <Delete />
                        </ListItemIcon>
                        <ListItemText primary="Delete playlist" />
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
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  {isDescriptionFormOpen && user.id === data.author.id ? (
                    <>
                      <TextField
                        label="Description"
                        fullWidth
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setDescription(e.target.value);
                        }}
                      />
                      <div className={classes.formBtns}>
                        <Button
                          onClick={() => {
                            setIsDescriptionFormOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={updateDescription}>Save</Button>
                      </div>
                    </>
                  ) : (
                    <>{data.description}</>
                  )}
                </ListItemText>
                {!isDescriptionFormOpen && user.id === data.author.id && (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        setIsDescriptionFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <RRLink to={`/channel/${data.author.id}`}>
                    <Avatar
                      src={data.author.avatar}
                      style={{ width: '48px', height: '48px' }}
                    />
                  </RRLink>
                </ListItemAvatar>
                <ListItemText>
                  <Link
                    component={RRLink}
                    color="inherit"
                    to={`/channel/${data.author.id}`}
                  >
                    {data.author.username}
                  </Link>
                </ListItemText>
                <ListItemSecondaryAction>
                  <SubscribeButton channel={data.author.id} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Grid>
          <Grid item lg={10} md={8} sm={12}>
            <Container>
              <List>
                {data.videos.map(({ id, video, position }: IPlaylistVideo) => (
                  <PlaylistItem
                    key={id}
                    objId={id}
                    video={video}
                    position={position}
                    playlistId={id}
                    playlistTitle={data.title}
                    playlistAuthorId={data.author.id}
                  />
                ))}
              </List>
            </Container>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Playlist;
