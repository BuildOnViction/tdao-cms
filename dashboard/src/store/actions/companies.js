import { BASEURL } from "config/constant";
import { API_REQUEST } from '../constants/actions';
import {LIST_COMPANIES_SUCCESS} from "../constants/companies";

export const getListCompanies = (page=1,limit=1000) => ({
    type: API_REQUEST,
    payload: {
        url: BASEURL + 'api/v1/companies',
        method: 'GET',
        params:{page,limit},
        success: res => {
            return getListCompaniesData(res.data);
        }
    }
});


//job broker
export const getListCompaniesData = (data)=> {
    return {
        type: LIST_COMPANIES_SUCCESS,
        payload: data
    }
};