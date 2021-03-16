import React from 'react';

import {
  Box,
  Container,
  Typography,
  makeStyles,
  Theme,
} from '@material-ui/core';

import PageNotFoundImage from '../assets/undraw_page_not_found_su7k.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560,
  },
}));

const NotFound: React.FC = () => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      className={classes.root}
    >
      <Container maxWidth="md">
        <Typography align="center" color="textPrimary" variant="h1">
          404: The page you are looking for isn’t here
        </Typography>
        <Typography align="center" color="textPrimary" variant="subtitle2">
          You either tried some shady route or you came here by mistake.
          Whichever it is, try using the navigation
        </Typography>
        <Box textAlign="center">
          <img
            alt="Under development"
            className={classes.image}
            src={PageNotFoundImage}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
