import {
    API_REQUEST
} from '../constants/actions';
import { BASEURL } from "config/constant";
import {saveLoggedUser} from './auth';

export const getProfile = () => dispatch => {
    return dispatch({
        type: API_REQUEST,
        payload: {
            url: BASEURL + "api/v1/profile?",
            method: 'GET',
            showErrorToUser: true,
            success: (res) => {
                return saveLoggedUser({
                    ...res.data
                });
            }
        }
    });
};

export const updateProfile = profile => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + "api/v1/profile",
        method: 'PUT',
        data: profile,
        showErrorToUser: true,
        success: (res) => {
            return saveLoggedUser({
                ...profile
            });
        }
    }
});

export const updatePassword = passwords => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + "api/v1/profile/change-password",
        method: 'PUT',
        data: passwords,
        showErrorToUser: true
    }
});
