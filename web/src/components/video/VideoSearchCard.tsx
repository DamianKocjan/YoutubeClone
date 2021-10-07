import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      maxWidth: '50%',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: '16rem',
    },
    channelName: {
      lineHeight: '40px',
      marginLeft: theme.spacing(1),
    },
  })
);

interface Props {
  id: string;
  title: string;
  description: string;
  views: number;
  createdAt: string;
  thumbnail: string;
  authorAvatar?: string;
  authorId: string;
  authorName: string;
}

const VideoSearchCard: React.FC<Props> = ({
  id,
  title,
  description,
  views,
  createdAt,
  thumbnail,
  authorAvatar,
  authorId,
  authorName,
}: Props) => {
  const classes = useStyles();

  const now = new Date();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={thumbnail}
        title={title}
        component={RRLink}
        to={`/watch?v=${id}`}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <CardHeader
            title={
              <Link component={RRLink} color="inherit" to={`/watch?v=${id}`}>
                {title}
              </Link>
            }
            subheader={`${views} views · ${timeAgo.format(
              new Date(createdAt)
            )}`}
          />
          <div style={{ display: 'inline-flex' }}>
            <Avatar aria-label={authorName} src={authorAvatar} />
            <Link
              component={RRLink}
              to={`/channel/${authorId}`}
              color="inherit"
              className={classes.channelName}>
              {authorName}
            </Link>
          </div>
          <Typography>
            {description.length > 100
              ? description.substring(0, 100) + '...'
              : description}
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
};

export default VideoSearchCard;
