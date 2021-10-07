import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import ReplyCommentRatingButtons from '../ratingButtons/ReplyComment';
import { useAuthState } from '../../auth';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../api';

interface Props {
  replyId: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  authorId: string;
  authorUsername: string;
  authorAvatar: string;
}

const VideoComment: React.FC<Props> = ({
  replyId,
  content,
  likesCount,
  dislikesCount,
  createdAt,
  authorId,
  authorUsername,
  authorAvatar,
}: Props) => {
  const queryClient = useQueryClient();

  const { isLogged, user } = useAuthState();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const commentUpdateMutation = useMutation(
    async (comment: { content: string }) =>
      await api.patch(`reply-comments/${replyId}/`, comment),
    {
      onSuccess: async () =>
        await queryClient.invalidateQueries(['video_reply_comments', replyId]),
    }
  );

  const handleEdit = async () => {
    if (!isLogged || user.id !== authorId) return;

    let content = prompt()!;

    if (content) content = content.trim();
    else content = '';

    if (content && content.length > 0)
      await commentUpdateMutation.mutateAsync({
        content: content,
      });
  };

  const commentDeleteMutation = useMutation(
    async () => await api.delete(`reply-comments/${replyId}/`),
    {
      onSuccess: async () =>
        await queryClient.invalidateQueries(['video_reply_comments', replyId]),
    }
  );

  const handleDelete = async () => {
    if (!isLogged || user.id !== authorId) return;

    let content = prompt(
      'Are you sure you want to delete that comment? Type y if you want.'
    )!;

    if (content) content = content.trim();
    else content = '';

    if (content && content === 'y') await commentDeleteMutation.mutateAsync();
  };

  return (
    <ListItem style={{ marginLeft: '40px' }}>
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
        <ReplyCommentRatingButtons
          replyComment={replyId}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
        />
        {user.id === authorId && (
          <>
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
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
          </>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VideoComment;
