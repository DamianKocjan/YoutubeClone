import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { Link as RRLink, useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import remarkGfm from 'remark-gfm';

import {
  Avatar,
  Button,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Link,
  Card,
  CardHeader,
  Chip,
  CardContent,
  ListItemIcon,
} from '@material-ui/core';
import {
  MoreHoriz,
  PlaylistAdd,
  Share,
  Sort,
  NotificationsNone,
  ExpandLess,
  ExpandMore,
  PlayArrow,
} from '@material-ui/icons';

import {
  useQuery,
  useVideo,
  useVideosWithExclude,
  useVideoComments,
  usePlaylist,
} from '../hooks';
import VideoComment from '../components/comment/VideoComment';
import VideoWatchItemCard from '../components/video/VideoWatchItemCard';
import axiosInstance from '../utils/axiosInstance';
import SubscribeButton from '../components/SubscribeButton';
import { IVideoComment } from '../types/videoComment';
import { IVideo } from '../types/video';
import VideoRatingButtons from '../components/ratingButtons/Video';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    spacing: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    playerWrapper: {
      position: 'relative',
      paddingTop: '56.25%',
    },
    reactPlayer: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    playlistRoot: {
      margin: theme.spacing(1),
      maxHeight: '400px',
      overflowY: 'scroll',
    },
  })
);

interface IPlaylistVideo {
  id: string;
  video: IVideo;
  position: number;
}

