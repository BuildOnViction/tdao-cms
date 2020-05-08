import { STATE_LOGIN } from 'components/AuthForm';
import { PersistGate } from 'redux-persist/integration/react';
// import GAListener from 'components/GAListener';
import { Provider } from 'react-redux';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import AuthPage from 'pages/AuthPage';
import {
  getLoginStatus
} from 'store/selectors/auth';
import { FREELY_ACCESS_PAGES } from 'config/constant';
// import createHistory from 'history/createBrowserHistory';

// pages
import DashboardPage from 'pages/DashboardPage';
import JobsPage from 'pages/JobsPage';
import JobsDetailPage from 'pages/JobDetailPage';
import JobsEditPage from 'pages/JobEditPage';
import JobsCreatePage from 'pages/JobCreatePage';
//admins

import AdminPage from 'pages/AdminPage';
import AdminDetailPage from 'pages/AdminDetailPage';
import AdminEditPage from "./pages/AdminEditPage";
import AdminCreatePage from "./pages/AdminCreatePage";

//broker
import BrokerPage from './pages/BrokerPage';
import BrokerDetailPage from "./pages/BrokerDetailPage";
import BrokerCreatePage from "./pages/BrokerCreatePage";
import BrokerEditPage from "./pages/BrokerEditPage";
//user
import UserPage from "./pages/UserPage";
import UserDetailPage from "./pages/UserDetailPage";



import React from 'react';
import componentQueries from 'react-component-queries';
import { Router, Redirect, Switch } from 'react-router-dom';
import './styles/reduction.css';
import configureStore from './store';
const createHistory = require("history").createBrowserHistory;
require('./styles/style.css')
export const history = createHistory();
const { store, persistor}  = configureStore({}, history);
// const getBasename = () => {
//   return `/${process.env.PUBLIC_URL.split('/').pop()}`;
// };

class App extends React.Component {
  runInitialAppStartActions = () => {
      const isLoggedIn = getLoginStatus(store.getState());

      if (isLoggedIn) {
          // stay at the same page when trying to access login page if user logged in already
          if (!FREELY_ACCESS_PAGES[history.location.pathname]) {
              return false;
          } else {
            history.replace('dashboard');
          }
      } else {
        history.replace('login');
      }
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} onBeforeLift={this.runInitialAppStartActions}>
          <Router history={history}>
            <Switch>
              <LayoutRoute
                exact
                path="/login"
                layout={EmptyLayout}
                component={props => (
                  <AuthPage {...props} authState={STATE_LOGIN} />
                )}
              />

              <LayoutRoute
                exact
                path="/dashboard"
                layout={MainLayout}
                component={DashboardPage}
              />
              <LayoutRoute
                  exact
                  path="/jobs"
                  layout={MainLayout}
                  component={JobsPage}
              />
              <LayoutRoute
                exact
                path="/jobs/create"
                layout={MainLayout}
                component={JobsCreatePage}
              />
              <LayoutRoute
                exact
                path="/jobs/:id"
                layout={MainLayout}
                component={JobsDetailPage}
               />

                <LayoutRoute
                    exact
                    path="/jobs/edit/:id"
                    layout={MainLayout}
                    component={JobsEditPage}
                />
                <LayoutRoute
                    exact
                    path="/admins"
                    layout={MainLayout}
                    component={AdminPage}
                />
                <LayoutRoute
                    exact
                    path="/admins/create"
                    layout={MainLayout}
                    component={AdminCreatePage}
                />
                <LayoutRoute
                    exact
                    path="/admins/edit/:id"
                    layout={MainLayout}
                    component={AdminEditPage}
                />
                <LayoutRoute
                    exact
                    path="/admins/:id"
                    layout={MainLayout}
                    component={AdminDetailPage}
                />
                <LayoutRoute
                    exact
                    path="/brokers"
                    layout={MainLayout}
                    component={BrokerPage}
                />
                <LayoutRoute
                    exact
                    path="/brokers/create"
                    layout={MainLayout}
                    component={BrokerCreatePage}
                />
                <LayoutRoute
                    exact
                    path="/brokers/edit/:id"
                    layout={MainLayout}
                    component={BrokerEditPage}
                />
                <LayoutRoute
                    exact
                    path="/brokers/:id"
                    layout={MainLayout}
                    component={BrokerDetailPage}
                />
                <LayoutRoute
                    exact
                    path="/users"
                    layout={MainLayout}
                    component={UserPage}
                />
                <LayoutRoute
                    exact
                    path="/users/:id"
                    layout={MainLayout}
                    component={UserDetailPage}
                />
              <Redirect to="/dashboard" />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
