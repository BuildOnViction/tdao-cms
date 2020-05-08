import {
    API_REQUEST
} from '../constants/actions';
import {
    TOKEN_EXPIRED,
    ADD_API_TO_WAITING_BUFFER,
    FINISHED_REQUEST_ALL_WAITING_APIS,
    UPDATE_REFRESH_TOKEN
} from '../constants/jwt';

import { BASEURL } from "config/constant";

import {
    getRefreshToken
} from '../selectors/auth';
import {
    getWaitingApis
} from '../selectors/jwt';

export const refreshNewToken = () => (dispatch, getState) => {
    const refreshToken = getRefreshToken(getState());
    dispatch({
        type: TOKEN_EXPIRED
    });
    return dispatch({
        type: API_REQUEST,
        payload: {
            url: BASEURL + 'api/v1/auth/refresh-token',
            method: 'POST',
            data: {
                refresh_token: refreshToken
            },
            success: res => {
                dispatch(updateRefreshToken(res.data));
                return recallAllWaitingApis();
            }
        }
    });
};

export const updateRefreshToken = res => dispatch => {
    return dispatch({
        type: UPDATE_REFRESH_TOKEN,
        payload: res
    });
};

export const addApiToWaitingBuffer = api => ({
    type: ADD_API_TO_WAITING_BUFFER,
    payload: api
});

export const recallAllWaitingApis = () => (dispatch, getState) => {
    const waitingApis = getWaitingApis(getState());
    waitingApis.every(api => {
        return dispatch(api);
    });

    return dispatch({
        type: FINISHED_REQUEST_ALL_WAITING_APIS
    });
};