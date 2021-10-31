import clsx from 'clsx';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  createStyles,
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
} from '@material-ui/core';
import {
  Apps as AppsIcon,
  ChevronLeft as ChevronLeftIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
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
import DrawerListItem from './DrawerListItem';
import Subscriptions from './Subscriptions';
import UserLibrary from './UserLibrary';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      position: 'fixed',
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
    container1: {
      marginLeft: drawerWidth,
      transition: theme.transitions.create('margin-left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    container2: {
      marginLeft: theme.spacing(9),
      transition: theme.transitions.create('margin-left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  })
);

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(
    localStorage.getItem('drawerIsOpen') === 'true' ? true : false
  );

  const [searchQuery, setSearchQuery] = useState('');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = !!anchorEl;

  const dispatch = useAuthDispatch();
  const { isLogged, user } = useAuthState();

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
    setSearchQuery(searchQuery.trim());

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
        color="inherit">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              isOpen && classes.menuButtonHidden
            )}>
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}>
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
              onClick={handleSearch}>
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
                color="inherit">
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
                onClose={handleMenuClose}>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to={`/channel/${user.id}`}>
                  My channel
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleMenuClose();
                  }}>
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
        open={isOpen}>
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
            {[
              { to: '/', icon: <VideoLibraryIcon />, title: 'Library' },
              { to: '/', icon: <HistoryIcon />, title: 'History' },
              { to: '/', icon: <SlideshowIcon />, title: 'Your videos' },
              { to: '/', icon: <WatchLaterIcon />, title: 'Watch later' },
              { to: '/', icon: <ThumbUpIcon />, title: 'Liked Videos' },
            ].map((el) => (
              <DrawerListItem
                key={el.title}
                to={el.to}
                icon={el.icon}
                title={el.title}
              />
            ))}
            <UserLibrary isLogged={isLogged} user={user} isOpen={isOpen} />
          </div>
        </List>
        <Subscriptions isLogged={isLogged} user={user} isOpen={isOpen} />
        <List>
          <div>
            <DrawerListItem to="/" icon={<SettingsIcon />} title="Settings" />
          </div>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={clsx(isOpen ? classes.container1 : classes.container2)}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
