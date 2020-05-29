import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import SignIn from './containers/SignIn';
import Dashboard from './containers/Dashboard';

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
    <Route
      {...rest}
      render={(props) =>
        fakeAuth.isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signin" render={() => <SignIn />} />
        <PrivateRoute path="/*" component={() => <Dashboard />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
