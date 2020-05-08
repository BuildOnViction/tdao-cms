import {
    API_STARTED,
    API_FINISHED,
    API_ERROR,
    STORE_RECENT_ROUTER,
    ROUTER_START
} from '../constants/actions';

export const initialState = {
    isRequesting: false,
    error: {}
};
export const requests = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case ROUTER_START:
            return { ...state,
                error: {}
            };
        case API_ERROR:
            return { ...state,
                error: payload,
                isRequesting: false
            };
        case API_STARTED:
            return { ...state,
                isRequesting: true,
                error: {}
            };
        case API_FINISHED:
            return { ...state,
                isRequesting: false
            };
        default:
            return state;
    }
};

export const toast = (state = null, {
    type,
    payload
}) => {
    switch (type) {
        case 'app/setToast':
            return payload;
        case 'app/clearToast':
            return null;
        default:
            return state;
    }
};

export const lastRoute = (state = {}, {
    type,
    payload
}) => {
    switch (type) {
        case STORE_RECENT_ROUTER:
            return { ...state,
                ...payload
            }; // user, token, refreshToken
        default:
            return state;
    }
};