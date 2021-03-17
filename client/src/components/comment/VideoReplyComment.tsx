import React from 'react';
import { Link } from 'react-router-dom';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import timeDifference from '../../utils/timeDifference';
import ReplyCommentRatingButtons from '../ratingButtons/ReplyComment';

interface Props {
  replyId: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: Date | string;
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
  return (
    <ListItem style={{ marginLeft: '40px' }}>
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
        <ReplyCommentRatingButtons
          replyComment={replyId}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
        />
        <IconButton>
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VideoComment;
