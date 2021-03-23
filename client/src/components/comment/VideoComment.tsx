import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';

import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  AddComment,
  ExpandLess,
  ExpandMore,
  MoreVert,
} from '@material-ui/icons';

import axiosInstance from '../../utils/axiosInstance';
import timeDifference from '../../utils/timeDifference';
import VideoReplyComment from './VideoReplyComment';
import { IVideoReplyComment } from '../../types/videoReplyComment';
import CommentRatingButtons from '../ratingButtons/Comment';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
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
}: Props) => {
  const queryClient = useQueryClient();
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, any>(
    ['video_reply_comments', commentId],
    async ({ pageParam = 1 }) => {
      let page;

      if (typeof pageParam === 'number') page = pageParam;
      else if (typeof pageParam === 'string')
        page = pageParam.split('page=')[1];
      else page = pageParam;

      const { data } = await axiosInstance.get(
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

  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isLogged } = useAuthState();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const commentUpdateMutation = useMutation(
    (comment: { content: string }) =>
      axiosInstance.patch(`comments/${commentId}/`, comment),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['video_comments', commentId]),
    }
  );

  const handleEdit = () => {
    if (!isLogged) return;
    let content = prompt()!;

    if (content) content = content.trim();
    else content = '';

    if (content && content.length > 0)
      commentUpdateMutation.mutate({
        content: content,
      });
  };

  const commentDeleteMutation = useMutation(
    () => axiosInstance.delete(`comments/${commentId}/`),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['video_comments', commentId]),
    }
  );

  const handleDelete = () => {
    if (!isLogged) return;
    let content = prompt(
      'Are you sure you want to delete that comment? Type y if you want.'
    )!;

    if (content) content = content.trim();
    else content = '';

    if (content && content === 'y') commentDeleteMutation.mutate();
  };

  const replyCommentMutation = useMutation(
    (newReplyComment: { comment: string; content: string }) =>
      axiosInstance.post('reply-comments/', newReplyComment),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['video_reply_comments', commentId]),
    }
  );

  const handleCommentCreation = () => {
    replyCommentMutation.mutate({
      comment: commentId,
      content: replyContent.trim(),
    });

    if (replyCommentMutation.isSuccess) {
      setReplyContent('');
      setShowForm(false);
    }
  };

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={authorAvatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              <Link to={`/channel/${authorId}/`}>{authorUsername}</Link>{' '}
              {timeDifference(new Date(), new Date(createdAt))}
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
              }}
            >
              {showReplies ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              setShowForm(true);
            }}
          >
            <AddComment />
          </IconButton>
          <CommentRatingButtons
            comment={commentId}
            likesCount={likesCount}
            dislikesCount={dislikesCount}
          />
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Menu
        id="comment-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            handleEdit();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            handleDelete();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
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
                }}
              >
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
          <h1>{error.message}</h1>
        ) : (
          <>
            {data &&
              data.pages.map((page: any) => (
                <React.Fragment key={page.nextId}>
                  {page.results.map((reply: IVideoReplyComment) => (
                    <VideoReplyComment
                      key={reply.id}
                      replyId={reply.id}
                      content={reply.content}
                      likesCount={reply.likes_count}
                      dislikesCount={reply.dislikes_count}
                      createdAt={reply.created_at}
                      authorId={reply.author.id}
                      authorUsername={reply.author.username}
                      authorAvatar={reply.author.avatar}
                    />
                  ))}
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
