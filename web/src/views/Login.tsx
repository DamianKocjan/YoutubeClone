import React, { useEffect, useState } from 'react';
import { Link as RRLink, useHistory } from 'react-router-dom';

import {
  Avatar,
  Button,
  Container,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Snackbar,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { loginUser, useAuthDispatch, useAuthState } from '../auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

const Login: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [errorAlertIsOpen, setErrorAlertIsOpen] = useState<boolean>(false);

  const dispatch = useAuthDispatch();
  const { isLogged, loading, errorMessage } = useAuthState();

  useEffect(() => {
    if (isLogged) {
      try {
        history.goBack();
      } catch {
        history.push('/');
      }
    }
  }, []);

  useEffect(() => {
    if (isLogged) {
      try {
        history.goBack();
      } catch {
        history.push('/');
      }
    }
  }, [isLogged]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await loginUser(dispatch, loginDetails);

      if (errorMessage) {
        setError(errorMessage);
        setErrorAlertIsOpen(true);
      }

      if (!res) return;
    } catch (err) {
      setError(err as string);
      setErrorAlertIsOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setErrorAlertIsOpen(false);
  };

  const isDisabled =
    loginDetails.username.length === 0 ||
    loginDetails.password.length === 0 ||
    loading;

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={handleChange}
            value={loginDetails.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={loginDetails.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isDisabled}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RRLink} to="/signup" variant="body2">
                Don&#39;t have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Snackbar
        open={errorAlertIsOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity="error">
          {error}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Login;
