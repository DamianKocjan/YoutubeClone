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

interface Props {
  content: string;
  createdAt: Date | string;
  authorId: string;
  authorUsername: string;
  authorAvatar: string;
}

const VideoComment: React.FC<Props> = ({
  content,
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
        <IconButton>
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VideoComment;
