import React, { useEffect, useState } from 'react';
import { Link as RRLink, useHistory } from 'react-router-dom';

import {
  Avatar,
  Button,
  Container,
  Grid,
  Link,
  makeStyles,
  TextField,
  Theme,
  Typography,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import axiosInstance from '../utils/axiosInstance';
import { useAuthState } from '../auth';

const useStyles = makeStyles((theme: Theme) => ({
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp: React.FC = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState<string>('');
  const [errorAlertIsOpen, setErrorAlertIsOpen] = useState<boolean>(false);
  const classes = useStyles();
  const history = useHistory();
  const { isLogged } = useAuthState();

  useEffect(() => {
    if (isLogged) {
      try {
        history.goBack();
      } catch {
        history.push('/');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpDetails({
      ...signUpDetails,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    axiosInstance
      .post('/signup/', signUpDetails)
      .then(() => {
        history.push('/login/');
      })
      .catch((err) => {
        let error = '';
        for (const el in err.response.data) {
          if (el === 'detail') {
            error = err.response.data[el];
          } else {
            const name = el.charAt(0).toUpperCase() + el.slice(1);
            error = `${name}: ${err.response.data[el]?.join()}`;
          }
          break;
        }

        setError(error);
        setErrorAlertIsOpen(true);
      });
  };

  const handleCloseAlert = (): void => {
    setErrorAlertIsOpen(false);
  };

  const isDisabled =
    signUpDetails.first_name.length === 0 ||
    signUpDetails.last_name.length === 0 ||
    signUpDetails.username.length === 0 ||
    signUpDetails.password.length === 0 ||
    signUpDetails.password2.length === 0 ||
    signUpDetails.password !== signUpDetails.password2;

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first_name"
                variant="outlined"
                required
                fullWidth
                id="first_name"
                label="First Name"
                autoFocus
                onChange={handleChange}
                value={signUpDetails.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="lname"
                onChange={handleChange}
                value={signUpDetails.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={handleChange}
                value={signUpDetails.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={signUpDetails.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={signUpDetails.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Password (Confirm)"
                type="password"
                id="password2"
                autoComplete="current-password2"
                onChange={handleChange}
                value={signUpDetails.password2}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isDisabled}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RRLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Snackbar
        open={errorAlertIsOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity="error"
        >
          {JSON.stringify(error)}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
