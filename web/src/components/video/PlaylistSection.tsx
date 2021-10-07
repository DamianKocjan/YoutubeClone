import React, { useState } from 'react';
import { useHistory } from 'react-router';

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, PlayArrow } from '@material-ui/icons';

import type { IPlaylistVideo } from '../../types/models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playlistRoot: {
      margin: theme.spacing(1),
      maxHeight: '400px',
      overflowY: 'scroll',
    },
    playlistVideoAvatar: {
      width: '60px',
      marginRight: '5px',
      marginLeft: '-15px',
    },
  })
);

interface Props {
  videoId: string;
  playlistId: string;
  playlistVideoIndex: string;
  status: any;
  data: any;
  error: any;
}

const PlaylistSection: React.FC<Props> = ({
  videoId,
  playlistId,
  playlistVideoIndex,
  status,
  data,
  error,
}: Props) => {
  const classes = useStyles();

  const history = useHistory();

  const [showPlaylistVideos, setShowPlaylistVideos] = useState<boolean>(true);

  return (
    <>
      {playlistId && status === 'loading' ? (
        <h1>loading...</h1>
      ) : status === 'error' ? (
        <h1>{error.message}</h1>
      ) : data && playlistId.length > 0 ? (
        <Card className={classes.playlistRoot}>
          <CardHeader
            action={
              <IconButton
                onClick={() => {
                  setShowPlaylistVideos(!showPlaylistVideos);
                }}>
                {showPlaylistVideos ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
            title={data.title}
            subheader={
              <Typography>
                <Chip label={data.status} size="small" /> {data.author.username}{' '}
                - {playlistVideoIndex ? playlistVideoIndex : 1}/
                {data.videos.length}
              </Typography>
            }
          />
          {showPlaylistVideos && (
            <CardContent style={{ marginTop: '-30px' }}>
              <List>
                {data.videos.map(({ id, video, position }: IPlaylistVideo) => (
                  <ListItem
                    button
                    key={id}
                    onClick={() => {
                      history.push(
                        // eslint-disable-next-line prettier/prettier
                        `/watch?v=${video.id}&list=${playlistId}&index=${position + 1}`
                      );
                    }}>
                    <ListItemIcon>
                      {+videoId === +video.id ? (
                        <PlayArrow />
                      ) : (
                        <>{position + 1}</>
                      )}
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={video.thumbnail}
                        className={classes.playlistVideoAvatar}
                        imgProps={{ loading: 'lazy' }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={video.title}
                      secondary={video.author.username}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          )}
        </Card>
      ) : null}
    </>
  );
};

export default PlaylistSection;
