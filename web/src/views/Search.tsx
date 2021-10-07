import React, { useRef } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Container } from '@material-ui/core';

import { useIntersectionObserver, useQuery } from '../hooks';
import VideoSearchCard from '../components/video/VideoSearchCard';
import type { IVideo } from '../types/models';
import { api } from '../api';

const Search: React.FC = () => {
  const query = useQuery().get('search_query') || '';

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

      const { data } = await api.get(`/videos/?page=${page}&search=${query}`);
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
    <>
      {!query || query.length < 1 ? (
        <h1>no query string</h1>
      ) : (
        <Container>
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
                        description,
                        views_count,
                        id,
                        created_at,
                        author,
                        thumbnail,
                      }: IVideo) => (
                        <VideoSearchCard
                          key={id}
                          title={title}
                          description={description}
                          id={id}
                          views={views_count}
                          createdAt={created_at}
                          authorName={author.username}
                          authorId={author.id}
                          authorAvatar={author.avatar}
                          thumbnail={thumbnail}
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
        </Container>
      )}
    </>
  );
};

export default Search;
