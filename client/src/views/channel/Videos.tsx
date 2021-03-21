import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  Container,
  Grid,
  Typography,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';

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

import { useChannelVideos } from '../../hooks';
import { IVideo } from '../../types/video';
import VideoHomeCard from '../../components/video/VideoHomeCard';

const Videos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { status, data, error } = useChannelVideos(id);
  const classes = useStyles();

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
