import React from 'react';
import { useHistory, Redirect } from 'react-router';
import { useMutation } from 'react-query';

import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import MovieIcon from '@material-ui/icons/Movie';

import axiosInstance from '../utils/axiosInstance';
import { useAuthState } from '../auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    spacing: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);

const VideoCreate: React.FC = () => {
  const classes = useStyles();
  const mutation = useMutation((newVideo: any) =>
    axiosInstance.post('videos/', newVideo)
  );
  const history = useHistory();
  const { isLogged } = useAuthState();

  if (!isLogged) return <Redirect to="/login/" />;

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('duration', '1');

    mutation.mutate(formData);

    if (mutation.isSuccess && mutation.isError === false)
      history.push(`/watch?v=${'id'}`);
  };

  const error = mutation.error as any;

  return (
    <form
      className={classes.root}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      method="POST"
      action=""
    >
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4" align="left">
              Details
            </Typography>
            <TextField
              label="Title (required)"
              placeholder="Add a title that describes your video"
              required
              fullWidth
              className={classes.spacing}
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              name="title"
            />
            <TextField
              label="Description"
              placeholder="Tell viewers about your video"
              fullWidth
              multiline
              rows={4}
              className={classes.spacing}
              InputProps={{ inputProps: { min: 0, max: 5000 } }}
              name="description"
            />
            <Typography variant="h6" align="left">
              Thumbnail
            </Typography>
            <Typography align="left">
              Select or upload a picture that shows what&#39;s in your video. A
              good thumbnail stands out and draws viewers&#39; attention.
            </Typography>
            <Button
              variant="contained"
              component="label"
              className={classes.button}
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload thumbnail
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg.,.jfif,.pjpeg,.pjp,.png"
                name="thumbnail"
              />
            </Button>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Creating video...' : 'Create Video'}
            </Button>
            <Typography>
              {mutation.isError ? (
                <div>An error occurred: {error.message}</div>
              ) : null}

              {mutation.isSuccess ? <div>Video added!</div> : null}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Button
              variant="contained"
              component="label"
              className={classes.button}
              startIcon={<MovieIcon />}
            >
              Upload video
              <input type="file" hidden accept="video/mp4" name="video" />
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </form>
  );
};

export default VideoCreate;
