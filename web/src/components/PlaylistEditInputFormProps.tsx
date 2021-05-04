import React from 'react';

import {
  Button,
  createStyles,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';

import { IChannel } from '../types/channel';

const useStyles = makeStyles(() =>
  createStyles({
    formBtns: { float: 'right', margin: '10px 2px' },
  })
);

interface Props {
  isFormOpen: boolean;
  setIsFormOpen: (value: boolean) => void;
  label: string;
  displayValue: string;
  value: string;
  setValue: (value: string) => void;
  updateValue: () => Promise<void>;
  user: IChannel;
  data: any;
}

const PlaylistEditInputForm: React.FC<Props> = ({
  isFormOpen,
  setIsFormOpen,
  label,
  displayValue,
  value,
  setValue,
  updateValue,
  user,
  data,
}: Props) => {
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemText>
        {isFormOpen && user.id === data.author.id ? (
          <>
            <TextField
              label={label}
              required
              fullWidth
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
              }}
            />
            <div className={classes.formBtns}>
              <Button
                onClick={() => {
                  setIsFormOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={updateValue}>Save</Button>
            </div>
          </>
        ) : (
          <>{displayValue}</>
        )}
      </ListItemText>
      {!isFormOpen && user.id === data.author.id && (
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              setIsFormOpen(true);
            }}
          >
            <Edit />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default PlaylistEditInputForm;
