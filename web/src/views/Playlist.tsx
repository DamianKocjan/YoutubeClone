import React, { useState } from 'react';
import { Link as RRLink, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';

import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  Delete,
  Flag,
  Link as LinkIcon,
  Lock,
  MoreHoriz,
  PlayArrow,
  Public,
  Share,
  Shuffle,
} from '@material-ui/icons';

import { usePlaylist } from '../hooks';
import { useAuthState } from '../auth';
import SubscribeButton from '../components/SubscribeButton';
import { api } from '../api';
import AddToLibraryButton from '../components/AddToLibraryButton';
import PrivacySelectInput from '../components/PrivacySelectInput';
import PlaylistEditInputForm from '../components/PlaylistEditInputFormProps';
import PlaylistItem from '../components/PlaylistItem';

type IPlaylistMutationData =
  | { title: string }
  | { status: string }
  | { description: string };

const Playlist: React.FC = () => {
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

  const playlistMutation = useMutation(
    async (newPlaylistData: IPlaylistMutationData) =>
      await api.patch(`/playlists/${id}/`, newPlaylistData),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['playlist', id]);
        setIsTitleFormOpen(false);
        setIsDescriptionFormOpen(false);
      },
    }
  );

  const updateTitle = async () => {
    if (!isLogged || user.id !== data?.author.id) return;

    await playlistMutation.mutateAsync({ title: title });
  };

  const updateDescription = async () => {
    if (!isLogged || user.id !== data?.author.id) return;

    await playlistMutation.mutateAsync({ description: description });
  };

  const handlePrivacyStatusChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    if (!isLogged || user.id !== data?.author.id) return;

    setPrivacyStatus(event.target.value as string);

    await playlistMutation.mutateAsync({ status: privacyStatus });
  };

  const playlistDeleteMutation = useMutation(
    async () => await api.delete(`/playlists/${id}/`),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['playlists', data?.author?.id]);
        history.push('/');
      },
    }
  );

  const handleDelete = async () => {
    if (!isLogged || user.id !== data?.author.id) return;

    let content =
      prompt(
        'Are you sure you want to delete this playlist? Type y if you want.'
      ) || '';

    if (content) content = content.trim();
    else content = '';

    if (content && content === 'y') await playlistDeleteMutation.mutateAsync();
  };

  return (
    <>
      {status === 'loading' ? (
        <h1>loading...</h1>
      ) : status === 'error' ? (
        <h1>{error?.message || error}</h1>
      ) : (
        <Grid container>
          <Grid item lg={2} md={4} sm={12}>
            <img
              src={data?.videos?.[0].video.thumbnail}
              style={{ width: 'calc(100% - 10px)' }}
            />
            <RRLink
              to={`/watch?v=${data?.videos?.[0].video.id}&list=${id}&index=1`}>
              <Button fullWidth startIcon={<PlayArrow />}>
                Play all
              </Button>
            </RRLink>
            <List>
              <PlaylistEditInputForm
                isFormOpen={isTitleFormOpen}
                setIsFormOpen={setIsTitleFormOpen}
                label="Title"
                displayValue={data?.title || ''}
                value={title}
                setValue={setTitle}
                updateValue={updateTitle}
                user={user}
                data={data}
              />
              <ListItem>
                <ListItemText
                  secondary={
                    data?.videos?.length +
                    ' videos · ' +
                    data?.views_count +
                    ' · updated ' +
                    new Date(data?.updated_at || '').toLocaleDateString()
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  secondary={
                    user.id === data?.author.id ? (
                      <PrivacySelectInput
                        value={privacyStatus}
                        handleChange={handlePrivacyStatusChange}
                      />
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
                  {user.id !== data?.author.id && (
                    <AddToLibraryButton playlistId={id} />
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
                    onClose={handleClose}>
                    {user.id === data?.author.id ? (
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDelete();
                        }}>
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
              <PlaylistEditInputForm
                isFormOpen={isDescriptionFormOpen}
                setIsFormOpen={setIsDescriptionFormOpen}
                label="Description"
                displayValue={data?.description || ''}
                value={description}
                setValue={setDescription}
                updateValue={updateDescription}
                user={user}
                data={data}
              />
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <RRLink to={`/channel/${data?.author.id}`}>
                    <Avatar
                      src={data?.author.avatar}
                      style={{ width: '48px', height: '48px' }}
                      imgProps={{ loading: 'lazy' }}
                    />
                  </RRLink>
                </ListItemAvatar>
                <ListItemText>
                  <Link
                    component={RRLink}
                    color="inherit"
                    to={`/channel/${data?.author.id}`}>
                    {data?.author.username}
                  </Link>
                </ListItemText>
                <ListItemSecondaryAction>
                  <SubscribeButton channel={data?.author.id || ''} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Grid>
          <Grid item lg={10} md={8} sm={12}>
            <Container>
              <List>
                {data?.videos.map(({ id: vId, video, position }) => (
                  <PlaylistItem
                    key={vId}
                    objId={vId}
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
