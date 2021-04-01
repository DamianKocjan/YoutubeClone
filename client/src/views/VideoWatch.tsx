import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { Link as RRLink, useHistory } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
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
  Share,
  Sort,
  NotificationsNone,
  ExpandLess,
  ExpandMore,
  PlayArrow,
} from '@material-ui/icons';

import { useQuery, useVideo, usePlaylist } from '../hooks';
import VideoComment from '../components/comment/VideoComment';
import VideoWatchItemCard from '../components/video/VideoWatchItemCard';
import axiosInstance from '../utils/axiosInstance';
import SubscribeButton from '../components/SubscribeButton';
import { IVideoComment } from '../types/videoComment';
import { IVideo } from '../types/video';
import VideoRatingButtons from '../components/ratingButtons/Video';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { useAuthState } from '../auth';
import AddToPlaylistButton from '../components/AddToPlaylistButton';

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
    playlistVideoAvatar: {
      width: '60px',
      marginRight: '5px',
      marginLeft: '-15px',
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

  const { isLogged, user } = useAuthState();

  const { status, data, error } = useVideo(videoId);

  const {
    status: videosStatus,
    data: videosData,
    error: videosError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, any>(
    ['videos', videoId],
    async ({ pageParam = 1 }) => {
      let page;

      if (typeof pageParam === 'number') page = pageParam;
      else if (typeof pageParam === 'string')
        page = pageParam.split('page=')[1];
      else page = pageParam;

      const { data } = await axiosInstance.get(
        `/videos/?exclude=${videoId}&page=${page}`
      );

      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.next ?? false,
    }
  );

  const loadMoreVideosButtonRef = useRef<HTMLButtonElement | null>(null);

  useIntersectionObserver({
    target: loadMoreVideosButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const {
    status: commentsStatus,
    data: commentsData,
    error: commentsError,
    isFetchingNextPage: isFetchingNextCommentsPage,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
  } = useInfiniteQuery<any, any>(
    ['video_comments', videoId],
    async ({ pageParam = 1 }) => {
      let page;

      if (typeof pageParam === 'number') page = pageParam;
      else if (typeof pageParam === 'string')
        page = pageParam.split('page=')[1];
      else page = pageParam;

      const { data } = await axiosInstance.get(
        `/comments/?video=${videoId}&page=${page}`
      );

      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.next ?? false,
    }
  );

  const loadMoreCommentsButtonRef = useRef<HTMLButtonElement | null>(null);

  useIntersectionObserver({
    target: loadMoreCommentsButtonRef,
    onIntersect: fetchNextCommentsPage,
    enabled: hasNextCommentsPage,
  });

  const {
    status: playlistStatus,
    data: playlistData,
    error: playlistError,
  } = usePlaylist(playlistId);

  const commentMutation = useMutation(
    async (newComment: { video: string; content: string }) =>
      await axiosInstance.post('/comments/', newComment),
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
    if (!isLogged) return;

    commentMutation.mutate({
      video: videoId,
      content: content.trim(),
    });

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
                    if (playlistId) {
                      let idx = 0;
                      playlistData.videos.forEach(
                        (video: IPlaylistVideo, index: number) => {
                          if (video.video.id === videoId) idx = index;
                        }
                      );

                      history.push(
                        // eslint-disable-next-line prettier/prettier
                        `/watch?v=${playlistData.videos[idx + 1].video.id
                        }&list=${playlistId}`
                      );
                    }
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
                    <AddToPlaylistButton videoId={videoId} />
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
                {commentsData ? commentsData.pages[0].count : 'No'} Comments
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
                    <Avatar src={user.avatar} />
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
                ) : (
                  <>
                    {commentsData &&
                      commentsData.pages.map((page: any) => (
                        <React.Fragment key={page.nextId}>
                          {page.results.map(
                            ({
                              id,
                              content,
                              likes_count,
                              dislikes_count,
                              created_at,
                              author,
                            }: IVideoComment) => (
                              <VideoComment
                                key={id}
                                commentId={id}
                                content={content}
                                likesCount={likes_count}
                                dislikesCount={dislikes_count}
                                createdAt={created_at}
                                authorId={author.id}
                                authorUsername={author.username}
                                authorAvatar={author.avatar}
                              />
                            )
                          )}
                        </React.Fragment>
                      ))}
                    <button
                      ref={loadMoreCommentsButtonRef}
                      onClick={() => fetchNextPage()}
                      disabled={
                        !hasNextCommentsPage || isFetchingNextCommentsPage
                      }
                      style={{ visibility: 'hidden' }}
                    />
                  </>
                )}
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
                      {playlistData.videos.map(
                        ({ id, video, position }: IPlaylistVideo) => (
                          <ListItem
                            button
                            key={id}
                            onClick={() => {
                              history.push(
                                // eslint-disable-next-line prettier/prettier
                                `/watch?v=${video.id}&list=${playlistId}&index=${position + 1}`
                              );
                            }}
                          >
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
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={video.title}
                              secondary={video.author.username}
                            />
                          </ListItem>
                        )
                      )}
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
              <>
                {videosData &&
                  videosData.pages.map((page: any) => (
                    <React.Fragment key={page.nextId}>
                      {page.results.map(
                        ({
                          id,
                          title,
                          created_at,
                          views_count,
                          thumbnail,
                          author,
                        }: IVideo) => (
                          <VideoWatchItemCard
                            key={id}
                            id={id}
                            title={title}
                            createdAt={created_at}
                            views={views_count}
                            thumbnail={thumbnail}
                            authorAvatar={author.avatar}
                            authorId={author.id}
                            authorName={author.username}
                          />
                        )
                      )}
                    </React.Fragment>
                  ))}
                <button
                  ref={loadMoreVideosButtonRef}
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  style={{ visibility: 'hidden' }}
                />
              </>
            )}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default VideoWatch;
