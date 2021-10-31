import React, { useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';

import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Sort from '@material-ui/icons/Sort';

import { useIntersectionObserver } from '../../hooks';
import { api } from '../../api';
import { useAuthState } from '../../auth';
import VideoComment from '../comment/VideoComment';
import type { IPage, IVideoComment } from '../../types/models';

interface Props {
  videoId: string;
}

const CommentSection: React.FC<Props> = ({ videoId }) => {
  const queryClient = useQueryClient();
  const { isLogged, user } = useAuthState();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [content, setContent] = useState('');

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<IPage<IVideoComment>, Error>(
    ['video_comments', videoId],
    async ({ pageParam = 1 }) => {
      let page;

      if (typeof pageParam === 'number') page = pageParam;
      else if (typeof pageParam === 'string')
        page = pageParam.split('page=')[1];
      else page = pageParam;

      const { data } = await api.get('comments/', {
        params: {
          video: videoId,
          page,
        },
      });

      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.next ?? false,
    }
  );

  const loadMoreButtonRef = useRef<HTMLButtonElement | null>(null);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const commentMutation = useMutation(
    async (newComment: { video: string; content: string }) =>
      await api.post('comments/', newComment),
    {
      onSuccess: async () =>
        await queryClient.invalidateQueries(['video_comments', videoId]),
    }
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCommentCreation = async () => {
    if (!isLogged) return;

    await commentMutation.mutateAsync({
      video: videoId,
      content: content.trim(),
    });

    if (commentMutation.isSuccess) setContent('');
  };

  return (
    <>
      <Typography>
        {data ? data.pages[0].count : 'No'} Comments
        <Button startIcon={<Sort />} onClick={handleClick}>
          Sort by
        </Button>
      </Typography>
      <Menu
        id="sort-by-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={handleClose}>Top comments</MenuItem>
        <MenuItem onClick={handleClose}>Newest first</MenuItem>
      </Menu>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={user.avatar} imgProps={{ loading: 'lazy' }} />
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
                }}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={handleCommentCreation}>
                Comment
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        {status === 'loading' ? (
          <h1>loading...</h1>
        ) : status === 'error' ? (
          <h1>{error?.message || error}</h1>
        ) : (
          <>
            {data &&
              data.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.results.map(
                    ({
                      id,
                      content,
                      likes_count,
                      dislikes_count,
                      created_at,
                      author,
                    }) => (
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
              ref={loadMoreButtonRef}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              style={{ visibility: 'hidden' }}
            />
          </>
        )}
      </List>
    </>
  );
};

export default CommentSection;
