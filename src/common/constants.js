export const URI =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? 'http://192.168.1.103:7777'
    : 'https://gym-monitoring-system.herokuapp.com';
// change local LAN
export const PYTHON_SERVER_URI =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? 'http://192.168.1.103:8000'
    : '';

export const TOKEN_KEY = 'gym-monitoring-system-token';

export const CONNECTION_STATUSES = {
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED',
  RECONNECTING: 'RECONNECTING',
};

export const STAFF_ROLES = ['TRAINER', 'MANAGER', 'GYM_OWNER'];

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
export const DATE_FORMAT_US = 'YYYY-MM-DD';

export const DATE_TIME_FORMAT = 'DD/MM/YYYY, HH:mm';

export const TIME_FORMAT = 'HH:mm';

export const DELAY = 200;

export const PAGE_SIZE = 10;
