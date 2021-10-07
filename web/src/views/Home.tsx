import React, { useRef } from 'react';
import { useInfiniteQuery } from 'react-query';

import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';

import VideoHomeCard from '../components/video/VideoHomeCard';
import type { IVideo } from '../types/models';
import { useIntersectionObserver } from '../hooks';
import { api } from '../api';

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

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, any>(
    'videos',
    async ({ pageParam = 1 }) => {
      let page;

      if (typeof pageParam === 'number') page = pageParam;
      else if (typeof pageParam === 'string')
        page = pageParam.split('page=')[1];
      else page = pageParam;

      const { data } = await api.get(`/videos/?page=${page}`);
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

  return (
    <Container>
      <Grid container spacing={3}>
        {status === 'loading' ? (
          <h1>loading...</h1>
        ) : status === 'error' ? (
          <h1>{error.message}</h1>
        ) : (
          <>
            {data &&
              data.pages.map((page: any) => (
                <React.Fragment key={page.nextId}>
                  {page.results.map(
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
                        className={(classes.paper, classes.spacing)}>
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
      </Grid>
    </Container>
  );
};

export default Home;
