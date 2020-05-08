import {
    JOB_BROKER_SUCCESS,
    LIST_BROKER_SUCCESS,
    DETAIL_BROKER_SUCCESS,
    DELETE_BROKER_SUCCESS,
    LIST_BROKER_PAGINATE_SUCCESS
} from '../constants/broker';

export const initialState = {
    job_broker: {},
    list_broker: [],
    broker_detail:{},
};

export const brokers = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case JOB_BROKER_SUCCESS:
            return {
                ...state,
                job_broker: payload.data
            };
        case LIST_BROKER_SUCCESS:
            return {
                ...state,
                list_broker: payload.data
            };
        case LIST_BROKER_PAGINATE_SUCCESS:
            return {
                ...state,
                list_broker: payload
            };
        case DETAIL_BROKER_SUCCESS:
            return{
                ...state,
                broker_detail: payload
            };
        case DELETE_BROKER_SUCCESS:
            return{
                state,
                list_broker:state.list_broker.filter((item)=>{
                return item._id !== payload
                })
            }
        default:
            return state;
    }
};