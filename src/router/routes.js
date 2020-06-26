import React from 'react';
import { Route } from 'react-router-dom';

import { AppAuthRoute } from '../components/app-auth-route';
import * as pages from './pages';

// Everyone can access
const publicRoutes = [
  {
    component: pages.SignIn,
    exact: true,
    key: 'sign-in',
    path: '/sign-in',
  },
];

const authRoutes = [
  {
    component: pages.Home,
    exact: true,
    key: 'home',
    path: '/',
  },
  {
    component: pages.Profile,
    exact: true,
    key: 'profile',
    path: '/profile',
  },
];

export const allRoutes = [...publicRoutes, ...authRoutes];

export const routes = [
  ...publicRoutes.map(({ key, path, exact, component }) => (
    <Route key={key} path={path} exact={exact} component={component} />
  )),
  ...authRoutes.map(({ key, path, exact, component }) => (
    <AppAuthRoute key={key} path={path} exact={exact} component={component} />
  )),
  <Route key="404" component={pages._404} />,
];
