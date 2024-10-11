const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://mihis.tech';
// http://localhost:5000/api/child/vaccination-summary
export const CHILD_URL = BASE_URL + '/api/child';
export const CHILD_VAX_SUMMARY_URL =
  BASE_URL + '/api/child/vaccination-summary';
export const CHILDREN_PROFILE_URL = BASE_URL + '/api/children-page/';

export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_LOGOUT_URL = BASE_URL + '/api/users/logout';
export const USER_SIGNUP_URL = BASE_URL + '/api/users/signup';
export const USER_URL = BASE_URL + '/api/users';
export const USER_PROFILE_URL = BASE_URL + '/api/users/';

// export const MIDWIVES_URL = BASE_URL + '/api/users/midwives';
export const MOTHER_URL = BASE_URL + '/api/mother';
export const MOTHER_PROFILE_URL = BASE_URL + '/api/mother/';

// Log
export const AUDIT_LOGS_URL = BASE_URL + '/api/users/logs';

export const SEND_OTP = BASE_URL + '/api/sms/sendOTP';
export const VERIFY_OTP = BASE_URL + '/api/sms/verifyOTP';
export const SEND_SMS = BASE_URL + '/api/sms/sendSMS';
