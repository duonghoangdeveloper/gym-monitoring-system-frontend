export const URI =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? 'http://localhost:7777'
    : 'https://gym-monitoring-system.herokuapp.com';

export const TOKEN_KEY = 'gym-monitoring-system-token';

export const CONNECTION_STATUSES = {
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED',
  RECONNECTING: 'RECONNECTING',
};

export const AUTH_ROLES = [
  'CUSTOMER',
  'TRAINER',
  'MANAGER',
  'GYM_OWNER',
  'SYSTEM_ADMIN',
];

export const ALL_ROLES = [
  'GUEST',
  'CUSTOMER',
  'TRAINER',
  'MANAGER',
  'GYM_OWNER',
  'SYSTEM_ADMIN',
];

export const USER_GENDERS = ['MALE', 'FEMALE', 'OTHER'];

export const DATE_FORMAT = 'DD/MM/YYYY';

export const DATE_TIME_FORMAT = 'DD/MM/YYYY, HH:mm';

export const TIME_FORMAT = ' HH:mm';

export const DELAY = 100;

export const PAGE_SIZE = 10;
