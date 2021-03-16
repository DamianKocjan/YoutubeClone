import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  GridList,
  GridListTile,
  GridListTileBar,
} from '@material-ui/core';

import { useChannelVideos } from '../../hooks';
import { IVideo } from '../../types/video';

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
  const { id } = useParams<{ id: string }>();
  const { status, data, error } = useChannelVideos(id);
  const classes = useStyles();
  const history = useHistory();

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
        <GridList className={classes.gridList} cols={2.5}>
          {status === 'loading' ? (
            <h1>loading...</h1>
          ) : status === 'error' ? (
            <h1>{error.message}</h1>
          ) : data.length > 0 ? (
            data.map(
              ({ title, id, created_at, thumbnail, duration }: IVideo) => (
                <GridListTile
                  key={id}
                  onClick={() => {
                    history.push(`/watch?v=${id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={thumbnail}
                    alt={title}
                    className={classes.thumbnail}
                  />
                  <GridListTileBar
                    title={title}
                    subtitle={new Date(created_at).toLocaleDateString()}
                    classes={{ root: classes.titleBar }}
                    actionIcon={
                      <Typography style={{ color: '#fff' }}>
                        {convertDuration(duration)}
                      </Typography>
                    }
                  />
                </GridListTile>
              )
            )
          ) : null}
        </GridList>
      </div>
    </>
  );
};

export default Home;
