import {
    SAVE_LOGGED_USER,
    REMOVE_LOGGED_USER,
    SAVE_CURRENT_ROUTE_STATE,
    SAVE_TOKEN
} from '../constants/auth';
import {
    LOGOUT
} from '../constants/actions';
import {
    UPDATE_REFRESH_TOKEN
} from '../constants/jwt';

export const initialState = {
    loggedIn: false,
    user: {},
    token: {},
    role: {},
    rehydrate: false,
    routeBeforeHydrate: {}
};

export const auth = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case UPDATE_REFRESH_TOKEN:
            return {
                ...state,
                token: {
                    ...payload
                }
            };
        case LOGOUT:
            return {
                ...state,
                loggedIn: false
            };
        case 'APP/RESET':
            return {
                ...state,
                rehydrate: true
            };
        case SAVE_LOGGED_USER:
            return {
                ...state,
                user: {
                    email: payload.email,
                    name: payload.name,
                    roles: payload.roles
                }
            };
        case SAVE_TOKEN:
            return {
                ...state,
                token: { ...payload.token },
                role: payload.role,
                loggedIn: true
            }
        case REMOVE_LOGGED_USER:
            return {
                ...state,
                user: {},
                token: {},
                role: {}
            };
        case SAVE_CURRENT_ROUTE_STATE:
            return {
                ...state,
                routeBeforeHydrate: payload
            };
        default:
            return state;
    }
};