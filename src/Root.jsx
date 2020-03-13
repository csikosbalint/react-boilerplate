import React from 'react';
import {
  HashRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuAppBar from './home/MenuAppBar.jsx';
import Login from './home/Login.jsx';


const fakeAuth = {
  isAuthenticated() {
    if (window.localStorage.getItem('idToken')) {
      return true;
    }
    return false;
  },
  authenticate(idToken, cb) {
    window.localStorage.setItem('idToken', atob(idToken.split('.')[1]));
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    window.localStorage.removeItem('idToken');
    setTimeout(cb, 100); // fake async
  },
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const idToken = rest.computedMatch.params[0].split('=')[1];
  if (idToken) {
    fakeAuth.authenticate(idToken);
    return <Redirect to="/home"></Redirect>;
  }
  return (
    <Route {...rest} render={props => (
      fakeAuth.isAuthenticated() ? <Component {...props} /> : <Redirect to='/login' />
    )} />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any,
};

function App() {
  localStorage.setItem('clientId', '77mmvqhkl2g7oqkfao9pgslg48');
  return (
    <Router>
      <Switch>
        <Route path="/login" component={() => <Login></Login>} />
        <PrivateRoute path='/*' component={ () => <MenuAppBar onSignOut={fakeAuth.signout}></MenuAppBar>} />
      </Switch>
    </Router>
  );
}

export default App;
