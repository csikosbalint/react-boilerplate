import React, { useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import Skeleton from '@material-ui/lab/Skeleton';

import Carousel from 'react-material-ui-carousel';
import {
  GridList,
  Card,
  CardMedia,
  GridListTile,
  GridListTileBar,
} from '@material-ui/core';

import { Container, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

const themeMuiContainer = createMuiTheme({
  overrides: {
    MuiContainer: {
      root: {
        // backgroundColor: 'lightblue',
      },
    },
  },
});

export default function Main(props) {
  const appBarStyles = makeStyles((theme) => ({
    container: {
      flexGrow: 1,
      height: 'inherit',
      minHeight: 'inherit',
    },
    appbar: {
      marginBottom: theme.spacing(2),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    // PAPER
    paper: {
      height: 140,
      width: 200,
    },
    // SEARCH
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '-webkit-fill-available !important',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    // PRODS
    media: {
      height: 0,
      paddingTop: '36.25%',
    },
    // RECOMMENDATION
    gridRoot: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    gridTitle: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  }));
  const classes = appBarStyles();
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const tileData = [
    {
      img: 'https://via.placeholder.com/240x120.png?text=Recomm1',
      title: 'Image',
      author: 'author',
    },
    {
      img: 'https://via.placeholder.com/240x120.png?text=Recomm2',
      title: 'Image',
      author: 'author',
    },
    {
      img: 'https://via.placeholder.com/240x120.png?text=Recomm3',
      title: 'Image',
      author: 'author',
    },
    {
      img: 'https://via.placeholder.com/240x120.png?text=Recomm4',
      title: 'Image',
      author: 'author',
    },
    {
      img: 'https://via.placeholder.com/240x120.png?text=Recomm5',
      title: 'Image',
      author: 'author',
    },
  ];

  return (
    <ThemeProvider theme={themeMuiContainer}>
      <Container maxWidth="md" className={classes.container}>
        <AppBar position="static" className={classes.appbar}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {loading ? <Skeleton width="50px" /> : 'News'}
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div className={classes.grow} />
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Carousel navButtonsAlwaysVisible={true}>
          <Card>
            <CardMedia
              className={classes.media}
              image="https://via.placeholder.com/360x120.png?text=Promo1"
              title="promo1"
            />
          </Card>
          <Card>
            <CardMedia
              className={classes.media}
              image="https://via.placeholder.com/360x120.png?text=Promo2"
              title="promo"
            />
          </Card>
        </Carousel>
        <div className={classes.gridRoot}>
          <GridList className={classes.gridList} cols={2.5}>
            {tileData.map((tile) => (
              <GridListTile key={tile.img}>
                <img src={tile.img} alt={tile.gridTitle} />
                <GridListTileBar
                  title={tile.gridTitle}
                  classes={{
                    root: classes.titleBar,
                    title: classes.gridTitle,
                  }}
                  actionIcon={
                    <IconButton aria-label={`star ${tile.title}`}>
                      <StarBorderIcon className={classes.gridTitle} />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </Container>
    </ThemeProvider>
  );
}
