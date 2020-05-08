export const LOGIN_REQUEST = 'APP/LOGIN_REQUEST';
export const REGISTER_REQUEST = 'APP/REGISTER_REQUEST';
export const LOGOUT = 'APP/LOGOUT';
export const REQUEST_ERROR = 'APP/REQUEST_ERROR';
export const CLEAR_ERROR = 'APP/CLEAR_ERROR';

export const API_STARTED = 'APP/API_STARTED';
export const API_FINISHED = 'APP/API_FINISHED';
export const API_ERROR = 'APP/API_ERROR';
export const TOGGLE_ASIDE_BAR = 'APP/TOGGLE_ASIDE_BAR';

export const NO_NOTHING = 'APP/NO_NOTHING';

export const ROUTER_START = '@@reduxUiRouter/onStart';
export const ROUTER_FINISH = '@@reduxUiRouter/onFinish';
export const ROUTER_SUCCESS = '@@reduxUiRouter/onSuccess';
export const STORE_RECENT_ROUTER = '@@reduxUiRouter/STORE_LAST_ROUTER';

export const asyncActionType = type => ({
    PENDING: type + '_PENDING',
    SUCCESS: type + 'SUCCESS',
    ERROR: type + 'ERROR'
});

export const API_REQUEST = 'APP/API_REQUEST';
export const CANCEL_API_REQUEST = 'APP/CANCEL_API_REQUEST';

export const SELECT_OUTLET = 'APP/SELECT_OUTLET';