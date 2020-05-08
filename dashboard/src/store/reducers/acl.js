import {
    SAVE_USER_PERMISSION
} from '../constants/acl';
export const initialState = {};

export const acl = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case SAVE_USER_PERMISSION:
            return {
                ...state,
                ...payload
            };

        default:
            return state;
    }
};