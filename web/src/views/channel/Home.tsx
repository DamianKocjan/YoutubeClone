import React from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  createStyles,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { useChannelVideos } from '../../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.3) 100%)',
    },
    thumbnail: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  })
);

const Home: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();
  const { status, data, error } = useChannelVideos(id);

  const convertDuration = (seconds: number): string => {
    if (!seconds) return '';

    let duration = seconds;
    const hours = duration / 3600;
    duration = duration % 3600;

    const min = Math.round(duration / 60);
    duration = duration % 60;

    const sec = Math.round(duration);

    let textSec = String(sec);
    if (sec < 10) {
      textSec = `0${sec}`;
    }

    let textMin = String(sec);
    if (min < 10) {
      textMin = `0${min}`;
    }

    if (Math.round(hours) > 0) {
      return `${Math.round(hours)}h ${textMin}m ${textSec}s`;
    } else if (min == 0) {
      return `${textSec}s`;
    } else {
      return `${textMin}m ${textSec}s`;
    }
  };

  return (
    <>
      <Typography variant="h5">Uploads</Typography>
      <div className={classes.root}>
        <ImageList className={classes.gridList} cols={2.5}>
          {status === 'loading' ? (
            <h1>loading...</h1>
          ) : status === 'error' ? (
            <h1>{error?.message || error}</h1>
          ) : (
            data &&
            data.map(({ title, id, created_at, thumbnail, duration }) => (
              <ImageListItem component={Link} to={`/watch?v=${id}`} key={id}>
                <img
                  loading="lazy"
                  src={thumbnail}
                  alt={title}
                  className={classes.thumbnail}
                />
                <ImageListItemBar
                  title={title}
                  subtitle={new Date(created_at).toLocaleDateString()}
                  classes={{ root: classes.titleBar }}
                  actionIcon={
                    <Typography style={{ color: '#fff' }}>
                      {convertDuration(duration)}
                    </Typography>
                  }
                />
              </ImageListItem>
            ))
          )}
        </ImageList>
      </div>
    </>
  );
};

export default Home;
