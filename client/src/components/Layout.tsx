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
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Apps as AppsIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  PlaylistPlay as PlaylistPlayIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Slideshow as SlideshowIcon,
  Subscriptions as SubscriptionsIcon,
  ThumbUp as ThumbUpIcon,
  VideoCall as VideoCallIcon,
  VideoLibrary as VideoLibraryIcon,
  WatchLater as WatchLaterIcon,
  Whatshot as WhatshotIcon,
} from '@material-ui/icons';

import Logo from '../assets/logo.png';
import { logout, useAuthDispatch, useAuthState } from '../auth';
import { useSubscriptions } from '../hooks';
import { ISubscription } from '../types/subscription';
import { IPlaylist } from '../types/playlist';
import { useUserLibrary } from '../hooks/useLibrary';

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
    minHeight: '100vh',
    maxHeight: '100vh',
    overflowY: 'scroll',
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
  searchContainer: {
    flexGrow: 1,
    alignItems: 'center',
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

  const {
    status: subscriptionsStatus,
    data: subscriptionsData,
    error: subscriptionsError,
  } = useSubscriptions(user.id);
  const [showMoreSubs, setShowMoreSubs] = useState<boolean>(false);

  const {
    status: userLibraryStatus,
    data: userLibraryData,
    error: userLibraryError,
  } = useUserLibrary(user.id);
  const [showMorePlaylists, setShowMorePlaylists] = useState<boolean>(false);

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

  const handleLogout = async () => {
    await logout(dispatch);
    history.push('/login/');
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
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
          >
            <Link to="/">
              <img src={Logo} height="50" />
            </Link>
          </Typography>
          <Box
            style={{
              flexGrow: 1,
            }}
          />
          <div className={classes.searchContainer}>
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
          <IconButton color="inherit" component={Link} to="/video/create">
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
                <Avatar src={user.avatar} imgProps={{ loading: 'lazy' }} />
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
            {isOpen &&
              isLogged &&
              (userLibraryStatus === 'loading' ? (
                <ListItem>
                  <ListItemAvatar>
                    <></>
                  </ListItemAvatar>
                  <ListItemText primary="loading..." />
                </ListItem>
              ) : userLibraryStatus === 'error' ? (
                <ListItem>
                  <ListItemAvatar>
                    <></>
                  </ListItemAvatar>
                  <ListItemText primary={userLibraryError.message} />
                </ListItem>
              ) : (
                <>
                  {showMorePlaylists
                    ? userLibraryData.playlists.map(({ id, title }: IPlaylist) => (
                      <DrawerListItem
                        key={id}
                        to={`/playlist/${id}`}
                        icon={<PlaylistPlayIcon />}
                        title={title}
                      />
                    ))
                    : userLibraryData
                      .playlists
                      .slice(0, 8)
                      .map(({ id, title }: IPlaylist) => (
                        <DrawerListItem
                          key={id}
                          to={`/playlist/${id}`}
                          icon={<PlaylistPlayIcon />}
                          title={title}
                        />
                      ))}
                  {userLibraryData.playlists.length - 7 > 0 && (
                    <ListItem
                      button
                      onClick={() => {
                        setShowMorePlaylists(!showMorePlaylists);
                      }}
                    >
                      <ListItemIcon>
                        {showMorePlaylists ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          showMorePlaylists
                            ? 'Show less'
                            : `Show ${userLibraryData.playlists.length - 7} more`
                        }
                      />
                    </ListItem>
                  )}
                </>
              ))}
          </div>
        </List>
        {isOpen && isLogged && (
          <>
            <Divider />
            <List>
              <div>
                <ListSubheader color="inherit">Subscriptions</ListSubheader>
                {subscriptionsStatus === 'loading' ? (
                  <ListItem>
                    <ListItemAvatar>
                      <></>
                    </ListItemAvatar>
                    <ListItemText primary="loading..." />
                  </ListItem>
                ) : subscriptionsStatus === 'error' ? (
                  <ListItem>
                    <ListItemAvatar>
                      <></>
                    </ListItemAvatar>
                    <ListItemText primary={subscriptionsError.message} />
                  </ListItem>
                ) : (
                  <>
                    {showMoreSubs
                      ? subscriptionsData.map(
                        ({ id, channel }: ISubscription) => (
                          <ListItem
                            key={id}
                            onClick={() => {
                              history.push(`/channel/${channel.id}`);
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={channel.avatar} imgProps={{ loading: 'lazy' }} />
                            </ListItemAvatar>
                            <ListItemText primary={channel.username} />
                          </ListItem>
                        )
                      )
                      : subscriptionsData
                        .slice(0, 8)
                        .map(({ id, channel }: ISubscription) => (
                          <ListItem
                            key={id}
                            onClick={() => {
                              history.push(`/channel/${channel.id}`);
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={channel.avatar} imgProps={{ loading: 'lazy' }} />
                            </ListItemAvatar>
                            <ListItemText primary={channel.username} />
                          </ListItem>
                        ))}
                    {subscriptionsData.length - 7 > 0 && (
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
                              : `Show ${subscriptionsData.length - 7} more`
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
