import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

import {
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  createStyles,
  Link,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  })
);

interface Props {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  thumbnail: string;
  authorAvatar: string;
  authorId: string;
  authorName: string;
}

const VideoHomeCard: React.FC<Props> = ({
  id,
  title,
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
      <CardMedia className={classes.media} image={thumbnail} title={title} />
      <CardHeader
        avatar={
          <Avatar
            aria-label={authorName}
            src={authorAvatar}
            imgProps={{ loading: 'lazy' }}
          />
        }
        title={
          <Link component={RRLink} to={`/watch?v=${id}`} color="inherit">
            {title}
          </Link>
        }
        subheader={
          <>
            <Link
              component={RRLink}
              to={`/channel/${authorId}`}
              color="inherit">
              {authorName}
            </Link>
            <br />
            {`${views} views - ${timeAgo.format(new Date(createdAt))}`}
          </>
        }
      />
    </Card>
  );
};

export default VideoHomeCard;
