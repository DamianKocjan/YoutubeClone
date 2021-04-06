/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import IconButton from '@material-ui/core/IconButton';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck';

import { useAuthState } from '../auth';
import { useUserLibrary } from '../hooks/useLibrary';
import axiosInstance from '../utils/axiosInstance';
import { IPlaylist } from '../types/playlist';

interface Props {
  playlistId: string;
}

const AddToLibraryButton: React.FC<Props> = ({ playlistId }: Props) => {
  const { isLogged, user } = useAuthState();
  const queryClient = useQueryClient();

  const { status, data, error } = useUserLibrary(user.id);
  const [isPlaylistInLibrary, setIsPlaylistInLibrary] = useState(
    data && data.playlists
      ? !!data.playlists.filter((playlist: any) => playlist.id === playlistId)
      : false
  );

  const addToLibraryMutation = useMutation(
    async () =>
      await axiosInstance.put(`/libraries/${data.id}/`, {
        playlists_id: [...data.playlists, playlistId],
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['library', user.id]);
        setIsPlaylistInLibrary(true);
      },
    }
  );

  const handleAddToLibrary = async () => {
    await addToLibraryMutation.mutateAsync();
  };

  const removeFromLibraryMutation = useMutation(
    async () =>
      await axiosInstance.put(`/libraries/${data.id}/`, {
        playlists_id: [
          ...data.playlists.filter(
            (playlist: IPlaylist) => String(playlist.id) !== String(playlistId)
          ),
        ],
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['library', user.id]);
        setIsPlaylistInLibrary(false);
      },
    }
  );

  const handleRemoveFromLibrary = async () => {
    await removeFromLibraryMutation.mutateAsync();
  };

  if (!isLogged)
    return (
      <IconButton>
        <PlaylistAddCheck />
      </IconButton>
    );

  return (
    <>
      {status === 'loading' ? (
        <h1>loading...</h1>
      ) : status === 'error' ? (
        <h1>{error.message}</h1>
      ) : !isPlaylistInLibrary ? (
        <IconButton onClick={handleAddToLibrary}>
          <PlaylistAdd />
        </IconButton>
      ) : (
        <IconButton onClick={handleRemoveFromLibrary}>
          <PlaylistAddCheck />
        </IconButton>
      )}
    </>
  );
};

export default AddToLibraryButton;
