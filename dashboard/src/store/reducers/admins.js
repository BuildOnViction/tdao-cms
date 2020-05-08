import {
    LIST_ADMIN_SUCCESS,
    ADMIN_DELETE_SUCCESS,
    ADMIN_DETAIL_SUCCESS,
    ADMIN_UPDATE_SUCCESS,
} from '../constants/admins';

export const initialState = {
    list: {},
    detail: {}
};

export const admins = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case LIST_ADMIN_SUCCESS:
            return {
                ...state,
                list: payload.data
            };
        case ADMIN_DELETE_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    docs: state.list.docs.filter((item)=>{
                        return item._id !== payload._id

                    })
                }
            }
        case ADMIN_DETAIL_SUCCESS:
            return{
                ...state,
                detail: payload
            }
        case  ADMIN_UPDATE_SUCCESS: {
            return{
                ...state,
                detail: payload
            }
        }
        default:
            return state;
    }
};