import {
    LIST_JOB_SUCCESS,
    DETAIL_JOB_SUCCESS,
    DELETE_JOB_SUCCESS,
    UPDATE_JOB_SUCCESS,
    CREATE_JOB_SUCCESS,
    SEARCH_JOB_SUCCESS,
    ACTIVE_JOB_SUCCESS
} from '../constants/jobs';

import {BASEURL} from "config/constant";
import {API_REQUEST} from '../constants/actions';

export const listProposals = (page = 1, limit = 100) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/proposals',
        method: 'GET',
        params: { page, limit},
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});

export const approve = (id, quorum) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/proposals/approve/' + id,
        method: 'PUT',
        params: { quorum },
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});