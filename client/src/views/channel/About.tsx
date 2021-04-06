import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Container, Divider, Grid, Typography } from '@material-ui/core';

interface Props {
  description: string;
  location: string;
  email: string;
  joinedDate: string;
}

const About: React.FC<Props> = ({
  description,
  location,
  email,
  joinedDate,
}: Props) => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item lg={8} md={7} sm={12}>
          <Typography>Description</Typography>
          <Typography>
            <ReactMarkdown plugins={[remarkGfm]}>{description}</ReactMarkdown>
            <Divider />
            <Typography>
              Details <br />
              Location: {location}
              <br />
              Email: {email}
            </Typography>
          </Typography>
        </Grid>
        <Grid item lg={4} md={5} sm={12}>
          <Typography>
            Stats
            <Divider />
            Joined {new Date(joinedDate).toLocaleDateString()}
            <Divider />
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
