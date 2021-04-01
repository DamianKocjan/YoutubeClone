import React, { useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
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
    videoContainer: {
      position: 'relative',
      maxWidth: '100%',
      maxHeight: '500px',
    },
    videoPlayer: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
  })
);

const VideoCreate: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const mutation = useMutation(
    async (newVideo: FormData) => await axiosInstance.post('videos/', newVideo)
  );

  const { isLogged } = useAuthState();

  const thumbnailRef = useRef<HTMLElement | any>();
  const videoRef = useRef<HTMLElement | any>();

  const [hasUploadedVideo, setHasUploadedVideo] = useState<boolean>(false);
  const [hasUploadedThumbnail, setHasUploadedThumbnail] = useState<boolean>(
    false
  );

  if (!isLogged) return <Redirect to="/login/" />;

  const handleSubmit = (e: any) => {
    if (!isLogged) return;
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('duration', '1');

    mutation.mutate(formData);

    if (mutation.isSuccess && mutation.isError === false)
      history.push(`/watch?v=${'id'}`);
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const thumbnail = e.target.files![0];
    const reader = new FileReader();

    if (thumbnail) {
      setHasUploadedThumbnail(true);
      reader.onload = (e: any) => {
        thumbnailRef.current.src = e.target.result;
      };

      reader.readAsDataURL(thumbnail);
    }
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = e.target.files![0];

    if (video) {
      setHasUploadedVideo(true);
      const fileUrl = URL.createObjectURL(video);
      videoRef.current.src = fileUrl;
      // videoRef.current.load();
    }
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
                onChange={handleThumbnail}
              />
            </Button>
            {hasUploadedThumbnail && (
              <>
                <br />
                <img ref={thumbnailRef} width="200" height="200" />
                <br />
              </>
            )}
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
              <input
                type="file"
                hidden
                accept="video/mp4"
                name="video"
                onChange={handleVideo}
              />
            </Button>
            {hasUploadedVideo && (
              <div className={classes.videoContainer}>
                <video ref={videoRef} className={classes.videoPlayer} />
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </form>
  );
};

export default VideoCreate;
