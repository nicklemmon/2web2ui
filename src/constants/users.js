export const ROLES = {
  ADMIN: 'admin',
  DEVELOPER: 'developer',
  TEMPLATES: 'templates',
  REPORTING: 'reporting',
  SUBACCOUNT_REPORTING: 'subaccount_reporting',
  SUPERUSER: 'superuser',
};

export const ROLE_LABELS = {
  [ROLES.TEMPLATES]: 'Templates',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.DEVELOPER]: 'Developer',
  [ROLES.REPORTING]: 'Reporting',
  [ROLES.SUBACCOUNT_REPORTING]: 'Reporting',
  [ROLES.SUPERUSER]: 'Super User',
  heroku: 'Heroku',
};
export const SUBACCOUNT_ROLES = [ROLES.SUBACCOUNT_REPORTING];
