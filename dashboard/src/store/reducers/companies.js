import {LIST_COMPANIES_SUCCESS} from '../constants/companies';

export const initialState = {
    list_company: [],
};

export const companies = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case LIST_COMPANIES_SUCCESS:
            return {
                ...state,
                list_company: payload
            };
        default:
            return state;
    }
};