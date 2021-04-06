import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

import timeDifference from '../../utils/timeDifference';
import ReplyCommentRatingButtons from '../ratingButtons/ReplyComment';
import { useAuthState } from '../../auth';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../utils/axiosInstance';

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
      await axiosInstance.patch(`reply-comments/${replyId}/`, comment),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['video_reply_comments', replyId]),
    }
  );

  const handleEdit = () => {
    if (!isLogged || user.id !== authorId) return;

    let content = prompt()!;

    if (content) content = content.trim();
    else content = '';

    if (content && content.length > 0)
      commentUpdateMutation.mutate({
        content: content,
      });
  };

  const commentDeleteMutation = useMutation(
    async () => await axiosInstance.delete(`reply-comments/${replyId}/`),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['video_reply_comments', replyId]),
    }
  );

  const handleDelete = () => {
    if (!isLogged || user.id !== authorId) return;

    let content = prompt(
      'Are you sure you want to delete that comment? Type y if you want.'
    )!;

    if (content) content = content.trim();
    else content = '';

    if (content && content === 'y') commentDeleteMutation.mutate();
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
            {timeDifference(new Date(), new Date(createdAt))}
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
          </>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VideoComment;
