import { BASEURL } from "config/constant";
import { API_REQUEST } from '../constants/actions';
import {LIST_JOB_TYPE_SUCCESS} from "../constants/jobTypes";


export const getJobTypes = () => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/jobTypes',
        method: 'GET',
        success: res => {
            return jobTypesData(res.data);
        }
    }
});


const jobTypesData =data => ({
    type: LIST_JOB_TYPE_SUCCESS,
    payload: data
});