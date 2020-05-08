import { LOGOUT, API_REQUEST, STORE_RECENT_ROUTER } from '../constants/actions';
import {
    SAVE_LOGGED_USER,
    SAVE_TOKEN,
    REMOVE_LOGGED_USER,
} from '../constants/auth';
import { BASEURL } from "config/constant";
import { history } from "App.js";


export const login = (data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/login',
        method: 'POST',
        data: data,
        success: res => {
            return routeUserIn(res.data);
        }
    }
});

export const getActive = (token) => dispatch => {
    return dispatch({
        type: API_REQUEST,
        payload: {
            url: BASEURL + "api/v1/auth/activate?token=" + token,
            method: 'GET',
            showErrorToUser: true
        }
    });
};

export const resetPassword = data => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/auth/set-password?token=' + data.token,
        method: 'PUT',
        apiPrefix: 'auth_setpassword',
        data: {
            password: data.password
        }
    }
});

export const routeUserIn = (data, opts) => (dispatch, getState) => {
    dispatch(saveLoggedUser({
        ...data
    }));

    dispatch(saveToken({
        ...data
    }));

    history.replace('dasboard');
};

export const logout = (data, opts) => (dispatch, getState) => {

    setTimeout(() => {
        dispatch({
            type: LOGOUT
        });

        setTimeout(() => {
            dispatch({
                type: 'APP/RESET'
            });
        }, 100);
        if (!opts || !opts.verbose) {
            history.replace('/login');
        }
    }, 100);
};

export const saveLoggedUser = data => ({
    type: SAVE_LOGGED_USER,
    payload: data
});

export const saveToken = data => ({
    type: SAVE_TOKEN,
    payload: data
});


export const storeRecentRouter = routeAction => ({
    type: STORE_RECENT_ROUTER,
    payload: routeAction
});

export const removeLoggedUser = () => ({
    type: REMOVE_LOGGED_USER
});

export const containerActions = {
    login,
    logout
};