const VideoWatch: React.FC = () => {
  const classes = useStyles();
  const videoId = useQuery().get('v') || '';
  const playlistId = useQuery().get('list') || '';
  const playlistVideoIndex = useQuery().get('index') || '';
  const queryClient = useQueryClient();
  const history = useHistory();
  const { status, data, error } = useVideo(videoId);
  const {
    status: videosStatus,
    data: videosData,
    error: videosError,
  } = useVideosWithExclude(videoId);
  const {
    status: commentsStatus,
    data: commentsData,
    error: commentsError,
  } = useVideoComments(videoId);
  const {
    status: playlistStatus,
    data: playlistData,
    error: playlistError,
  } = usePlaylist(playlistId);

  const commentMutation = useMutation(
    (newComment: { video: string; content: string }) =>
      axiosInstance.post('/comments/', newComment),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['video_comments', videoId]),
    }
  );

  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [showPlaylistVideos, setShowPlaylistVideos] = useState<boolean>(true);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const localStorageVolume = localStorage.getItem('volume');
    if (localStorageVolume) {
      const value = +JSON.parse(localStorageVolume);
      if (value >= 0 && value <= 1) setVolume(value);
    }
    setIsMuted(localStorage.getItem('volume') === 'true' ? true : false);
  }, []);

  const handleCommentCreation = () => {
    commentMutation.mutate({ video: videoId, content: content.trim() });

    if (commentMutation.isSuccess) setContent('');
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item lg={8} md={12} sm={12}>
          {status === 'loading' ? (
            <h1>loading...</h1>
          ) : status === 'error' ? (
            <h1>{error.message}</h1>
          ) : (
            <>
              <div className={classes.playerWrapper}>
                <ReactPlayer
                  className={classes.reactPlayer}
                  width="100%"
                  height="100%"
                  url={data.video}
                  controls
                  light={data.thumbnail}
                  volume={volume}
                  muted={isMuted}
                  onEnded={() => {
                    let idx = 0;
                    playlistData.videos.forEach((video: any, index: number) => {
                      if (video.video.id === videoId) idx = index;
                    });

                    history.push(
                      // eslint-disable-next-line prettier/prettier
                      `/watch?v=${playlistData.videos[idx + 1].video.id
                      }&list=${playlistId}`
                    );
                  }}
                >
                  <source src={data.video} type="video/mp4" />
                </ReactPlayer>
              </div>
              <List>
                <ListItem>
                  <ListItemText
                    primary={data.title}
                    secondary={`${data.views_count} views • ${new Date(
                      data.created_at
                    ).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <VideoRatingButtons
                      video={data.id}
                      likesCount={data.likes_count}
                      dislikesCount={data.dislikes_count}
                    />
                    <Button startIcon={<Share />}>Share</Button>
                    <Button startIcon={<PlaylistAdd />}>Save</Button>
                    <IconButton>
                      <MoreHoriz />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              <hr />
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={data.author.avatar}
                      style={{ width: '48px', height: '48px' }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        component={RRLink}
                        to={`/channel/${data.author.id}`}
                        color="inherit"
                      >
                        {data.author.username}
                      </Link>
                    }
                    secondary={`${data.author.subscribers_count} subscribers`}
                  />
                  <ListItemSecondaryAction>
                    <SubscribeButton channel={data.author.id} />
                    <IconButton>
                      <NotificationsNone />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <></>
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography>
                      <ReactMarkdown plugins={[remarkGfm]}>
                        {data.description}
                      </ReactMarkdown>
                    </Typography>
                  </ListItemText>
                </ListItem>
              </List>
              <hr />
              <Typography>
                {commentsData ? commentsData.length : 'No'} Comments
                <Button startIcon={<Sort />} onClick={handleClick}>
                  Sort by
                </Button>
              </Typography>
              <Menu
                id="sort-by-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Top comments</MenuItem>
                <MenuItem onClick={handleClose}>Newest first</MenuItem>
              </Menu>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText>
                    <TextField
                      placeholder="Add a public comment..."
                      fullWidth
                      onFocus={() => {
                        setShowButtons(true);
                      }}
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                      }}
                    />
                  </ListItemText>
                  {showButtons && (
                    <ListItemSecondaryAction>
                      <Button
                        onClick={() => {
                          setShowButtons(false);
                          setContent('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCommentCreation}
                      >
                        Comment
                      </Button>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                {commentsStatus === 'loading' ? (
                  <h1>loading...</h1>
                ) : commentsStatus === 'error' ? (
                  <h1>{commentsError.message}</h1>
                ) : commentsData ? (
                  commentsData.map((comment: IVideoComment) => (
                    <VideoComment
                      key={comment.id}
                      commentId={comment.id}
                      content={comment.content}
                      likesCount={comment.likes_count}
                      dislikesCount={comment.dislikes_count}
                      createdAt={comment.created_at}
                      authorId={comment.author.id}
                      authorUsername={comment.author.username}
                      authorAvatar={comment.author.avatar}
                    />
                  ))
                ) : null}
              </List>
            </>
          )}
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <List>
            {playlistId && playlistStatus === 'loading' ? (
              <h1>loading...</h1>
            ) : playlistStatus === 'error' ? (
              <h1>{playlistError.message}</h1>
            ) : playlistData && playlistId.length > 0 ? (
              <Card className={classes.playlistRoot}>
                <CardHeader
                  action={
                    <IconButton
                      onClick={() => {
                        setShowPlaylistVideos(!showPlaylistVideos);
                      }}
                    >
                      {showPlaylistVideos ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  }
                  title={playlistData.title}
                  subheader={
                    <Typography>
                      <Chip label={playlistData.status} size="small" />{' '}
                      {playlistData.author.username} -{' '}
                      {playlistVideoIndex ? playlistVideoIndex : 1}/
                      {playlistData.videos.length}
                    </Typography>
                  }
                />
                {showPlaylistVideos && (
                  <CardContent style={{ marginTop: '-30px' }}>
                    <List>
                      {playlistData.videos.map((video: IPlaylistVideo) => (
                        <ListItem
                          button
                          key={video.id}
                          onClick={() => {
                            history.push(
                              // eslint-disable-next-line prettier/prettier
                              `/watch?v=${video.video.id}&list=${playlistId}&index=${video.position + 1}`
                            );
                          }}
                        >
                          <ListItemIcon>
                            {+videoId === +video.video.id ? (
                              <PlayArrow />
                            ) : (
                              <>{video.position + 1}</>
                            )}
                          </ListItemIcon>
                          <ListItemAvatar>
                            <Avatar
                              variant="square"
                              src={video.video.thumbnail}
                              style={{
                                width: '60px',
                                marginRight: '5px',
                                marginLeft: '-15px',
                              }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={video.video.title}
                            secondary={video.video.author.username}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                )}
              </Card>
            ) : null}
            {videosStatus === 'loading' ? (
              <h1>loading...</h1>
            ) : videosStatus === 'error' ? (
              <h1>{videosError.message}</h1>
            ) : (
              videosData.length > 0 &&
              videosData.map((video: IVideo) => (
                <VideoWatchItemCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  createdAt={video.created_at}
                  views={video.views_count}
                  thumbnail={video.thumbnail}
                  authorAvatar={video.author.avatar}
                  authorId={video.author.id}
                  authorName={video.author.username}
                />
              ))
            )}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default VideoWatch;
