import React from 'react';

import { Container } from '@material-ui/core';

import { useQuery, useVideos } from '../hooks';
import VideoSearchCard from '../components/video/VideoSearchCard';
import { IVideo } from '../types/video';

const Search: React.FC = () => {
  const query = useQuery().get('search_query') || '';
  const { status, data, error } = useVideos(query);

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
            data.length > 0 &&
            data.map(
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
            )
          )}
        </Container>
      )}
    </>
  );
};

export default Search;
