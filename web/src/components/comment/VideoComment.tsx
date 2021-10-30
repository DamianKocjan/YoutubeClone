import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

import {
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  AddComment,
  ExpandLess,
  ExpandMore,
  MoreVert,
} from '@material-ui/icons';

import { api } from '../../api';
import VideoReplyComment from './VideoReplyComment';
import type { IPage, IVideoReplyComment } from '../../types/models';
import CommentRatingButtons from '../ratingButtons/Comment';
import { useIntersectionObserver } from '../../hooks';
import { useAuthState } from '../../auth';

interface Props {
  commentId: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  authorId: string;
  authorUsername: string;
  authorAvatar: string;
}

const VideoComment: React.FC<Props> = ({
  commentId,
  content,
  likesCount,
  dislikesCount,
  createdAt,
  authorId,
  authorUsername,
  authorAvatar,
}) => {
  const queryClient = useQueryClient();

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<IPage<IVideoReplyComment>, Error>(
    ['video_reply_comments', commentId],
    async ({ pageParam = 1 }) => {
      let page;

      if (typeof pageParam === 'number') page = pageParam;
      else if (typeof pageParam === 'string')
        page = pageParam.split('page=')[1];
      else page = pageParam;

      const { data } = await api.get(
        `reply-comments/?comment=${commentId}&page=${page}`
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

  const [showReplies, setShowReplies] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const [showButtons, setShowButtons] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { isLogged, user } = useAuthState();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const commentUpdateMutation = useMutation(
    async (comment: { content: string }) =>
      await api.patch(`comments/${commentId}`, comment),
    {
      onSuccess: async () =>
        await queryClient.invalidateQueries(['video_comments', commentId]),
    }
  );

  const handleEdit = async () => {
    if (!isLogged || user.id !== authorId) return;

    let content = prompt() || '';

    if (content) content = content.trim();
    else content = '';

    if (content && content.length > 0)
      await commentUpdateMutation.mutateAsync({
        content: content,
      });
  };

  const commentDeleteMutation = useMutation(
    async () => await api.delete(`comments/${commentId}`),
    {
      onSuccess: async () =>
        await queryClient.invalidateQueries(['video_comments', commentId]),
    }
  );

  const handleDelete = async () => {
    if (!isLogged || user.id !== authorId) return;

    let content =
      prompt(
        'Are you sure you want to delete that comment? Type y if you want.'
      ) || '';

    if (content) content = content.trim();
    else content = '';

    if (content && content === 'y') await commentDeleteMutation.mutateAsync();
  };

  const replyCommentMutation = useMutation(
    async (newReplyComment: { comment: string; content: string }) =>
      await api.post('reply-comments', newReplyComment),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'video_reply_comments',
          commentId,
        ]);

        setReplyContent('');
        setShowForm(false);
      },
    }
  );

  const handleCommentCreation = async () => {
    if (!isLogged) return;

    await replyCommentMutation.mutateAsync({
      comment: commentId,
      content: replyContent.trim(),
    });
  };

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={authorAvatar} imgProps={{ loading: 'lazy' }} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              <Link to={`/channel/${authorId}/`}>{authorUsername}</Link>{' '}
              {timeAgo.format(new Date(createdAt))}
            </Typography>
          }
          secondary={<Typography variant="inherit">{content}</Typography>}
        />
        <ListItemSecondaryAction>
          {status !== 'error' && !error && data && data.pages[0].count > 0 && (
            <IconButton
              onClick={() => {
                setShowReplies(!showReplies);
                if (showReplies === false) setShowForm(false);
              }}>
              {showReplies ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              setShowForm(true);
            }}>
            <AddComment />
          </IconButton>
          <CommentRatingButtons
            comment={commentId}
            likesCount={likesCount}
            dislikesCount={dislikesCount}
          />
          {user.id === authorId && (
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      {user.id === authorId && (
        <Menu
          id="comment-actions-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose();
              handleEdit();
            }}>
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              handleDelete();
            }}>
            Delete
          </MenuItem>
        </Menu>
      )}
      {showForm && (
        <ListItem style={{ marginLeft: '40px' }}>
          <ListItemAvatar>
            <></>
          </ListItemAvatar>
          <ListItemText>
            <TextField
              placeholder="Add a public comment..."
              fullWidth
              onFocus={() => {
                setShowButtons(true);
              }}
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
              }}
            />
          </ListItemText>
          {showButtons && (
            <ListItemSecondaryAction>
              <Button
                onClick={() => {
                  setShowButtons(false);
                  setReplyContent('');
                  setShowForm(false);
                }}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={handleCommentCreation}>
                Comment
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      )}
      {showReplies &&
        (status === 'loading' ? (
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
                      <VideoReplyComment
                        key={id}
                        replyId={id}
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
              ref={loadMoreVideosButtonRef}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              style={{ visibility: 'hidden' }}
            />
          </>
        ))}
    </>
  );
};

export default VideoComment;
