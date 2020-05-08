import {
    LIST_JOB_SUCCESS,
    DETAIL_JOB_SUCCESS,
    DELETE_JOB_SUCCESS,
    UPDATE_JOB_SUCCESS,
    SEARCH_JOB_SUCCESS,
    ACTIVE_JOB_SUCCESS

} from '../constants/jobs';

export const initialState = {
    list: [],
    detail: {},
};

export const jobs = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case LIST_JOB_SUCCESS:
            console.log("payload.data ", payload.data)
            return {
                ...state,
                list: payload.data
            };
        case DETAIL_JOB_SUCCESS:
            return {
                    ...state,
                    detail: payload.data
            }
        case  DELETE_JOB_SUCCESS:{
            return {
                ...state,
                list: {
                    ...state.list,
                   docs: state.list.docs.filter((item)=>{
                   return item._id !== payload._id

                })
                }
            }
        }
        case SEARCH_JOB_SUCCESS:{
            return {
                ...state,
                list: payload
            };
        }
        case UPDATE_JOB_SUCCESS:{
            return {
            ...state,
            detail: payload
            }
        }
        case ACTIVE_JOB_SUCCESS: {
            let list = state.list.docs;
            let index = list.findIndex(el => el._id === payload._id);
            list[index] = {country: payload.country,
                cv_location: payload.cv_location,
                status: payload.status,
                title: payload.title,
                _id:  payload._id};
            return {
                ...state,
                list: {
                    ...state.list,
                    docs:[...list]
                    }
                }
        }
        default:
            return state;
    }
};