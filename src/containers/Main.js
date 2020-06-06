import React, { useState, Suspense, lazy } from 'react';
import usePromise from 'react-promise-suspense';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InfoIcon from '@material-ui/icons/Info';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import Skeleton from '@material-ui/lab/Skeleton';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import {
  GridList,
  Paper,
  GridListTile,
  GridListTileBar,
  Link,
} from '@material-ui/core';

import { Container, createMuiTheme, ThemeProvider } from '@material-ui/core';
import {
  fade,
  makeStyles,
  responsiveFontSizes,
  useTheme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function Main(props) {
  let themeMui = createMuiTheme({
    overrides: {
      MuiContainer: {
        root: {
          backgroundColor: 'lightblue',
        },
      },
    },
  });
  themeMui = responsiveFontSizes(themeMui);
  const getClasses = makeStyles((theme) => ({
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
    menuTitle: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
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
    //  CAROUSEL
    carousel: {
      marginBottom: theme.spacing(2),
    },
    // RECOMMENDATION
    recommRoot: {
      padding: '1rem',
      marginBottom: theme.spacing(2),
    },
    gridRoot: {
      display: 'flex',
      flexWrap: 'wrap',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    recommList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    recommTileFrame: {
      width: 'auto !important',
    },
    recommTile: {
      width: '180px',
      height: '180px',
      [theme.breakpoints.down('xs')]: {
        width: '120px',
        height: '120px',
      },
    },
    gridTitle: {
      color: theme.palette.primary.light,
    },
    // CATEGORIES
    catRoot: {
      padding: '1rem',
      marginBottom: theme.spacing(2),
    },
    catTileFrame: {
      justifyContent: 'flex-start',
      width: 'auto !important',
    },
    catTile: {
      width: '180px',
      height: '180px',
      [theme.breakpoints.down('xs')]: {
        width: '120px',
        height: '120px',
      },
    },
  }));
  const classes = getClasses();
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  let recommNo = 4.5;
  let isSmall = false;
  let recomms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (useMediaQuery(useTheme().breakpoints.down('md'))) {
    recommNo = 3.5;
    recomms = [1, 2, 3, 4, 5, 6, 7, 8];
  }
  if (useMediaQuery(useTheme().breakpoints.down('sm'))) {
    recommNo = 2.5;
    recomms = [1, 2, 3, 4, 5, 6];
  }
  if (useMediaQuery(useTheme().breakpoints.down('xs'))) {
    isSmall = true;
    recommNo = 1.5;
    recomms = [1, 2, 3, 4];
  }
  let cats = [...recomms];

  const LazyNews = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import('../components/News')), 2000);
    });
  });

  const Things = () => {
    const data = usePromise(
      () =>
        fetch(
          'http://slowwly.robertomurray.co.uk/delay/6000/url/http://dq3kw.mocklab.io/json/1'
        ).then((res) => res.json()),
      []
    );
    return (
      <Typography variant="h6" style={{ margin: '1rem' }}>
        {data.value}
      </Typography>
    );
  };

  return (
    <ThemeProvider theme={themeMui}>
      <Container maxWidth="lg" className={classes.container}>
        <p>Container</p>
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
            <Suspense
              fallback={
                <Skeleton
                  width="50px"
                  height="25px"
                  style={{ margin: '1rem' }}
                />
              }
            >
              <LazyNews />
            </Suspense>

            <Suspense
              fallback={
                <Skeleton
                  width="50px"
                  height="25px"
                  style={{ margin: '1rem' }}
                />
              }
            >
              <Things />
            </Suspense>
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
        <Carousel
          className={classes.carousel}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          infiniteLoop={true}
        >
          {[1, 2, 3, 4].map((promo) => (
            <div key={promo}>
              <img
                src={`https://via.placeholder.com/960x240.png?text=Promo${promo}`}
                alt={promo}
              />
            </div>
          ))}
        </Carousel>
        <Paper className={classes.recommRoot}>
          <Typography variant="subtitle1">Recommended for you...</Typography>
          <GridList
            className={classes.recommList}
            cols={recommNo}
            cellHeight={isSmall ? 120 : 180}
          >
            {recomms.map((tile) => (
              <GridListTile
                key={tile}
                classes={{
                  root: classes.recommTileFrame,
                  tile: classes.recommTile,
                }}
              >
                {loading ? (
                  <Skeleton
                    variant="rect"
                    width={isSmall ? 120 : 180}
                    height={isSmall ? 120 : 180}
                  />
                ) : (
                  <img
                    src={`https://via.placeholder.com/${isSmall ? 120 : 180}x${
                      isSmall ? 120 : 180
                    }.png?text=Recomm${tile}`}
                    alt={tile}
                  />
                )}
                <GridListTileBar
                  title={
                    <Typography variant="caption">{`Buy now only for $1.00`}</Typography>
                  }
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.title}`}
                      style={{
                        color: 'rgba(255, 255, 255, 0.54)',
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </Paper>
        <Paper className={classes.catRoot}>
          <Typography variant="subtitle1">Other categories...</Typography>
          <GridList
            cols={recommNo}
            rows={2}
            cellHeight={isSmall ? 120 : 180}
            className={classes.catTileFrame}
          >
            {cats.map((tile) => (
              <GridListTile
                key={tile}
                classes={{
                  root: classes.catTileFrame,
                  tile: classes.catTile,
                }}
              >
                <img
                  src={`https://via.placeholder.com/${isSmall ? 120 : 180}x${
                    isSmall ? 120 : 180
                  }.png?text=Cat${tile}`}
                  alt={tile}
                />
                <GridListTileBar
                  title={
                    <Typography variant="caption">{`Click to browse Cat${tile}s!`}</Typography>
                  }
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.title}`}
                      style={{
                        color: 'rgba(255, 255, 255, 0.54)',
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
          <Typography variant="subtitle2" align="right">
            <Link href="#" color="inherit">{`Click to browse more...`}</Link>
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
