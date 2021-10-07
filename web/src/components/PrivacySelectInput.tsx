import React from 'react';

import {
  createStyles,
  FormControl,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme,
  Select,
} from '@material-ui/core';
import { Public, Link, Lock } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

interface Props {
  value: string;
  handleChange: (
    event: React.ChangeEvent<{ value: unknown }>
  ) => Promise<void> | void;
}

const PrivacySelectInput: React.FC<Props> = ({
  value,
  handleChange,
}: Props) => {
  const classes = useStyles();

  return (
    <FormControl fullWidth className={classes.input}>
      <Select
        label="Privacy"
        value={value}
        onChange={handleChange}
        renderValue={(value) => `${value}`}
        fullWidth>
        <MenuItem value="Public">
          <ListItemIcon>
            <Public />
          </ListItemIcon>
          <ListItemText
            primary="Public"
            secondary="Anyone can search for and view"
          />
        </MenuItem>
        <MenuItem value="Unlisted">
          <ListItemIcon>
            <Link />
          </ListItemIcon>
          <ListItemText
            primary="Unlisted"
            secondary="Anyone with the link can view"
          />
        </MenuItem>
        <MenuItem value="Private">
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText primary="Private" secondary="Only you can view" />
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default PrivacySelectInput;
