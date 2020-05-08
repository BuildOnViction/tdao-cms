import { BASEURL } from "config/constant";
import { API_REQUEST } from '../constants/actions';
import {LIST_ADMIN_SUCCESS, ADMIN_DELETE_SUCCESS, ADMIN_DETAIL_SUCCESS, ADMIN_UPDATE_SUCCESS, ADMIN_CREATE_SUCCESS} from "../constants/admins";

export const getListAdmin = (page=1,limit=10) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/admins',
        method: 'GET',
        params:{page,limit},
        success: res => {
            return getAdminListData(res.data);
        }
    }
});

export const getAdminListData = (data, opts) => (dispatch, getState) => {
    dispatch(getListAdminSuccess({
        data
    }));
};
export const getListAdminSuccess = data => ({
    type: LIST_ADMIN_SUCCESS,
    payload: data
});

//delete
export const getDeleteAdmin = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/admins/'+id,
        method: 'DELETE',
        success: res => {
            return getDeleteAdminSuccess(res.data);
        }
    }
});
export const getDeleteAdminSuccess = (data) => ({
    type: ADMIN_DELETE_SUCCESS,
    payload: data
});

//detail

export const getDetailAdmin = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/admins/'+id,
        method: 'GET',
        success: res => {
            return getDetailAdminSuccess(res.data);
        }
    }
});
export const getDetailAdminSuccess = (data) => ({
    type: ADMIN_DETAIL_SUCCESS,
    payload: data
});

//edit
export const putEditAdmin = (id,data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/admins/'+id,
        method: 'PUT',
        data: data,
        success: res => {
            return getEditAdminSuccess(res.data);
        }
    }
});
export const getEditAdminSuccess = (data) => ({
    type: ADMIN_UPDATE_SUCCESS,
    payload: data
});


//create
export const postCreateAdmin = (data) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/admins',
        method: 'POST',
        data: data,
        success: res => {
            return postCreateAdminSuccess(res.data);
        }
    }
});
export const postCreateAdminSuccess = (data) => ({
    type: ADMIN_CREATE_SUCCESS,
    payload: data
});