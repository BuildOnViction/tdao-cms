import {DETAIL_USER_SUCCESS, LIST_USER_SUCCESS, STATISTICS_USER_SUCCESS, DELETE_USER_SUCCESS,DISABLE_USER_SUCCESS} from "../constants/users";
import {API_REQUEST} from "../constants/actions";
import {BASEURL} from "config/constant";


//list user success
export const getListUser = (keywords = '', page = 1, limit = 10) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/users',
        method: 'GET',
        params: {keyword: keywords, page, limit},
        success: res => {
            return listUsersData(res.data);
        }
    }
});


export const listUsersData = (data) => ({
    type: LIST_USER_SUCCESS,
    payload: data
});


//detail user
export const getDetailUser = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/users/' + id,
        method: 'GET',
        success: res => {
            return detailUsersData(res.data);
        }
    }
});


export const detailUsersData = (data) => ({
    type: DETAIL_USER_SUCCESS,
    payload: data
});

//statistics
export const getStatisticsUser = (params) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/users/statistics',
        method: 'GET',
        params: params,
        success: res => {
            return getStatisticsUserData(res.data);
        }
    }
});


export const getStatisticsUserData = (data) => ({
    type: STATISTICS_USER_SUCCESS,
    payload: data
});


//delete
export const getDeleteUser = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/users/' + id,
        method: 'DELETE',
        success: res => {
            return getDeleteUserData(id);
        }
    }
});


export const getDeleteUserData = (id) => ({
    type: DELETE_USER_SUCCESS,
    payload: id
});
//

export const getDisableUser = (id) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/users/' + id+"/disable",
        method: 'GET',
        success: res => {
            return getDisableUserData(res.data);
        }
    }
});


export const getDisableUserData = (data) => ({
    type: DISABLE_USER_SUCCESS,
    payload: data
});