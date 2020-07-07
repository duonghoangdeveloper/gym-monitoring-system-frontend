import React from 'react';
import { Route } from 'react-router-dom';

import { AppAuthRoute } from '../components/app-auth-route';
import * as pages from '../pages';

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
  {
    component: pages.Staffs,
    exact: true,
    key: 'staffs',
    path: '/staffs',
    title: 'trainer',
  },
  {
    component: pages.Customers,
    exact: true,
    key: 'customers',
    path: '/customers',
  },
  {
    component: pages.Cameras,
    exact: true,
    key: 'cameras',
    path: '/cameras',
  },
  {
    component: pages.Packages,
    exact: true,
    key: 'packages',
    path: '/packages',
  },
];

export const allRoutes = [...publicRoutes, ...authRoutes];

export const routes = [
  ...publicRoutes.map(({ component, exact, key, path }) => (
    <Route component={component} exact={exact} key={key} path={path} />
  )),
  ...authRoutes.map(({ component, exact, key, path, title }) => (
    <AppAuthRoute
      component={component}
      exact={exact}
      key={key}
      path={path}
      title={title}
    />
  )),
  <Route component={pages._404} key="404" />,
];
