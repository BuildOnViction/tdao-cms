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