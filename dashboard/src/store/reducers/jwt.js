import {
    TOKEN_EXPIRED,
    ADD_API_TO_WAITING_BUFFER,
    FINISHED_REQUEST_ALL_WAITING_APIS
}
    from '../constants/jwt';
export const initialState = {
    waitingApisBuffer: [],
    isRefreshingToken: false
};
export const jwt = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case TOKEN_EXPIRED:
            return {
                ...state,
                isRefreshingToken: true
            };
        case ADD_API_TO_WAITING_BUFFER:
            return {
                ...state,
                waitingApisBuffer: [...state.waitingApisBuffer, payload]
            };
        case FINISHED_REQUEST_ALL_WAITING_APIS:
            return {
                ...state,
                waitingApisBuffer: [],
                isRefreshingToken: false
            };
        default:
            return state;
    }
};