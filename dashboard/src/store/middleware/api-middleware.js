import {
    apiStarted,
    apiFinished,
    apiError
} from 'store/actions/common';
import {
    API_REQUEST
} from 'store/constants/actions';
import {
    getToken,
    getRefreshToken
} from 'store/selectors/auth';
import {
    requestingNewToken
} from 'store/selectors/jwt';
import axios from 'axios';
import {
    logout
} from 'store/actions/auth';
import {
    refreshNewToken,
    addApiToWaitingBuffer
} from 'store/actions/jwt';

function isAvailableRefreshToken(state) {
    return getRefreshToken(state);
}

function isRequestingNewToken(state) {
    return requestingNewToken(state);
}

// function sanitizeObj(obj) {
//     if (obj) {
//         for (const index in obj) {
//             if (obj[index] === null || obj[index] === '') {
//                 delete obj[index];
//             }
//         }
//         delete obj['$$hashKey'];
//     }
// }

const apiMiddleware = ({
    dispatch,
    getState
}) => next => action => {
    if (action.type !== API_REQUEST) {
        return next(action);
    }

    let {
        url,
        success,
        method,
        params,
        data,
        showErrorToUser
    } = action.payload;

    const headers = {};
    const state = getState();
    const accessToken = getToken(state);

    if (accessToken) {
        headers['Authorization'] = '' + accessToken;
    }

    headers.Accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    dispatch(apiStarted());

    return axios({
        url,
        headers,
        method: method || 'GET',
        params,
        data
    })
    .then(response => {
        dispatch(apiFinished());
        if (success) {
            return dispatch(success(response.data));
        }
        return Promise.resolve(response.data.data);
    })
    .catch(error => {
        if (!error.response) {
            return Promise.reject(error);
        }

        if (error.response.data.message === 'This refresh token is not valid or expired.') {
            dispatch(logout());
            return Promise.reject(error);
        }
        
        // TODO, move this token_expired_rule_error to configuration
        if (error.response.data.statusCode === 401) {
            if (!isAvailableRefreshToken(state)) {
                dispatch(logout());
                return Promise.reject(error);
            }

            const promise = new Promise((resolve, reject) => {
                action = action || {};
                action.type = 'PENDING_REQUEST_API';
                action.promise = { resolve, reject };
                if (isRequestingNewToken(state)) {
                    dispatch(addApiToWaitingBuffer(action));
                } else {
                    dispatch(addApiToWaitingBuffer(action));
                    dispatch(refreshNewToken(state));
                }
            });
            return promise;
        }

        if (showErrorToUser) {
            // injector('MessageService').pop('error', error.response.data.data.message.general.code);
        }

        dispatch(apiError({
            errorMsg: error.response.data.message
        }));
        
        return Promise.reject(error.response.data.message);
    });
};

export default apiMiddleware;