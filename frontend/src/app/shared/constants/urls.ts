const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://mihis.tech';

export const CHILD_URL = BASE_URL + '/api/child';
export const CHILD_FILTER_URL = BASE_URL + '/api/child/filtered';
export const CHILD_ADD_URL = BASE_URL + '/api/child/add';
export const CHILD_VACCINATION_URL = BASE_URL + '/api/child/';
export const CHILD_VAX_SUMMARY_URL =
  BASE_URL + '/api/child/vaccination-summary';
export const CHILDREN_PROFILE_URL = BASE_URL + '/api/children-page/';
export const CHILDREN_ANTHRO_PRINT = BASE_URL + '/api/children-aanthro';
export const CHILD_ALL_SCHEDULES_URL = BASE_URL + '/api/all-schedules';
export const CHILD_SCHEDULE_URL = BASE_URL + '/api/child/schedules';
export const CHILD_ANTHROPOMETRIC_URL = `${CHILD_URL}/`;
export const CHILD_WEIGHING_HISTORY_URL = `${CHILD_URL}/`;
export const CHILD_NUTRITIONAL_STATUS_URL = `${CHILD_URL}/`;

export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_LOGOUT_URL = BASE_URL + '/api/users/logout';
export const USER_SIGNUP_URL = BASE_URL + '/api/users/signup';
export const USER_URL = BASE_URL + '/api/users';
export const USER_PROFILE_URL = BASE_URL + '/api/users/';
export const USER_ACTIVATE_DEACTIVATE = BASE_URL + '/api/users/';
export const USER_EXPORT_URL = BASE_URL + '/api/users/export-users';

// export const MIDWIVES_URL = BASE_URL + '/api/users/midwsives';
export const MOTHER_URL = BASE_URL + '/api/mother';
export const MOTHER_PROFILE_URL = BASE_URL + '/api/mother/';
export const MOTHER_ADD_CHILD_URL = BASE_URL + '/api/';
export const MOTHER_LINK_CHILD_URL = BASE_URL + '/api/mother/link-child';
export const MOTHER_EXPORT_URL =
  BASE_URL + '/api/mother/export-mother-children';
export const GET_CHILDREN_BY_MOTHER_ID = (motherId: string) =>
  `/api/mother/${motherId}/children`;

// Log
export const AUDIT_LOGS_URL = BASE_URL + '/api/users/logs';

export const SEND_OTP = BASE_URL + '/api/sms/sendOTP';
export const VERIFY_OTP = BASE_URL + '/api/sms/verifyOTP';
export const SEND_SMS = BASE_URL + '/api/sms/sendSMS';

// Reports
export const REPORT_MISSED_VACCINES_URL =
  BASE_URL + '/api/report/missed-vaccines';
export const REPORT_VACCINE_DOSES_URL = BASE_URL + '/api/report/vaccine-doses';
export const REPORT_ANTHROPOMETRIC_URL =
  BASE_URL + '/api/anthropometric-weight-for-age-by-child';
export const REPORT_HEIGHT_FOR_AGE_URL =
  BASE_URL + '/api/anthropometric-height-for-age';
export const REPORT_WEIGHT_FOR_HEIGHTURL =
  BASE_URL + '/api/anthropometric-weight-for-height';
