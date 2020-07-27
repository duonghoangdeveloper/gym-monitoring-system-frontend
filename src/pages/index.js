import React from 'react';
import { Route } from 'react-router-dom';

import { AppAuthRoute } from '../components/app-auth-route';
import { _404 } from './_404';
import { Cameras } from './cameras';
import { Customers } from './customers';
import { Dashboard } from './dashboard';
import { Feedbacks } from './feedbacks';
import { Packages } from './packages';
import { Profile } from './profile';
import { SignIn } from './sign-in';
import { Staffs } from './staffs';
// Everyone can access
const publicRoutes = [
  {
    component: SignIn,
    exact: true,
    key: 'sign-in',
    path: '/sign-in',
  },
];

const authRoutes = [
  {
    component: Dashboard,
    exact: true,
    key: 'home',
    path: '/',
  },
  {
    component: Staffs,
    exact: true,
    key: 'staffs',
    path: '/staffs',
  },
  {
    component: Profile,
    exact: true,
    key: 'profile',
    path: '/profile',
  },
  {
    component: Customers,
    exact: true,
    key: 'customers',
    path: '/customers',
  },
  {
    component: Cameras,
    exact: true,
    key: 'cameras',
    path: '/cameras',
  },
  {
    component: Feedbacks,
    exact: true,
    key: 'feedbacks',
    path: '/feedbacks',
  },
  {
    component: Packages,
    exact: true,
    key: 'packages',
    path: '/packages',
  },
  {
    component: Dashboard,
    exact: true,
    key: 'dashboard',
    path: '/dashboard',
  },
];

export const allRoutes = [...publicRoutes, ...authRoutes];

export const routes = [
  ...publicRoutes.map(({ component, exact, key, path }) => (
    <Route component={component} exact={exact} key={key} path={path} />
  )),
  ...authRoutes.map(({ component, exact, key, path }) => (
    <AppAuthRoute component={component} exact={exact} key={key} path={path} />
  )),
  <Route component={_404} key="404" />,
];
