import React from 'react';
import { Link as RRLink } from 'react-router-dom';

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  makeStyles,
  Theme,
  createStyles,
  Link,
  CardContent,
  Typography,
} from '@material-ui/core';

import timeDifference from '../../utils/timeDifference';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      margin: theme.spacing(1),
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
      lineHeight: '24px',
      marginLeft: theme.spacing(1),
    },
    ml: {
      marginLeft: theme.spacing(2),
    },
  })
);

interface Props {
  id: string;
  title: string;
  views: number;
  createdAt: Date | string;
  thumbnail: string;
  authorAvatar: string;
  authorId: string;
  authorName: string;
}

const VideoWatchItemCard: React.FC<Props> = ({
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
            subheader={
              <Box>
                <div style={{ display: 'inline-flex' }}>
                  <Avatar
                    aria-label={authorName}
                    src={authorAvatar}
                    style={{ width: '24px', height: '24px' }}
                  />
                  <Link
                    component={RRLink}
                    to={`/channel/${authorId}`}
                    color="inherit"
                    className={classes.channelName}
                  >
                    {authorName}
                  </Link>
                </div>
                <Typography variant="subtitle2" color="textSecondary">
                  {`${views} views · ${timeDifference(
                    now,
                    new Date(createdAt)
                  )}`}
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </div>
    </Card>
  );
};

export default VideoWatchItemCard;
