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

export const getOneProposal = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/proposals/' + id,
        method: 'GET',
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});

export const approve = (id, proposal) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/proposals/approve/' + id,
        method: 'PUT',
        data: proposal,
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});

export const reject = (id, reason) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/proposals/reject/' + id,
        method: 'PUT',
        data: { reason },
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});