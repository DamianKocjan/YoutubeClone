import React from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  createStyles,
  GridList,
  GridListTile,
  GridListTileBar,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { usePlaylists } from '../../hooks';

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

const Playlists: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();
  const { status, data, error } = usePlaylists(id);

  return (
    <>
      <Typography variant="h5">Uploads</Typography>
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={2.5}>
          {status === 'loading' ? (
            <h1>loading...</h1>
          ) : status === 'error' ? (
            <h1>{error?.message || error}</h1>
          ) : data?.results?.length ? (
            data?.results.map(({ title, id, videos, created_at }) => (
              <GridListTile component={Link} to={`/playlist/${id}`} key={id}>
                <img
                  loading="lazy"
                  src={videos[0].video.thumbnail}
                  alt={title}
                  className={classes.thumbnail}
                />
                <GridListTileBar
                  title={title}
                  subtitle={new Date(created_at).toLocaleDateString()}
                  classes={{ root: classes.titleBar }}
                />
              </GridListTile>
            ))
          ) : null}
        </GridList>
      </div>
    </>
  );
};

export default Playlists;
