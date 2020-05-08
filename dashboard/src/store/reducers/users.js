import {
    LIST_USER_SUCCESS,
    DETAIL_USER_SUCCESS,
    STATISTICS_USER_SUCCESS,
    DELETE_USER_SUCCESS,
    DISABLE_USER_SUCCESS,
} from '../constants/users';

export const initialState = {
    list: [],
    detail: {},
    statistics:0
};

export const users = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case LIST_USER_SUCCESS:
            return {
                ...state,
                list: payload
            };
        case DETAIL_USER_SUCCESS:
            return{
                ...state,
                detail: payload
            }
        case STATISTICS_USER_SUCCESS:
            return{
                ...state,
                statistics: payload
            }
        case DELETE_USER_SUCCESS:{
            return {
                ...state,
                list: {
                    ...state.list,
                    docs: state.list.docs.filter((item)=>{
                        return item._id !== payload

                    })
                }
            }
        }
        case DISABLE_USER_SUCCESS:{
            let list = state.list.docs;
            let index = list.findIndex(el => el._id === payload._id);
            list[index] = {_id: payload._id,phone: payload.phone, email: payload.email, isActive: payload.isActive,username: payload.username};
            return {
                ...state,
                list: {
                    ...state.list,
                    docs: [...list]
                }
            }
        }
        default:
            return state;
    }
};