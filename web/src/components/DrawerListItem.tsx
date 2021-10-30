import React from 'react';
import { Link } from 'react-router-dom';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

interface Props {
  to: string;
  icon: React.ReactNode;
  title: string;
}

const DrawerListItem: React.FC<Props> = ({ to, icon, title }) => {
  return (
    <ListItem button component={Link} to={to}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
};

export default DrawerListItem;
