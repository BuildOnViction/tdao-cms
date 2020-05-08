import {
    JOB_BROKER_SUCCESS,
    LIST_BROKER_SUCCESS,
    DETAIL_BROKER_SUCCESS,
    POST_BROKER_SUCCESS,
    PUT_BROKER_SUCCESS,
    DELETE_BROKER_SUCCESS,
    LIST_BROKER_PAGINATE_SUCCESS
} from '../constants/broker';
import {BASEURL} from "config/constant";
import {API_REQUEST} from '../constants/actions';


export const getBrokerJobs = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/brokers/broker_id/' + id,
        method: 'GET',
        success: res => {
            return jobBrokerData(res.data);
        }
    }
});


//job broker
export const jobBrokerData = (data, opts) => (dispatch, getState) => {
    dispatch(getBrokerSuccess({
        data
    }));
};


export const getBrokerSuccess = data => ({
    type: JOB_BROKER_SUCCESS,
    payload: data
});

// list owner broker

export const getListBroker = () => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/brokers',
        method: 'GET',
        success: res => {
            return listBrokerData(res.data);
        }
    }
});


//job broker
export const listBrokerData = (data, opts) => (dispatch, getState) => {
    dispatch(getListBrokerSuccess({
        data
    }));
};

export const getListBrokerSuccess = data => ({
    type: LIST_BROKER_SUCCESS,
    payload: data
});

//broker detail

export const getBrokerDetail = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/brokers/' + id,
        method: 'GET',
        success: res => {
            return jobBrokerDetailData(res.data);
        }
    }
});

export const jobBrokerDetailData = (data) => {
    return {
        type: DETAIL_BROKER_SUCCESS,
        payload: data
    }
};

//broker post
export const postBroker = (data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/brokers',
        method: 'POST',
        data: data,
        success: res => {
            return getPostBrokerData(res.data);
        }
    }
});

export const getPostBrokerData = (data) => {
    return {
        type: POST_BROKER_SUCCESS,
        payload: data
    }
};

//broker edit

export const putBroker = (id, data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/brokers/' + id,
        method: 'PUT',
        data: data,
        success: res => {
            return getPutBrokerData(res.data);
        }
    }
});

export const getPutBrokerData = (data) => {
    return {
        type: PUT_BROKER_SUCCESS,
        payload: data
    }
};

export const deleteBroker = (id, data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/brokers/' + id,
        method: 'DELETE',
        data: data,
        success: res => {
            return getDeleteBrokerData(id);
        }
    }
});

export const getDeleteBrokerData = (data) => {
    return {
        type: DELETE_BROKER_SUCCESS,
        payload: data
    }
};

//list paginate

export const getListBrokerPaginate = (page=1,limit=10) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/brokers/paginate',
        method: 'GET',
        params:{page,limit},
        success: res => {
            return listBrokerPaginateData(res.data);
        }
    }
});


//job broker
export const listBrokerPaginateData = data => ({
    type: LIST_BROKER_PAGINATE_SUCCESS,
    payload: data
});



