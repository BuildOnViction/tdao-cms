import {
    SAVE_SETTINGS_CONFIGURATION,
} from '../constants/settings';

export const initialState = {
    configurations: {},
    payment_settings: {},
    order_settings: {},
    all_business_tags: []
};

export const settings = (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case SAVE_SETTINGS_CONFIGURATION:
            return {
                ...state,
                configurations: {
                    ...state.configurations,
                    ...payload
                }
            };
        default:
            return state;
    }
};