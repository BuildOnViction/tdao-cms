import {
    apiStarted,
    apiFinished,
    // apiError
} from 'store/actions/common';
import {
    getToken
} from 'store/selectors/auth';
import axios from 'axios';
import {
    logout
} from 'store/actions/auth';
// import injector from 'store/utils/getAngularServices';

// function sanitizeObj(obj) {
//     if (obj) {
//         for (const index in obj) {
//             if (obj[index] === null) {
//                 delete obj[index];
//             }
//         }
//         delete obj['$$hashKey'];
//     }
// }

const pendingApiMiddleware = ({
    dispatch,
    getState
}) => next => action => {
    if (action.type !== 'PENDING_REQUEST_API') {
        return next(action);
    }

    let {
        url,
        success,
        method,
        params,
        data,
        // usingOutletUUID,
        // usingOutletID,
        // showErrorToUser
    } = action.payload;

    const headers = {};
    const state = getState();
    const accessToken = getToken(state);

    if (accessToken) {
        headers['Authorization'] = accessToken;
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
            return action.promise.resolve(dispatch(success(response.data)));
        }
        return action.promise.resolve(response.data.data);
    })
    .catch(error => {
        if (!error.response) {
            // injector('MessageService').pop('error', 'common.msg.SERVER_ERROR');
            return action.promise.reject(error);
        }

        if (error.response.data.message === 'This refresh token is not valid or expired.') {
            dispatch(logout());
            return action.promise.reject(error);
        }

        // if (showErrorToUser) {
        //     // injector('MessageService').pop('error', error.response.data.message.general.code);
        // }

        // dispatch(apiError({
        //     errorMsg: error.response.data.message.general.message
        // }));
        // return action.promise.reject(error);
    });
};

export default pendingApiMiddleware;
