import React from 'react';
import { Route } from 'react-router-dom';

import { AppAuthRoute } from '../components/app-auth-route';
import { _404 } from './_404';
import { Cameras } from './cameras';
import { Customers } from './customers';
import { Home } from './home';
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
    component: Home,
    exact: true,
    key: 'home',
    path: '/',
  },
  {
    component: Staffs,
    exact: true,
    key: 'trainers',
    path: '/trainers',
    role: 'TRAINER',
    title: 'Trainer',
  },
  {
    component: Staffs,
    exact: true,
    key: 'managers',
    path: '/managers',
    role: 'MANAGER',
    title: 'Manager',
  },
  {
    component: Staffs,
    exact: true,
    key: 'owners',
    path: '/owners',
    role: 'GYM_OWNER',
    title: 'Gym Owner',
  },
  {
    component: Staffs,
    exact: true,
    key: 'admins',
    path: '/admins',
    role: 'SYSTEM_ADMIN',
    title: 'Admin',
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
    role: 'CUSTOMER',
  },
  {
    component: Cameras,
    exact: true,
    key: 'cameras',
    path: '/cameras',
  },
  {
    component: Packages,
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
  ...authRoutes.map(({ component, exact, key, path, role, title }) => (
    <AppAuthRoute
      component={component}
      exact={exact}
      key={key}
      path={path}
      role={role}
      title={title}
    />
  )),
  <Route component={_404} key="404" />,
];
