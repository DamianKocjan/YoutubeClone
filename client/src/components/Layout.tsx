/* eslint-disable prettier/prettier */
import clsx from 'clsx';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import {
  Apps as AppsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  VideoCall as VideoCallIcon,
  Home as HomeIcon,
  Whatshot as WhatshotIcon,
  Subscriptions as SubscriptionsIcon,
  VideoLibrary as VideoLibraryIcon,
  History as HistoryIcon,
  Slideshow as SlideshowIcon,
  WatchLater as WatchLaterIcon,
  ThumbUp as ThumbUpIcon,
  PlaylistPlay as PlaylistPlayIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';

import Logo from '../assets/logo.png';
import { logout, useAuthDispatch, useAuthState } from '../auth';
import { useSubscriptions } from '../hooks';
import { ISubscription } from '../types/subscription';

interface DrawerListItemProps {
  to: string;
  icon: React.ReactNode;
  title: string;
}

const DrawerListItem: React.FC<DrawerListItemProps> = ({
  to,
  icon,
  title,
}: DrawerListItemProps) => {
  return (
    <ListItem button component={Link} to={to}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
};

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    lineHeight: '100%',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

interface Props {
  children: React.ReactChild;
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(
    localStorage.getItem('drawerIsOpen')! === 'true' ? true : false
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = !!anchorEl;
  const dispatch = useAuthDispatch();
  const { isLogged, user } = useAuthState();
  const { status, data, error } = useSubscriptions(user.id);
  const [showMoreSubs, setShowMoreSubs] = useState<boolean>(false);

  const handleDrawerOpen = () => {
    setIsOpen(true);
    localStorage.setItem('drawerIsOpen', String(true));
  };
  const handleDrawerClose = () => {
    setIsOpen(false);
    localStorage.setItem('drawerIsOpen', String(false));
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    if (searchQuery.length > 0)
      history.push(`/search?search_query=${searchQuery}`);
  };

  const handleLogout = () => {
    logout(dispatch);
    history.push('/login/');
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, isOpen && classes.appBarShift)}
        color="inherit"
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              isOpen && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (history.location.pathname !== '/') history.push('/');
            }}
          >
            <img src={Logo} height="50" />
          </Typography>
          <Box
            style={{
              flexGrow: 1,
            }}
          />
          <div
            style={{
              flexGrow: 1,
              alignItems: 'center',
            }}
          >
            <InputBase
              className={classes.input}
              placeholder="Search Video"
              inputProps={{ 'aria-label': 'search videos' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(searchQuery.trim());
                  handleSearch();
                }
              }}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
          </div>
          <IconButton
            color="inherit"
            onClick={() => {
              history.push('/video/create');
            }}
          >
            <VideoCallIcon />
          </IconButton>
          <IconButton color="inherit">
            <AppsIcon />
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {isLogged ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuClick}
                color="inherit"
              >
                <Avatar src={user.avatar} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to={`/channel/${user.id}`}
                >
                  My channel
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleMenuClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login/">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !isOpen && classes.drawerPaperClose),
        }}
        open={isOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>
            <DrawerListItem to="/" icon={<HomeIcon />} title="Home" />
            <DrawerListItem to="/" icon={<WhatshotIcon />} title="Trending" />
            <DrawerListItem
              to="/"
              icon={<SubscriptionsIcon />}
              title="Subscriptions"
            />
          </div>
        </List>
        <Divider />
        <List>
          <div>
            <DrawerListItem
              to="/"
              icon={<VideoLibraryIcon />}
              title="Library"
            />
            <DrawerListItem to="/" icon={<HistoryIcon />} title="History" />
            <DrawerListItem
              to="/"
              icon={<SlideshowIcon />}
              title="Your videos"
            />
            <DrawerListItem
              to="/"
              icon={<WatchLaterIcon />}
              title="Watch later"
            />
            <DrawerListItem
              to="/"
              icon={<ThumbUpIcon />}
              title="Liked Videos"
            />
            {isOpen && (
              <>
                <DrawerListItem
                  to="/"
                  icon={<PlaylistPlayIcon />}
                  title="Random playlist"
                />
                <DrawerListItem
                  to="/"
                  icon={<ExpandMoreIcon />}
                  title="Show more"
                />
              </>
            )}
          </div>
        </List>
        {isOpen && isLogged && (
          <>
            <Divider />
            <List>
              <div>
                <ListSubheader color="inherit">Subscriptions</ListSubheader>
                {status === 'loading' ? (
                  <ListItem>
                    <ListItemAvatar>
                      <></>
                    </ListItemAvatar>
                    <ListItemText primary="loading..." />
                  </ListItem>
                ) : status === 'error' ? (
                  <ListItem>
                    <ListItemAvatar>
                      <></>
                    </ListItemAvatar>
                    <ListItemText primary={error.message} />
                  </ListItem>
                ) : (
                  <>
                    {showMoreSubs
                      ? data.map((sub: ISubscription) => (
                        <ListItem
                          key={sub.id}
                          onClick={() => {
                            history.push(`/channel/${sub.channel.id}`);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={sub.channel.avatar} />
                          </ListItemAvatar>
                          <ListItemText primary={sub.channel.username} />
                        </ListItem>
                      ))
                      : data.slice(0, 8).map((sub: ISubscription) => (
                        <ListItem
                          key={sub.id}
                          onClick={() => {
                            history.push(`/channel/${sub.channel.id}`);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={sub.channel.avatar} />
                          </ListItemAvatar>
                          <ListItemText primary={sub.channel.username} />
                        </ListItem>
                      ))}
                    {data.length - 7 > 0 && (
                      <ListItem
                        button
                        onClick={() => {
                          setShowMoreSubs(!showMoreSubs);
                        }}
                      >
                        <ListItemIcon>
                          {showMoreSubs ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            showMoreSubs
                              ? 'Show less'
                              : `Show ${data.length - 7} more`
                          }
                        />
                      </ListItem>
                    )}
                  </>
                )}
              </div>
            </List>
          </>
        )}
        <Divider />
        <List>
          <div>
            <DrawerListItem to="/" icon={<SettingsIcon />} title="Settings" />
          </div>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.container}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
