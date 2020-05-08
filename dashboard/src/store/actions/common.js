import {
    API_STARTED,
    API_FINISHED,
    API_ERROR,
    NO_NOTHING
} from '../constants/actions';

export const apiStarted = () => ({
    type: API_STARTED
});

export const apiFinished = () => ({
    type: API_FINISHED
});

export const apiError = payload => ({
    type: API_ERROR,
    payload
});

export const doNothing = payload => ({
    type: NO_NOTHING,
    payload
});