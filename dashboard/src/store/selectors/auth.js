import {
    initialState
} from '../reducers/auth';

export const getRehydrate = state => state.persist.auth.rehydrate;
export const getLoginStatus = state => state.persist.auth.loggedIn;
export const getCurrentRouteAlias = state => state.persist.router.currentState.name;
export const getToken = state => state.persist.auth.token.token;
export const getRefreshToken = state => state.persist.auth.token.refresh_token;
export const getUser = state => state.persist.auth.user || initialState.user;
export const getConfig = state => state.persist.auth.config;
