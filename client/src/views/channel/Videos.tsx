import React from 'react';
import { useParams } from 'react-router-dom';

import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { useChannelVideos } from '../../hooks';
import { IVideo } from '../../types/video';
import VideoHomeCard from '../../components/video/VideoHomeCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
    },
    spacing: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const Videos: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();
  const { status, data, error } = useChannelVideos(id);

  return (
    <>
      <Typography variant="h5">Uploads</Typography>
      <Container>
        <Grid container spacing={3}>
          {status === 'loading' ? (
            <h1>loading...</h1>
          ) : status === 'error' ? (
            <h1>{error.message}</h1>
          ) : data.length > 0 ? (
            data.map(
              ({
                title,
                id,
                created_at,
                views_count,
                author,
                thumbnail,
              }: IVideo) => (
                <Grid
                  item
                  sm={12}
                  md={4}
                  lg={3}
                  key={id}
                  className={(classes.paper, classes.spacing)}
                >
                  <VideoHomeCard
                    title={title}
                    id={id}
                    createdAt={created_at}
                    views={views_count}
                    authorName={author.username}
                    authorId={author.id}
                    authorAvatar={author.avatar}
                    thumbnail={thumbnail}
                  />
                </Grid>
              )
            )
          ) : null}
        </Grid>
      </Container>
    </>
  );
};

export default Videos;
