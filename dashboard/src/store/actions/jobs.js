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
import {getBrokerJobs} from '../actions/broker'

export const listJobs = (page = 1, limit = 50, from_node = "wallet", status = "FAILURE") => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs',
        method: 'GET',
        params: { page, limit, from_node, status},
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});
export const getDetailJobs = (id, fromNode) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs/' + id + "?from_node=" + fromNode,
        method: 'GET',
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});
//list
export const jobListData = (data, opts) => (dispatch, getState) => {
    dispatch(listJobSuccess({
        data
    }));
};


export const listJobSuccess = data => ({
    type: LIST_JOB_SUCCESS,
    payload: data
});

// detail

export const getJobDetailData = (data, opts) => async (dispatch, getState) => {
    // await dispatch(getBrokerJobs(data.broker_id));
    await dispatch(detailJobSuccess({
        data
    }));
};


export const detailJobSuccess = data => ({
    type: DETAIL_JOB_SUCCESS,
    payload: data
});


export const getDeleteJobs = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs/' + id,
        method: 'DELETE',
        success: res => {
            return getJobDeleteSuccess(res.data, id);
        }
    }
});

export const getJobDeleteSuccess = (data, _id) => ({
    type: DELETE_JOB_SUCCESS,
    payload: Object.assign(data, {_id: _id})
});


//update job
export const getUpdateJobs = (id, data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs/' + id,
        method: 'PUT',
        data: data,
        success: res => {
            return getJobUpdateSuccess(res.data, id);
        }
    }
});

export const relayJob = (data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs/relay/job',
        method: 'POST',
        data: data,
        success: res => {
            return ({
                type: "API_FINISH",
                payload: res.data
            })
        }
    }
});

export const getJobUpdateSuccess = (data, _id) => ({
    type: UPDATE_JOB_SUCCESS,
    payload: data
});

//create job
export const getCreateJobs = (data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs',
        method: 'POST',
        data: data,
        success: res => {
            return getJobCreateSuccess(res.data);
        }
    }
});

export const getJobCreateSuccess = (data) => ({
    type: CREATE_JOB_SUCCESS,
    payload: data
});

//search

export const getSearchJobs = (keywords, status, page = 1, limit = 10) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs/search',
        method: 'GET',
        params: {keywords: keywords, page, limit, status},
        success: res => {
            return getSearchSuccess(res.data);
        }
    }
});

export const getSearchSuccess = (data) => ({
    type: SEARCH_JOB_SUCCESS,
    payload: data
});


export const getActiveJobs = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobs/active/'+id,
        method: 'GET',
        success: res => {
            return getActiveJobsSuccess(res.data)
        }
    }
})

export const getActiveJobsSuccess = (data) => ({
    type: ACTIVE_JOB_SUCCESS,
    payload: data
});
