import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { Link as RRLink, useHistory } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import remarkGfm from 'remark-gfm';

import {
  Avatar,
  Button,
  createStyles,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { MoreHoriz, NotificationsNone, Share } from '@material-ui/icons';

import {
  useIntersectionObserver,
  usePlaylist,
  useQuery,
  useVideo,
} from '../hooks';
import VideoWatchItemCard from '../components/video/VideoWatchItemCard';
import axiosInstance from '../utils/axiosInstance';
import SubscribeButton from '../components/SubscribeButton';
import { IVideo } from '../types/video';
import VideoRatingButtons from '../components/ratingButtons/Video';
import AddToPlaylistButton from '../components/AddToPlaylistButton';
import CommentSection from '../components/video/CommentSection';
import PlaylistSection from '../components/video/PlaylistSection';
import { IPlaylistVideo } from '../types/playlist';

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
  })
);

const VideoWatch: React.FC = () => {
  const classes = useStyles();

  const videoId = useQuery().get('v') || '';
  const playlistId = useQuery().get('list') || '';
  const playlistVideoIndex = useQuery().get('index') || '';

  const history = useHistory();

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
    status: playlistStatus,
    data: playlistData,
    error: playlistError,
  } = usePlaylist(playlistId);

  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const localStorageVolume = localStorage.getItem('volume');

    if (localStorageVolume) {
      const value = +JSON.parse(localStorageVolume);
      if (value >= 0 && value <= 1) setVolume(value);
    }

    setIsMuted(localStorage.getItem('volume') === 'true' ? true : false);
  }, []);

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
              <Divider />
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={data.author.avatar}
                      style={{ width: '48px', height: '48px' }}
                      imgProps={{ loading: 'lazy' }}
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
              <Divider />
              <CommentSection videoId={videoId} />
            </>
          )}
        </Grid>
        <Grid item lg={4} md={12} sm={12}>
          <List>
            <PlaylistSection
              videoId={videoId}
              playlistId={playlistId}
              playlistVideoIndex={playlistVideoIndex}
              status={playlistStatus}
              data={playlistData}
              error={playlistError}
            />
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
