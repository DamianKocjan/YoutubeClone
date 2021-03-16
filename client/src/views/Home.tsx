import React from 'react';

import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';

import { useVideos } from '../hooks';
import VideoHomeCard from '../components/video/VideoHomeCard';
import { IVideo } from '../types/video';

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

const Home: React.FC = () => {
  const classes = useStyles();
  const { status, data, error } = useVideos();

  return (
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
  );
};

export default Home;
