import {
    LIST_JOB_TYPE_SUCCESS
} from '../constants/jobTypes';

export const initialState = {
    list: [],
};

export const jobTypes = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case LIST_JOB_TYPE_SUCCESS:
            return {
                ...state,
                list: payload
            };
        default:
            return state;
    }
};